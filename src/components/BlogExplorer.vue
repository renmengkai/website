<template>
  <div>
    <!-- 搜索 + 分类筛选 -->
    <div class="flex items-center gap-4 flex-wrap pb-6">
      <div class="relative flex-1 min-w-[260px] max-w-[380px]">
        <svg width="16" height="16" viewBox="0 0 16 16" class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <circle cx="7" cy="7" r="5.2" fill="none" stroke="#8A8178" stroke-width="1.6" />
          <path d="M11 11 L14.5 14.5" stroke="#8A8178" stroke-width="1.6" stroke-linecap="round" />
        </svg>
        <input
          v-model="q"
          type="text"
          placeholder="按标题搜索文章…"
          class="w-full box-border font-sans text-sm text-ink bg-white border border-line-strong rounded-lg py-[11px] pr-3.5 pl-10 outline-none transition-all focus:border-brand focus:shadow-[0_0_0_3px_rgba(165,40,44,0.12)]"
        />
      </div>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="c in cats"
          :key="c"
          @click="cat = c"
          :class="[
            'font-sans text-[13px] px-4 py-[7px] rounded-full border cursor-pointer transition-colors',
            cat === c
              ? 'font-medium text-white bg-ink border-ink'
              : 'font-normal text-clay bg-white border-line-strong hover:border-ink'
          ]"
        >{{ c }}</button>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="pt-2 pb-14">
      <!-- 空状态 -->
      <div
        v-if="filtered.length === 0"
        class="border border-dashed border-sand rounded-xl bg-white flex flex-col items-center justify-center gap-3 px-6 py-[72px] text-center"
      >
        <span class="logo-wave flex-none w-[72px] h-4 bg-sand"></span>
        <div class="text-[15px] font-medium text-ink">没有找到匹配的文章</div>
        <p class="m-0 text-[13px] text-stone">试试更换关键词，或清除筛选条件</p>
        <button
          @click="clearFilters"
          class="font-sans bg-white text-ink border border-line-strong text-[13px] px-[18px] py-2 rounded-lg cursor-pointer hover:border-ink transition-colors"
        >清除筛选</button>
      </div>

      <!-- 卡片网格 -->
      <template v-else>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          <a
            v-for="post in shownPosts"
            :key="post._id"
            :href="`/blog/${post.slug?.current}`"
            class="bg-white border border-line rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-[0_8px_28px_rgba(34,30,27,0.08)] hover:-translate-y-0.5"
          >
            <div v-if="post.coverImage" class="aspect-video bg-cream border-b border-line-soft overflow-hidden">
              <img :src="post.coverImage" :alt="post.title" class="w-full h-full object-cover" loading="lazy" />
            </div>
            <div v-else class="aspect-video bg-cream border-b border-line-soft flex flex-col items-center justify-center gap-2">
              <span class="logo-wave flex-none w-[60px] h-3 bg-sand"></span>
            </div>
            <div class="px-5 pt-[18px] pb-[22px]">
              <span
                v-if="post.categories?.[0]?.title"
                class="font-mono text-[11.5px] text-brand bg-brand-tint border border-brand-line px-2.5 py-[3px] rounded-full"
              >{{ post.categories[0].title }}</span>
              <h3 class="text-[17px] font-bold text-ink mt-3 mb-1.5 leading-normal">{{ post.title }}</h3>
              <p class="m-0 text-[13.5px] text-stone leading-[1.7] line-clamp-2">{{ post.excerpt }}</p>
              <span class="block font-mono text-xs text-mist mt-3">{{ formatDate(post.publishedAt) }}</span>
            </div>
          </a>
        </div>

        <!-- 加载更多 -->
        <div v-if="hasMore" class="flex justify-center mt-9">
          <button
            @click="shown += PAGE"
            class="font-sans bg-white text-ink border border-line-strong text-sm font-medium px-8 py-[11px] rounded-lg cursor-pointer hover:border-ink transition-colors"
          >加载更多 · 还有 {{ remain }} 篇</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
  coverImage?: string;
  categories?: { title: string; slug?: { current: string } }[];
}

const props = defineProps<{ posts: Post[] }>();

const PAGE = 6;
const q = ref('');
const cat = ref('全部');
const shown = ref(PAGE);

// 「全部」 + 从真实文章 categories 去重汇总的分类名
const cats = computed(() => {
  const names = new Set<string>();
  for (const p of props.posts) {
    for (const c of p.categories || []) {
      if (c?.title) names.add(c.title);
    }
  }
  return ['全部', ...names];
});

const filtered = computed(() => {
  const kw = q.value.trim().toLowerCase();
  return props.posts.filter(
    (p) =>
      (cat.value === '全部' || (p.categories || []).some((c) => c?.title === cat.value)) &&
      (!kw || (p.title || '').toLowerCase().includes(kw))
  );
});

// 搜索或切换分类时重置分页
watch([q, cat], () => {
  shown.value = PAGE;
});

const shownPosts = computed(() => filtered.value.slice(0, shown.value));
const hasMore = computed(() => filtered.value.length > shown.value);
const remain = computed(() => Math.max(0, filtered.value.length - shown.value));

const clearFilters = () => {
  q.value = '';
  cat.value = '全部';
};

const formatDate = (d?: string) => (d ? new Date(d).toISOString().slice(0, 10) : '');
</script>
