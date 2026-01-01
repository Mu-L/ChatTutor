import { defineStore } from 'pinia'
import type { Resource } from '#/components/prompt-area'

export interface CreateChatState {
  prompt: string | null
  resources: Resource[]
}
export const useCreateChatStore = defineStore('create-chat', {
  state: (): CreateChatState => ({
    prompt: null,
    resources: [],
  }),
})
