<template>
  <div class="flex flex-col gap-2.5">
    <div
      v-for="(f, i) in faqs"
      :key="f.q"
      :class="[
        'bg-white border rounded-xl overflow-hidden transition-colors',
        open === i ? 'border-brand-line' : 'border-line'
      ]"
    >
      <button
        type="button"
        @click="toggle(i)"
        class="w-full flex justify-between items-center gap-4 bg-transparent border-none px-6 py-[18px] cursor-pointer text-left font-sans"
        :aria-expanded="open === i"
      >
        <span :class="['text-[15px] text-ink', open === i ? 'font-bold' : 'font-medium']">{{ f.q }}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          class="flex-none transition-transform duration-[250ms]"
          :style="{ transform: `rotate(${open === i ? 180 : 0}deg)` }"
        >
          <path d="M2 5 L7 10 L12 5" fill="none" stroke="#A5282C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <div
        class="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        :style="{ maxHeight: open === i ? '220px' : '0px' }"
      >
        <p class="m-0 px-6 pb-5 pt-3.5 text-sm text-clay leading-[1.9] border-t border-dashed border-line-soft">{{ f.a }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const faqs = [
  { q: '你们说 80% 工作由 AI 完成，如何验证？', a: '每个迭代结束我们提供工作量核算清单：AI 产出并合入的代码、文档与测试占比，以及人工评审记录。数字可追溯到具体提交。' },
  { q: '项目周期一般多长？', a: '小型官网 2-4 周，管理系统 8-12 周，AI 应用视复杂度 6-16 周。签约前会给出带里程碑的交付计划。' },
  { q: '如何报价？', a: '按交付物固定报价为主，明确范围与验收标准；长期合作可采用「人 + Agent 编队」月度订阅。AI 承担的部分成本显著低于纯人力。' },
  { q: '交付后代码归谁？源码交付吗？', a: '归客户。全部源码、文档与部署脚本交付，并附一次交接培训。' },
  { q: '有维护和售后吗？', a: '交付后含 3 个月免费缺陷修复；此后可选维护套餐，AI 协作支持 24*7 在线，人工响应 24h 内。' },
  { q: '我们没有技术团队，能合作吗？', a: '可以。多数客户没有技术团队。我们提供从需求梳理到部署运维的完整服务，沟通用业务语言而不是术语。' },
  { q: '数据与代码的保密如何保证？', a: '签订保密协议；客户数据不用于模型训练；可按需提供私有化部署与内网交付方案。' },
  { q: '招商合作具体指什么？', a: '面向行业渠道伙伴：你提供行业场景与客户资源，我们提供 Agent 工程与交付能力，按项目分成或联合报价，共同服务客户。' },
];

const open = ref(0);
const toggle = (i: number) => {
  open.value = open.value === i ? -1 : i;
};
</script>
