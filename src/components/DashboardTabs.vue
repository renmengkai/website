<template>
  <div class="bg-white border border-line rounded-2xl overflow-hidden">
    <!-- Tab 栏 -->
    <div class="flex gap-1 px-3 py-2.5 border-b border-line-soft bg-paper overflow-x-auto">
      <button
        v-for="(label, i) in tabLabels"
        :key="label"
        @click="activeTab = i"
        :class="[
          'font-sans text-sm px-5 py-[9px] rounded-lg cursor-pointer whitespace-nowrap transition-colors border-none',
          activeTab === i
            ? 'font-semibold text-ink bg-white shadow-[0_1px_4px_rgba(34,30,27,0.08),inset_0_0_0_1px_#E7E1D8]'
            : 'font-normal text-stone bg-transparent hover:text-ink'
        ]"
      >
        {{ label }}
      </button>
    </div>

    <div class="p-6 sm:p-8 min-h-[320px]">
      <transition name="fade" mode="out-in">
        <!-- 概览 -->
        <div v-if="activeTab === 0" key="overview" class="flex flex-wrap gap-8 lg:gap-12">
          <div class="flex-[1.3] min-w-full sm:min-w-[340px] flex flex-col gap-[18px]">
            <span class="text-[13px] font-medium text-stone">项目类型分布</span>
            <div v-for="d in dist" :key="d.name" class="flex flex-col gap-[7px]">
              <div class="flex justify-between text-[13.5px]">
                <span class="text-ink font-medium">{{ d.name }}</span>
                <span class="font-mono text-stone">{{ d.pct }}%</span>
              </div>
              <div class="h-2 bg-cream rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :style="{ width: d.pct + '%', background: d.color }"
                ></div>
              </div>
            </div>
          </div>
          <div class="flex-1 min-w-full sm:min-w-[300px] grid grid-cols-2 gap-3 content-start">
            <div v-for="s in stats" :key="s.k" class="bg-paper border border-line-soft rounded-xl px-5 py-[18px]">
              <div class="font-mono text-[26px] font-medium text-ink">{{ s.v }}</div>
              <div class="text-[12.5px] text-stone mt-1">{{ s.k }}</div>
            </div>
          </div>
        </div>

        <!-- 技术分类 -->
        <div v-else-if="activeTab === 1" key="tech" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="t in tech" :key="t.name" class="border border-line rounded-xl p-6 flex flex-col gap-3.5">
            <div class="flex justify-between items-baseline">
              <span class="text-base font-bold text-ink">{{ t.name }}</span>
              <span class="font-mono text-[22px] text-brand">{{ t.pct }}%</span>
            </div>
            <div class="h-1.5 bg-cream rounded-full overflow-hidden">
              <div class="h-full bg-brand rounded-full transition-all duration-700" :style="{ width: t.pct + '%' }"></div>
            </div>
            <div class="flex gap-1.5 flex-wrap">
              <span
                v-for="g in t.tags"
                :key="g"
                class="font-mono text-[11.5px] text-clay bg-cream border border-line px-2.5 py-[3px] rounded-full"
              >{{ g }}</span>
            </div>
          </div>
        </div>

        <!-- 项目报告 -->
        <div v-else-if="activeTab === 2" key="report" class="flex flex-wrap gap-8 lg:gap-12">
          <div class="flex-[1.3] min-w-full sm:min-w-[340px] flex flex-col">
            <span class="text-[13px] font-medium text-stone mb-3.5">交付里程碑</span>
            <div v-for="m in milestones" :key="m.title" class="flex gap-4 py-3 border-b border-line-soft">
              <span class="font-mono text-xs text-mist w-[76px] flex-none pt-0.5">{{ m.date }}</span>
              <div class="flex-1">
                <div class="text-sm font-medium text-ink">{{ m.title }}</div>
                <div class="text-[12.5px] text-stone mt-0.5">{{ m.desc }}</div>
              </div>
              <span class="font-mono text-[11.5px] text-moss bg-moss-tint border border-moss-line px-2.5 py-0.5 rounded-full self-center flex-none">已交付</span>
            </div>
          </div>
          <div class="flex-1 min-w-full sm:min-w-[280px] flex flex-col gap-3">
            <span class="text-[13px] font-medium text-stone">亮点指标</span>
            <div v-for="h in highlights" :key="h.k" class="bg-paper border border-line-soft rounded-xl px-5 py-4 flex justify-between items-baseline">
              <span class="text-[13.5px] text-clay">{{ h.k }}</span>
              <span class="font-mono text-xl text-brand">{{ h.v }}</span>
            </div>
          </div>
        </div>

        <!-- 业务动态 -->
        <div v-else-if="activeTab === 3" key="news" class="flex flex-col max-w-[720px]">
          <div v-for="n in news" :key="n.title" class="flex gap-5">
            <div class="flex flex-col items-center flex-none">
              <span class="w-2.5 h-2.5 rounded-full bg-white border-[2.5px] border-brand mt-[5px]"></span>
              <span class="w-[1.5px] flex-1 bg-line"></span>
            </div>
            <div class="pb-[26px]">
              <span class="font-mono text-xs text-mist">{{ n.date }}</span>
              <div class="text-[14.5px] font-medium text-ink mt-[3px]">{{ n.title }}</div>
              <div v-if="n.desc" class="text-[13px] text-stone mt-[3px] leading-[1.7]">{{ n.desc }}</div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tabLabels = ['概览', '技术分类', '项目报告', '业务动态'];
const activeTab = ref(0);

// 概览 · 项目类型分布
const dist = [
  { name: '企业官网', pct: 35, color: '#A5282C' },
  { name: '管理系统', pct: 25, color: '#221E1B' },
  { name: '小程序', pct: 20, color: '#C9847F' },
  { name: 'AI 应用', pct: 20, color: '#D9D3CA' },
];

// 概览 · 统计
const stats = [
  { v: '40+', k: '交付项目' },
  { v: '96%', k: '按期完成率' },
  { v: '96%', k: '客户满意度' },
  { v: '28', k: '开源项目' },
];

// 技术分类
const tech = [
  { name: 'Web 开发', pct: 45, tags: ['TypeScript', 'React', 'Astro', 'Node.js'] },
  { name: '跨端应用', pct: 30, tags: ['Flutter', 'uni-app', '微信小程序'] },
  { name: '工具与 CLI', pct: 25, tags: ['Rust', 'Go', 'Node CLI'] },
];

// 项目报告 · 交付里程碑
const milestones = [
  { date: '2026-07', title: '某制造企业数字化中台一期交付', desc: '12 周交付，AI Agent 完成 82% 编码工作' },
  { date: '2026-06', title: '连锁零售小程序矩阵上线', desc: '3 端同步发布，首月 GMV 超预期 40%' },
  { date: '2026-05', title: '开源 CLI 工具 agentctl 发布 1.0', desc: 'GitHub 2.3k star，社区贡献者 31 人' },
  { date: '2026-04', title: 'AI 客服 Agent 交付某教育机构', desc: '人工客服工作量下降 65%' },
];

// 项目报告 · 亮点指标
const highlights = [
  { k: '平均交付周期', v: '-38%' },
  { k: '缺陷密度（对比行业）', v: '-52%' },
  { k: '需求响应', v: '24h 内' },
  { k: 'AI 协作在线', v: '24*7' },
];

// 业务动态
const news = [
  { date: '2026-07-10', title: '与河北两家制造企业达成数字化合作意向', desc: '围绕生产排程与质检环节引入 Agent 自动化' },
  { date: '2026-06-28', title: '多智能体编排框架内部版本升级 v3', desc: '任务图调度延迟下降 40%，支持人工检查点' },
  { date: '2026-06-15', title: '团队入选省级中小企业数字化服务商名录', desc: '' },
  { date: '2026-05-30', title: '开放 2026 下半年合作伙伴招募', desc: '面向行业渠道与解决方案伙伴' },
];
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
