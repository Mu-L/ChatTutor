import type { Message } from '#shared/types'

export const useChat = () => {
  const messages = ref<Message[]>([])
  const input = ref('')
  let eventSource: EventSource | null = null

  const send = async () => {
    // 关闭之前的连接
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }

    messages.value.push({
      type: 'user',
      content: input.value,
      id: crypto.randomUUID(),
    })
    messages.value.push({
      type: 'assistant',
      content: '',
      id: crypto.randomUUID(),
    })
    
    eventSource = new EventSource(`/api/chat/xxx?input=${input.value}`)
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'text') {
          messages.value.at(-1)!.content += data.options.chunk
        } else {
          console.log(data)
        }
      } catch (error) {
        console.error('Failed to parse event data:', error)
      }
    }
    
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error)
      if (eventSource) {
        eventSource.close()
        eventSource = null
      }
    }
    
    eventSource.onopen = () => {
      console.log('EventSource connected')
    }
  }

  // 清理函数
  const cleanup = () => {
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }
  }

  // 在组件卸载时清理
  onUnmounted(() => {
    cleanup()
  })

  return {
    messages,
    input,
    send,
    cleanup,
  }
}