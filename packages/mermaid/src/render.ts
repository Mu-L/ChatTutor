import mermaid from 'mermaid'
import type { FullizeAction } from '@chat-tutor/shared'
import type { MermaidPageAction } from './action'

export const createMermaidRenderer = (
  container: HTMLElement,
) => {
  mermaid.initialize({
    startOnLoad: true,
    theme: 'neutral',
  })

  const content: string[] = []

  const load = (actions: FullizeAction<MermaidPageAction>[]) => {
    for (const action of actions) {
      if (action.type === 'set-mermaid') {
        content.length = 0
        content.push(action.options.content)
      }
      mermaid.render(`${container.id}-mermaid`, content.join('\n\n')).then((result) => {
        container.innerHTML = result.svg
      })
    }
  }

  return {
    load,
  }
}