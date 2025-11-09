import type { Action } from '@chat-tutor/shared'

export type Element = {
  name: string
  id: string
  attrs: object
}

export type ElementAction = Action<Element, 'element'>
