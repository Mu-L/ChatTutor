import type { AllAction } from './action'
import type { PageType, FullizeAction } from '@chat-tutor/shared'
import type { MermaidPageAction, RunGGBScriptAction } from '@chat-tutor/agent'
import { v4 } from 'uuid'

export type UserMessage = {
  type: 'user'
  content: string
  images: string[]
}
export type AssistantMessage = {
  type: 'assistant'
  content: string
}
export type SetMermaidMessage = {
  type: 'set-mermaid'
  page: string
  expandContent?: string
}
export type NoteMessage = {
  type: 'note'
  page: string
}
export type PageMessage = {
  type: 'page'
  page: string
  pageType: PageType
}
export type GGBMessage = {
  type: 'ggb'
  page: string
  expandContent?: string
}
export type PlanMessage = {
  type: 'plan'
  expandContent?: string
}
export type Message = (
  UserMessage
  | AssistantMessage
  | SetMermaidMessage
  | NoteMessage
  | PageMessage
  | GGBMessage
  | PlanMessage
) & {
  id: string
  running?: boolean
}

export const createMessageResolver = (
  push: (message: Message) => void,
  get: () => Message[],
  uuid: () => string = v4,
) => {
  let divided: boolean = true
  // Track running messages by page and action type
  const runningMessages = new Map<string, Message>()

  const findRunningMessage = (page: string, type: 'note' | 'set-mermaid' | 'ggb'): Message | undefined => {
    const messages = get()
    // Find the most recent running message of the given type for the given page
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i]
      if (msg && 'page' in msg && msg.page === page && msg.type === type && msg.running === true) {
        return msg
      }
    }
    return undefined
  }

  return (action: AllAction) => {
    if (action.type === 'text') {
      const messages = get()
      const lastMessage = messages.at(-1)
      // Create new assistant message if:
      // 1. divided is true (after non-text action)
      // 2. last message is not an assistant type (e.g., user just sent a message)
      // 3. no messages exist
      if (divided || !lastMessage || lastMessage.type !== 'assistant') {
        push({
          type: 'assistant',
          content: '',
          id: uuid(),
          running: true,
        })
        divided = false
      }
      const updatedMessages = get()
        ; (<AssistantMessage>updatedMessages.at(-1)!).content += action.options.chunk
    } else {
      divided = true
      if (action.type === 'note') {
        // Check if there's already a running note message for this page
        const pageId = action.page!
        const existingMessage = findRunningMessage(pageId, 'note')
        if (existingMessage) {
          // Update existing message, keep it running until note-end
          // Don't create a new message
        } else {
        // No running message, create a new one (for backward compatibility)
          push({
            type: 'note',
            page: pageId,
            id: uuid(),
          })
        }
      } else if (action.type === 'page') {
        push({
          type: 'page',
          page: action.options.id!,
          pageType: action.options.type as PageType,
          id: uuid(),
        })
      } else if (action.type === 'note-start') {
        const pageId = action.page!
        const messageId = uuid()
        const message: Message = {
          type: 'note',
          page: pageId,
          id: messageId,
          running: true,
        }
        runningMessages.set(`note:${pageId}`, message)
        push(message)
      } else if (action.type === 'note-end') {
        const pageId = action.page!
        const message = findRunningMessage(pageId, 'note')
        if (message) {
          message.running = false
          runningMessages.delete(`note:${pageId}`)
        }
      } else if (action.type === 'mermaid-start') {
        const pageId = action.page!
        const messageId = uuid()
        const message: Message = {
          type: 'set-mermaid',
          page: pageId,
          id: messageId,
          running: true,
        }
        runningMessages.set(`mermaid:${pageId}`, message)
        push(message)
      } else if (action.type === 'set-mermaid') {
        // Update the running mermaid message with content for expand
        const mermaidAction = action as FullizeAction<MermaidPageAction>
        const pageId = mermaidAction.page!
        const existingMessage = findRunningMessage(pageId, 'set-mermaid')
        if (existingMessage) {
          // Set expandContent from the action
          (existingMessage as SetMermaidMessage).expandContent = mermaidAction.options.content
        }
      } else if (action.type === 'mermaid-end') {
        const pageId = action.page!
        const message = findRunningMessage(pageId, 'set-mermaid')
        if (message) {
          message.running = false
          runningMessages.delete(`mermaid:${pageId}`)
        }
      } else if (action.type === 'run-ggbscript') {
        // Update the running ggb message with content for expand
        const ggbAction = action as FullizeAction<RunGGBScriptAction>
        const pageId = ggbAction.page!
        const existingMessage = findRunningMessage(pageId, 'ggb')
        if (existingMessage) {
          // Set expandContent from the action
          (existingMessage as GGBMessage).expandContent = ggbAction.options.content
        }
      } else if (action.type === 'ggb-start') {
        const pageId = action.page!
        const messageId = uuid()
        const message: Message = {
          type: 'ggb',
          page: pageId,
          id: messageId,
          running: true,
        }
        runningMessages.set(`ggb:${pageId}`, message)
        push(message)
      } else if (action.type === 'ggb-end') {
        const pageId = action.page!
        const message = findRunningMessage(pageId, 'ggb')
        if (message) {
          message.running = false
          runningMessages.delete(`ggb:${pageId}`)
        }
      } else if (action.type === 'plan-start') {
        const messageId = uuid()
        const message: Message = {
          type: 'plan',
          id: messageId,
          running: true,
        }
        runningMessages.set('plan', message)
        push(message)
      } else if (action.type === 'plan-end') {
        // Find the running plan message
        const messages = get()
        for (let i = messages.length - 1; i >= 0; i--) {
          const msg = messages[i]
          if (msg && msg.type === 'plan' && msg.running === true) {
            msg.running = false
              // Set expandContent from the action
              ; (msg as PlanMessage).expandContent = action.options.content
            runningMessages.delete('plan')
            break
          }
        }
      }
    }
  }
}
