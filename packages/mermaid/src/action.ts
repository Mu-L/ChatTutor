import type { Action } from '@chat-tutor/shared'

export type MermaidPageSetAction = Action<{ content: string }, 'set-mermaid'>
export type MermaidPageAction = MermaidPageSetAction