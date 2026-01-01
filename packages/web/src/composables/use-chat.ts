import type { Resource } from '#/components/prompt-area'
import { client } from '#/utils/client'
import { createMessageResolver, type ClientAction, type ClientMessage, type Page } from '@chat-tutor/shared'
import type { EdenWS } from '@elysiajs/eden/treaty'
import { ref } from 'vue'

export const useChat = (id: string) => {
  const messages = ref<ClientMessage[]>([])
  const pages = ref<Page[]>([])
  const running = ref(false)
  const stream = ref<EdenWS | null>(null)
  const streamOpen = ref(false)

  const resolve = createMessageResolver({
    get: () => messages.value,
    push: (message) => {
      messages.value.push(message)
    },
    uuid: () => crypto.randomUUID(),
  })

  const sync = async () => {
    const { data, error } = await client.chat({ id }).get()
    if (error || !data) {
      return
    }
    messages.value = data.messages
    pages.value = data.pages
  }

  const ask = async (
    prompt: string,
    resources: Resource[]
  ) => {
    running.value = true
    if (stream.value === null || !streamOpen.value) {
      await new Promise((resolve) => {
        stream.value = client.chat({ id }).stream.subscribe() as EdenWS
        stream.value.on('open', () => {
          streamOpen.value = true
          resolve(true)
        })
        stream.value.on('close', () => {
          streamOpen.value = false
          stream.value = null
        })
        stream.value.on('message', (message) => {
          const action = message.data as unknown as ClientAction
          resolve(action)
        })
      })
    }
    stream.value?.send({
      action: {
        type: 'user-input',
        options: {
          prompt,
        },
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  }

  return {
    messages,
    pages,
    running,
    sync,
    ask,
  }
}