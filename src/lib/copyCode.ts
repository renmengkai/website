// 代码块复制功能
export function initCopyButtons(container?: HTMLElement | Document) {
  const root = container || document;
  const copyButtons = root.querySelectorAll('.copy-code-btn');
  
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

// 自动初始化
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initCopyButtons();
  });
}
