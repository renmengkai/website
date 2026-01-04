<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

// 状态
const isLoading = ref(true);
const contentRef = ref<HTMLElement | null>(null);

// 初始化复制按钮功能
function initCopyButtons() {
  if (!contentRef.value) return;
  
  const copyButtons = contentRef.value.querySelectorAll('.copy-code-btn');
  
  copyButtons.forEach(button => {
    // 避免重复绑定
    if ((button as any)._copyBound) return;
    (button as any)._copyBound = true;
    
    button.addEventListener('click', async () => {
      const codeText = button.getAttribute('data-code') || '';
      const copyText = button.querySelector('.copy-text');
      const copiedText = button.querySelector('.copied-text');
      
      try {
        // 解码 HTML 实体
        const textarea = document.createElement('textarea');
        textarea.innerHTML = codeText;
        const decodedCode = textarea.value;
        
        // 复制到剪贴板
        await navigator.clipboard.writeText(decodedCode);
        
        // 显示复制成功提示
        if (copyText && copiedText) {
          copyText.classList.add('hidden');
          copiedText.classList.remove('hidden');
          
          // 2秒后恢复
          setTimeout(() => {
            copyText.classList.remove('hidden');
            copiedText.classList.add('hidden');
          }, 2000);
        }
      } catch (err) {
        console.error('复制失败:', err);
      }
    });
  });
}

onMounted(async () => {
  // 确保内容已经渲染完成
  await nextTick();
  
  // 使用最小延迟让浏览器完成绘制，然后显示内容
  // 这个延迟让骨架屏有短暂显示，给用户「正在加载」的感觉
  setTimeout(() => {
    isLoading.value = false;
    // 初始化复制按钮
    nextTick(() => {
      initCopyButtons();
    });
  }, 100);
});
</script>

<template>
  <div class="post-content-loader">
    <!-- 骨架屏 - 仅在加载时显示 -->
    <div 
      v-show="isLoading" 
      class="skeleton-wrapper animate-pulse"
    >
      <!-- 文章内容骨架 -->
      <div class="space-y-4">
        <!-- 段落骨架 -->
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10/12"></div>
        </div>
        
        <!-- 标题骨架 -->
        <div class="pt-4">
          <div class="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
        
        <!-- 更多段落骨架 -->
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-9/12"></div>
        </div>
        
        <!-- 代码块骨架 -->
        <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div class="bg-gray-100 dark:bg-gray-800 px-4 py-2.5 border-b border-gray-200 dark:border-gray-700">
            <div class="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
          <div class="bg-gray-900 p-4 space-y-2">
            <div class="h-4 bg-gray-700 rounded w-3/4"></div>
            <div class="h-4 bg-gray-700 rounded w-1/2"></div>
            <div class="h-4 bg-gray-700 rounded w-5/6"></div>
            <div class="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
        
        <!-- 更多内容骨架 -->
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10/12"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
        
        <!-- 列表骨架 -->
        <div class="pl-6 space-y-2">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
          </div>
        </div>
        
        <!-- 最后段落骨架 -->
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-7/12"></div>
        </div>
      </div>
    </div>
    
    <!-- 实际内容 - 初始隐藏，加载完成后显示 -->
    <div 
      ref="contentRef"
      class="content-wrapper"
      :class="{ 'content-visible': !isLoading, 'content-hidden': isLoading }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.post-content-loader {
  position: relative;
}

.skeleton-wrapper {
  min-height: 400px;
}

.content-hidden {
  opacity: 0;
  position: absolute;
  visibility: hidden;
  pointer-events: none;
}

.content-visible {
  opacity: 1;
  visibility: visible;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
