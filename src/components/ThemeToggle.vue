<template>
  <button
    @click="toggleTheme"
    class="relative p-2.5 rounded-xl transition-all duration-300
           bg-gray-100 hover:bg-gray-200
           dark:bg-dark-100 dark:hover:bg-dark-200
           focus:outline-none focus:ring-2 focus:ring-primary-500/50"
    :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
  >
    <!-- 太阳图标 (浅色模式) -->
    <svg
      v-if="!isDark"
      class="w-5 h-5 text-amber-500 transition-transform duration-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
    <!-- 月亮图标 (深色模式) -->
    <svg
      v-else
      class="w-5 h-5 text-primary-400 transition-transform duration-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  updateTheme();
};

const updateTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

onMounted(() => {
  // 检查系统偏好或本地存储
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // 默认使用浅色模式，除非用户明确选择了深色
  isDark.value = stored === 'dark' || (!stored && prefersDark);
  
  // 如果是首次访问，默认浅色模式
  if (!stored) {
    isDark.value = false;
  }
  
  updateTheme();
});
</script>
