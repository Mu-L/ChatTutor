import type { Template } from '..'

export const plane: Template = {
  id: 'plane',
  content: `
  ---
  ---
  <plane range="[0, 10]" domain="[0, 10]" />
  `.trim(),
  type: 'svg',
}