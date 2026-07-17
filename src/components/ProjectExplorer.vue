<template>
  <div>
    <!-- 搜索 + 分类筛选 -->
    <div class="flex gap-4 items-center flex-wrap mb-6">
      <div class="relative flex-1 min-w-[260px] max-w-[380px]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <circle cx="7" cy="7" r="5.2" fill="none" stroke="#8A8178" stroke-width="1.6" />
          <path d="M11 11 L14.5 14.5" stroke="#8A8178" stroke-width="1.6" stroke-linecap="round" />
        </svg>
        <input
          v-model="q"
          type="text"
          placeholder="搜索项目…"
          class="w-full box-border font-sans text-sm text-ink bg-white border border-line-strong rounded-lg py-[11px] pr-3.5 pl-10 outline-none transition-shadow focus:border-brand focus:shadow-[0_0_0_3px_rgba(165,40,44,0.12)]"
        />
      </div>
      <div v-if="cats.length > 1" class="flex gap-2 flex-wrap">
        <button
          v-for="c in cats"
          :key="c"
          @click="cat = c"
          :class="[
            'font-sans text-[13px] px-4 py-[7px] rounded-full cursor-pointer transition-colors border',
            cat === c
              ? 'font-medium text-white bg-ink border-ink'
              : 'font-normal text-clay bg-white border-line-strong hover:border-ink'
          ]"
        >
          {{ c }}
        </button>
      </div>
    </div>

    <!-- 空状态 -->
    <div
      v-if="filtered.length === 0"
      class="bg-white border border-dashed border-sand rounded-xl flex flex-col items-center justify-center gap-3 px-6 py-[72px] text-center"
    >
      <span class="logo-wave flex-none w-[72px] h-4 bg-sand"></span>
      <div class="text-[15px] font-medium text-ink">没有找到匹配的项目</div>
      <p class="m-0 text-[13px] text-stone">试试更换关键词，或清除筛选条件</p>
      <button
        @click="clearFilters"
        class="bg-white text-ink border border-line-strong font-sans text-[13px] px-[18px] py-2 rounded-lg cursor-pointer transition-colors hover:border-ink"
      >
        清除筛选
      </button>
    </div>

    <!-- 项目网格 -->
    <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
      <a
        v-for="p in filtered"
        :key="p.slug"
        :href="`/projects/${p.slug}`"
        class="bg-white border border-line rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-[0_8px_28px_rgba(34,30,27,0.08)] hover:-translate-y-0.5"
      >
        <div v-if="p.thumbnail" class="aspect-[16/10] bg-ink overflow-hidden">
          <img :src="p.thumbnail" :alt="p.title" class="w-full h-full object-cover" loading="lazy" />
        </div>
        <div v-else class="aspect-[16/10] bg-ink flex flex-col items-center justify-center gap-2">
          <span class="logo-wave flex-none w-[60px] h-3 bg-ink-soft"></span>
        </div>
        <div class="px-5 pt-[18px] pb-[22px]">
          <h3 class="text-[17px] font-bold text-ink m-0 mb-1.5 leading-normal">{{ p.title }}</h3>
          <p class="m-0 text-[13.5px] text-stone leading-[1.7] line-clamp-2">{{ p.description }}</p>
          <div v-if="p.tags.length > 0" class="flex gap-1.5 flex-wrap mt-3">
            <span
              v-for="(tag, i) in p.tags"
              :key="tag"
              :class="[
                'font-mono text-[11.5px] px-2.5 py-[3px] rounded-full border',
                i === 0
                  ? 'text-brand bg-brand-tint border-brand-line'
                  : 'text-clay bg-cream border-line'
              ]"
            >{{ tag }}</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface ProjectItem {
  slug: string;
  title: string;
  description: string;
  thumbnail: string | null;
  category: string | null;
  tags: string[];
}

const props = defineProps<{
  projects: ProjectItem[];
}>();

const q = ref('');
const cat = ref('全部');

// 分类胶囊：从真实项目数据中提取去重分类，保证每个胶囊都能筛出结果
const cats = computed(() => {
  const set = new Set<string>();
  for (const p of props.projects) {
    if (p.category) set.add(p.category);
  }
  return ['全部', ...set];
});

const filtered = computed(() => {
  const keyword = q.value.trim().toLowerCase();
  return props.projects.filter((p) => {
    const matchCat = cat.value === '全部' || p.category === cat.value;
    const matchQ =
      !keyword ||
      p.title.toLowerCase().includes(keyword) ||
      (p.description || '').toLowerCase().includes(keyword);
    return matchCat && matchQ;
  });
});

function clearFilters() {
  q.value = '';
  cat.value = '全部';
}
</script>
