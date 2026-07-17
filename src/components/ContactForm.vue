<template>
  <div class="bg-white border border-line rounded-2xl p-7 sm:px-11 sm:py-10">
    <h2 class="font-serif text-2xl font-bold text-ink m-0 mb-1.5">留下你的需求</h2>
    <p class="m-0 mb-7 text-[13.5px] text-stone">带 * 为必填。我们不会将你的信息用于任何营销用途。</p>

    <!-- 成功横幅 -->
    <div
      v-if="result === 'ok'"
      class="flex items-center gap-2.5 bg-moss-tint border border-moss-line rounded-[10px] px-[18px] py-3.5 mb-6"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" class="flex-none">
        <circle cx="9" cy="9" r="8" fill="#2E7D5B"></circle>
        <path d="M5.5 9.5 L8 12 L12.5 6.5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      <span class="text-sm text-moss font-medium">{{ successText }}</span>
    </div>

    <!-- 失败横幅 -->
    <div
      v-if="result === 'fail'"
      class="flex items-center gap-2.5 bg-[#FDF6F5] border border-[#EFCFCB] rounded-[10px] px-[18px] py-3.5 mb-6"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" class="flex-none">
        <circle cx="9" cy="9" r="8" fill="#C4453A"></circle>
        <path d="M9 5 v5 M9 13 v.2" stroke="#fff" stroke-width="1.8" stroke-linecap="round"></path>
      </svg>
      <span class="text-sm text-[#C4453A] font-medium">{{ failText }}</span>
    </div>

    <form novalidate @submit.prevent="onSubmit">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <!-- 姓名 -->
        <div class="flex flex-col gap-[7px]">
          <label for="cf-name" class="text-[13.5px] font-medium text-ink">姓名 *</label>
          <input
            id="cf-name"
            v-model="form.name"
            type="text"
            name="name"
            placeholder="怎么称呼你"
            :class="[inputBase, stateClass('name')]"
            class="font-sans text-sm px-3.5 py-[11px]"
            @blur="touch('name')"
            @input="clearServerError('name')"
          />
          <span v-if="errorFor('name')" class="text-xs text-[#C4453A]">{{ errorFor('name') }}</span>
        </div>
        <!-- 邮箱 -->
        <div class="flex flex-col gap-[7px]">
          <label for="cf-email" class="text-[13.5px] font-medium text-ink">邮箱 *</label>
          <input
            id="cf-email"
            v-model="form.email"
            type="email"
            name="email"
            placeholder="you@company.com"
            :class="[inputBase, stateClass('email')]"
            class="font-mono text-[13.5px] px-3.5 py-[11.5px]"
            @blur="touch('email')"
            @input="clearServerError('email')"
          />
          <span v-if="errorFor('email')" class="text-xs text-[#C4453A]">{{ errorFor('email') }}</span>
        </div>
      </div>

      <!-- 主题 -->
      <div class="flex flex-col gap-[7px] mt-5">
        <label for="cf-subject" class="text-[13.5px] font-medium text-ink">主题 *</label>
        <select
          id="cf-subject"
          v-model="form.subject"
          name="subject"
          :class="inputBase"
          class="font-sans text-sm px-3.5 py-[11px] border-line-strong bg-white cursor-pointer"
          style="appearance: auto"
          @change="clearServerError('subject')"
        >
          <option v-for="opt in subjects" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
        <span v-if="serverErrors.subject" class="text-xs text-[#C4453A]">{{ serverErrors.subject }}</span>
      </div>

      <!-- 消息 -->
      <div class="flex flex-col gap-[7px] mt-5">
        <div class="flex justify-between items-baseline">
          <label for="cf-message" class="text-[13.5px] font-medium text-ink">消息 *</label>
          <span class="font-mono text-[11.5px]" :class="form.message.length > 1900 ? 'text-[#C4453A]' : 'text-mist'">
            {{ form.message.length }}/2000
          </span>
        </div>
        <textarea
          id="cf-message"
          :value="form.message"
          name="message"
          rows="6"
          placeholder="简单描述你的项目背景、目标与期望时间…"
          :class="[inputBase, stateClass('message')]"
          class="font-sans text-sm leading-[1.8] px-3.5 py-3 resize-y"
          @input="onMessageInput"
          @blur="touch('message')"
        ></textarea>
        <span v-if="errorFor('message')" class="text-xs text-[#C4453A]">{{ errorFor('message') }}</span>
      </div>

      <!-- 提交 -->
      <div class="mt-7">
        <button
          v-if="!submitting"
          type="submit"
          class="bg-brand text-white border-none font-sans text-[15px] font-medium px-9 py-[13px] rounded-lg cursor-pointer hover:bg-brand-dark transition-colors"
        >
          发送消息
        </button>
        <button
          v-else
          type="button"
          disabled
          class="bg-brand text-white border-none font-sans text-[15px] font-medium px-9 py-[13px] rounded-lg cursor-wait inline-flex items-center gap-[9px] opacity-85"
        >
          <span class="w-[15px] h-[15px] border-2 border-white/35 border-t-white rounded-full inline-block animate-spin"></span>
          发送中…
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';

const props = defineProps<{
  /** 展示用联系邮箱（失败提示中引导用户直接发邮件） */
  contactEmail: string;
}>();

// 主题选项：label 按设计稿，value 沿用 /api/contact 校验的枚举值
const subjects = [
  { value: 'project', label: '项目合作' },
  { value: 'tech', label: '技术咨询' },
  { value: 'feedback', label: '反馈建议' },
  { value: 'other', label: '其他' },
];

const form = reactive({ name: '', email: '', subject: 'project', message: '' });
const touched = reactive<Record<string, boolean>>({});
const serverErrors = reactive<Record<string, string>>({});
const submitting = ref(false);
const result = ref<'' | 'ok' | 'fail'>('');
const successText = '发送成功！我们会在 24 小时内回复到你的邮箱。';
const serverFailMessage = ref('');

const failText = computed(
  () => serverFailMessage.value || `发送失败，请稍后重试，或直接发邮件到 ${props.contactEmail}。`
);

const inputBase =
  'w-full border rounded-lg text-ink outline-none transition-[border-color,box-shadow,background-color] duration-150 ' +
  'placeholder:text-mist focus:border-brand focus:shadow-[0_0_0_3px_rgba(165,40,44,0.12)]';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function localError(field: string): string {
  if (field === 'name') return form.name.trim() ? '' : '请输入姓名';
  if (field === 'email') return emailRegex.test(form.email.trim()) ? '' : '请输入有效的邮箱地址';
  if (field === 'message') return form.message.trim().length >= 10 ? '' : '请输入至少 10 个字的消息内容';
  return '';
}

function errorFor(field: string): string {
  return serverErrors[field] || (touched[field] ? localError(field) : '');
}

function stateClass(field: string): string {
  return errorFor(field) ? 'border-[#C4453A] bg-[#FDF6F5]' : 'border-line-strong bg-white';
}

function touch(field: string) {
  touched[field] = true;
}

function clearServerError(field: string) {
  delete serverErrors[field];
}

function onMessageInput(e: Event) {
  form.message = (e.target as HTMLTextAreaElement).value.slice(0, 2000);
  clearServerError('message');
}

async function onSubmit() {
  touched.name = touched.email = touched.message = true;
  result.value = '';
  serverFailMessage.value = '';
  Object.keys(serverErrors).forEach((k) => delete serverErrors[k]);

  if (localError('name') || localError('email') || localError('message')) return;

  submitting.value = true;
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject,
        message: form.message.trim(),
      }),
    });
    const data = await response.json();

    if (data.success) {
      result.value = 'ok';
      form.name = '';
      form.message = '';
      Object.keys(touched).forEach((k) => delete touched[k]);
    } else {
      result.value = 'fail';
      if (data.message) serverFailMessage.value = data.message;
      if (data.errors) Object.assign(serverErrors, data.errors);
    }
  } catch {
    result.value = 'fail';
  } finally {
    submitting.value = false;
  }
}
</script>
