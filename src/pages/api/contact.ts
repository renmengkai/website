import type { APIRoute } from 'astro';

// 检测是否在 Deno 环境中
const isDeno = typeof (globalThis as any).Deno !== 'undefined';

// 开发环境内存存储
const memoryStore: Map<string, unknown> = new Map();

// ============ 速率限制配置 ============
const RATE_LIMIT = {
  MAX_REQUESTS_PER_MINUTE: 3,      // 每分钟最多3次请求
  MAX_REQUESTS_PER_HOUR: 10,       // 每小时最多10次请求
  MAX_REQUESTS_PER_DAY: 20,        // 每天最多20次请求
  WINDOW_MINUTE: 60 * 1000,        // 1分钟窗口
  WINDOW_HOUR: 60 * 60 * 1000,     // 1小时窗口
  WINDOW_DAY: 24 * 60 * 60 * 1000, // 1天窗口
};

// 消息存储限制
const STORAGE_LIMIT = {
  MAX_MESSAGES: 1000,              // 最多存储1000条消息
  CLEANUP_THRESHOLD: 1100,         // 超过此数量时触发清理
  CLEANUP_BATCH: 200,              // 每次清理200条旧消息
};

// 内存速率限制记录（开发环境用）
const rateLimitStore: Map<string, { timestamps: number[] }> = new Map();

// KV 存储抽象
async function getKvStore() {
  if (isDeno) {
    return await (globalThis as any).Deno.openKv();
  }
  // 开发环境使用内存存储
  return {
    async set(key: unknown[], value: unknown) {
      memoryStore.set(JSON.stringify(key), value);
    },
    async get(key: unknown[]) {
      const value = memoryStore.get(JSON.stringify(key));
      return { value: value ?? null };
    },
    async delete(key: unknown[]) {
      memoryStore.delete(JSON.stringify(key));
    },
    list(options: { prefix: unknown[] }) {
      const prefix = JSON.stringify(options.prefix);
      const results: { key: unknown[]; value: unknown }[] = [];
      for (const [key, value] of memoryStore.entries()) {
        if (key.startsWith(prefix.slice(0, -1))) {
          results.push({ key: JSON.parse(key), value });
        }
      }
      return {
        async *[Symbol.asyncIterator]() {
          for (const item of results) {
            yield item;
          }
        }
      };
    }
  };
}

// ============ 速率限制函数 ============

// 获取客户端IP
function getClientIP(request: Request): string {
  // Deno Deploy / Cloudflare / 反向代理常用头
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  // 开发环境默认
  return 'localhost';
}

// 检查速率限制
async function checkRateLimit(ip: string): Promise<{ allowed: boolean; retryAfter?: number; message?: string }> {
  const now = Date.now();
  const kv = await getKvStore();
  
  // 获取该IP的请求记录
  const rateLimitKey = ['rate_limit', ip];
  const record = await kv.get(rateLimitKey);
  let timestamps: number[] = (record.value as { timestamps: number[] })?.timestamps || [];
  
  // 清理过期记录（保留最近24小时内的）
  timestamps = timestamps.filter(t => now - t < RATE_LIMIT.WINDOW_DAY);
  
  // 检查各时间窗口的请求数
  const requestsLastMinute = timestamps.filter(t => now - t < RATE_LIMIT.WINDOW_MINUTE).length;
  const requestsLastHour = timestamps.filter(t => now - t < RATE_LIMIT.WINDOW_HOUR).length;
  const requestsLastDay = timestamps.length;
  
  // 检查是否超过限制
  if (requestsLastMinute >= RATE_LIMIT.MAX_REQUESTS_PER_MINUTE) {
    const oldestInMinute = timestamps.filter(t => now - t < RATE_LIMIT.WINDOW_MINUTE)[0];
    const retryAfter = Math.ceil((oldestInMinute + RATE_LIMIT.WINDOW_MINUTE - now) / 1000);
    return { 
      allowed: false, 
      retryAfter,
      message: `请求过于频繁，请${retryAfter}秒后重试`
    };
  }
  
  if (requestsLastHour >= RATE_LIMIT.MAX_REQUESTS_PER_HOUR) {
    const oldestInHour = timestamps.filter(t => now - t < RATE_LIMIT.WINDOW_HOUR)[0];
    const retryAfter = Math.ceil((oldestInHour + RATE_LIMIT.WINDOW_HOUR - now) / 1000);
    return { 
      allowed: false, 
      retryAfter,
      message: `请求过于频繁，请${Math.ceil(retryAfter / 60)}分钟后重试`
    };
  }
  
  if (requestsLastDay >= RATE_LIMIT.MAX_REQUESTS_PER_DAY) {
    return { 
      allowed: false, 
      retryAfter: 3600,
      message: '您今天的消息数量已达上限，请明天再试'
    };
  }
  
  // 记录本次请求
  timestamps.push(now);
  await kv.set(rateLimitKey, { timestamps });
  
  return { allowed: true };
}

// ============ 存储限制函数 ============

// 检查并清理旧消息
async function cleanupOldMessages(): Promise<void> {
  const kv = await getKvStore();
  const messages: { key: unknown[]; createdAt: string }[] = [];
  
  // 获取所有消息
  const entries = kv.list({ prefix: ['contacts'] });
  for await (const entry of entries) {
    if (entry.key[0] === 'contacts_index') continue;
    const value = entry.value as { createdAt: string };
    messages.push({ key: entry.key, createdAt: value.createdAt });
  }
  
  // 如果超过阈值，删除最旧的消息
  if (messages.length >= STORAGE_LIMIT.CLEANUP_THRESHOLD) {
    // 按时间排序，最旧的在前面
    messages.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    // 删除最旧的一批
    const toDelete = messages.slice(0, STORAGE_LIMIT.CLEANUP_BATCH);
    for (const msg of toDelete) {
      await kv.delete(msg.key as unknown[]);
      // 同时删除索引
      const value = await kv.get(msg.key as unknown[]);
      if (value.value) {
        const record = value.value as { id: string; createdAt: string };
        await kv.delete(['contacts_index', record.createdAt, record.id]);
      }
    }
    
    console.log(`Cleaned up ${toDelete.length} old messages`);
  }
}

// 联系表单数据类型
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// 验证结果类型
interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// 验证邮箱格式
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 验证表单数据
function validateFormData(data: Partial<ContactFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  // 姓名验证
  if (!data.name || data.name.trim().length === 0) {
    errors.name = '请输入您的姓名';
  } else if (data.name.trim().length < 2) {
    errors.name = '姓名至少需要2个字符';
  } else if (data.name.trim().length > 50) {
    errors.name = '姓名不能超过50个字符';
  }

  // 邮箱验证
  if (!data.email || data.email.trim().length === 0) {
    errors.email = '请输入您的邮箱';
  } else if (!isValidEmail(data.email.trim())) {
    errors.email = '请输入有效的邮箱地址';
  }

  // 主题验证
  const validSubjects = ['project', 'tech', 'feedback', 'other'];
  if (!data.subject || data.subject.trim().length === 0) {
    errors.subject = '请选择咨询类型';
  } else if (!validSubjects.includes(data.subject)) {
    errors.subject = '请选择有效的咨询类型';
  }

  // 消息内容验证
  if (!data.message || data.message.trim().length === 0) {
    errors.message = '请输入消息内容';
  } else if (data.message.trim().length < 10) {
    errors.message = '消息内容至少需要10个字符';
  } else if (data.message.trim().length > 2000) {
    errors.message = '消息内容不能超过2000个字符';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // 获取客户端IP并检查速率限制
    const clientIP = getClientIP(request);
    const rateLimit = await checkRateLimit(clientIP);
    
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({
        success: false,
        message: rateLimit.message,
        retryAfter: rateLimit.retryAfter
      }), {
        status: 429,
        headers: { 
          'Content-Type': 'application/json',
          'Retry-After': String(rateLimit.retryAfter || 60)
        }
      });
    }

    // 解析请求体
    const body = await request.json();
    
    // 验证数据
    const validation = validateFormData(body);
    
    if (!validation.valid) {
      return new Response(JSON.stringify({
        success: false,
        errors: validation.errors
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 清理数据
    const formData: ContactFormData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      subject: body.subject,
      message: body.message.trim()
    };

    // 存储到 Deno KV
    const kv = await getKvStore();
    
    // 生成唯一ID（时间戳 + 随机字符）
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // 存储消息记录
    const record = {
      id,
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'unread' // unread, read, replied
    };
    
    // 使用复合键：["contacts", id]
    await kv.set(['contacts', id], record);
    
    // 同时维护一个索引，按时间排序
    await kv.set(['contacts_index', record.createdAt, id], { id });
    
    // 异步清理旧消息（不阻塞响应）
    cleanupOldMessages().catch(err => console.error('Cleanup error:', err));

    return new Response(JSON.stringify({
      success: true,
      message: '消息发送成功，我们会尽快回复您！',
      id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: '服务器错误，请稍后重试'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// 可选：GET 方法用于获取联系消息列表（管理用途）
export const GET: APIRoute = async ({ url }) => {
  try {
    const kv = await getKvStore();
    const messages: unknown[] = [];
    
    // 获取限制数量参数
    const limit = parseInt(url.searchParams.get('limit') || '50');
    
    // 遍历所有联系消息
    const entries = kv.list({ prefix: ['contacts'] });
    let count = 0;
    
    for await (const entry of entries) {
      // 跳过索引条目
      if (entry.key[0] === 'contacts_index') continue;
      
      messages.push(entry.value);
      count++;
      
      if (count >= limit) break;
    }
    
    // 按创建时间倒序排序
    messages.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return new Response(JSON.stringify({
      success: true,
      data: messages,
      total: messages.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: '获取消息列表失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
