<template>
  <div class="bezel">
    <div class="bezel-core overflow-hidden">
    <!-- 顶部导航栏 -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-fg">{{ currentTabTitle }}</span>
      </div>
      <nav class="hidden md:flex items-center gap-6">
        <button
          v-for="(item, i) in dashboard.navItems"
          :key="item"
          @click="activeTab = i"
          :class="[
            'text-sm transition-colors duration-200 cursor-pointer',
            activeTab === i ? 'text-fg font-medium' : 'text-fg-faint hover:text-fg-soft'
          ]"
        >
          {{ item }}
        </button>
      </nav>
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-void text-xs font-medium">
          RMK
        </div>
      </div>
    </div>

    <div class="p-6">
      <transition name="fade" mode="out-in">
        <!-- 概览 -->
        <div v-if="activeTab === 0" key="overview">
          <div class="flex flex-col lg:flex-row gap-8 mb-8">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-fg-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 class="text-xl font-semibold text-fg mb-1">项目类型分布</h3>
              <p class="text-sm text-fg-faint">{{ overview.description }}</p>
            </div>
            <div class="flex gap-8">
              <div v-for="stat in dashboard.stats" :key="stat.label" class="text-center">
                <div class="flex items-center justify-center gap-1 mb-1">
                  <span class="text-2xl font-bold text-fg">{{ stat.value }}</span>
                  <span class="text-primary-400 text-sm">{{ stat.trend }}</span>
                </div>
                <p class="text-sm text-fg-ghost">{{ stat.label }}</p>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="type in overview.types"
              :key="type.name"
              class="rounded-2xl p-5 border border-white/10 bg-white/[0.04]"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-semibold text-fg">{{ type.name }}</span>
                <span class="text-xs text-fg-ghost">{{ type.description }}</span>
              </div>
              <div class="flex items-baseline gap-2 mb-3">
                <span class="text-2xl font-bold text-fg">{{ type.count }}</span>
                <span class="text-xs text-fg-ghost">个项目</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-primary-500 rounded-full transition-all duration-700" :style="{ width: type.percent + '%' }"></div>
                </div>
                <span class="text-xs font-medium text-fg-faint">{{ type.percent }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 技术分类 -->
        <div v-else-if="activeTab === 1" key="tech">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
              <svg class="w-5 h-5 text-fg-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 4l-4 4 4 4" />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-semibold text-fg mb-1">技术栈分布</h3>
          <p class="text-sm text-fg-faint mb-6">{{ tech.description }}</p>

          <!-- 技术分类分组 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="group in tech.groups" :key="group.name" class="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
              <!-- 分组标题 -->
              <div class="flex items-center justify-between px-5 py-4 bg-white/[0.04] border-b border-white/[0.08]">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                    <svg v-if="group.icon === 'web'" class="w-4 h-4 text-void" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                    <svg v-else-if="group.icon === 'mobile'" class="w-4 h-4 text-void" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    <svg v-else-if="group.icon === 'cli'" class="w-4 h-4 text-void" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </div>
                  <span class="text-sm font-semibold text-fg">{{ group.name }}</span>
                </div>
                <span class="text-xs font-medium px-2 py-1 rounded-full bg-white/[0.05] text-fg-faint">{{ group.percent }}%</span>
              </div>
              <!-- 语言列表 -->
              <div class="px-5 py-3 border-b border-white/[0.08]">
                <div class="flex flex-wrap gap-1">
                  <span v-for="lang in group.languages" :key="lang" class="text-xs px-2 py-1 rounded bg-white/[0.05] text-fg-faint">{{ lang }}</span>
                </div>
              </div>
              <!-- 框架列表 -->
              <div class="px-5 py-4">
                <div class="flex flex-wrap gap-2">
                  <span v-for="fw in group.frameworks" :key="fw" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.05] text-fg-soft border border-white/10 hover:bg-white/[0.09] transition-colors">
                    <svg class="w-3 h-3 text-fg-ghost" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    {{ fw }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目报告 -->
        <div v-else-if="activeTab === 2" key="report">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
              <svg class="w-5 h-5 text-fg-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-semibold text-fg mb-1">项目报告</h3>
          <p class="text-sm text-fg-faint mb-6">{{ report.description }}</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="ms in report.milestones" :key="ms.label" class="group">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-fg-soft">{{ ms.label }}</span>
                <span class="text-sm text-fg-ghost">{{ ms.value }}/{{ ms.total }}</span>
              </div>
              <div class="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary-500 rounded-full transition-all duration-700"
                  :style="{ width: (parseInt(ms.value) / parseInt(ms.total) * 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div v-for="hl in report.highlights" :key="hl.title" class="bg-white/[0.04] rounded-2xl p-5 border border-white/10">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-primary-400 font-medium px-2 py-0.5 bg-primary-500/10 rounded-full">{{ hl.tag }}</span>
              </div>
              <span class="text-2xl font-bold text-fg">{{ hl.value }}</span>
              <p class="text-sm text-fg-faint mt-1">{{ hl.title }}</p>
            </div>
          </div>
        </div>

        <!-- 业务动态 -->
        <div v-else-if="activeTab === 3" key="updates">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
              <svg class="w-5 h-5 text-fg-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-semibold text-fg mb-1">业务动态</h3>
          <p class="text-sm text-fg-faint mb-6">{{ updates.description }}</p>

          <div class="space-y-4">
            <div
              v-for="(update, i) in updates.updates"
              :key="i"
              class="flex items-center gap-4 p-4 bg-white/[0.04] rounded-2xl border border-white/10 hover:bg-white/[0.06] transition-all duration-200"
            >
              <div class="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center border border-white/10 shrink-0">
                <span class="text-lg text-fg">{{ i + 1 }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <span class="text-sm font-medium text-fg">{{ update.title }}</span>
              </div>
              <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-white/[0.05] text-fg-faint shrink-0">
                {{ update.tag }}
              </span>
              <span class="text-xs text-fg-ghost shrink-0">{{ update.date }}</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import config from '../../../data/projectTypes.json';

const dashboard = ref(config.dashboard);
const overview = ref(config.dashboard.overview);
const tech = ref(config.dashboard.techCategories);
const report = ref(config.dashboard.projectReport);
const updates = ref(config.dashboard.businessUpdates);

const activeTab = ref(0);

const currentTabTitle = computed(() => {
  return dashboard.value.navItems[activeTab.value];
});
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