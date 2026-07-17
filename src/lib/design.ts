// 双设计系统（日夜双主题）选择逻辑
// 创建日期: 2026-07-17
//
// - cookie `design=vima|glass` 决定按请求渲染哪套设计
// - 无 cookie 时默认 vima（浅色暖纸）；各主题 Layout 内置首访脚本，
//   按系统 prefers-color-scheme 写入 cookie，深色用户首访自动切换到 glass

export type Design = 'vima' | 'glass';

export function getDesign(cookies: {
  get(name: string): { value: string } | undefined;
}): Design {
  return cookies.get('design')?.value === 'glass' ? 'glass' : 'vima';
}
