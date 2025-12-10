<script setup lang="ts">
import { v4 } from 'uuid'

const { handleAction, loadPages, currentPages, page } = useBoard()
const { messages, input, resources, send, loadMessages, running } = useChat(handleAction)
const promptAreaRef = ref()

provide('page', page)

console.log('currentPages', currentPages)

const route = useRoute()
const { input: initialInput, images: initialImages } = route.query as { input: string, images: string }

const handleSend = () => {
  send()
  nextTick(() => {
    promptAreaRef.value?.blur()
  })
}

const hasInitialContent = !!(initialInput || initialImages)

if (hasInitialContent) {
  input.value = initialInput
  if (initialImages) {
    console.log(initialImages)
    resources.value = initialImages.split(',').map(url => ({
      type: 'image',
      url,
      id: v4(),
    }))
    console.log(resources.value)
  }
  const { input: _, images: __, ...restQuery } = route.query
  navigateTo({ query: restQuery }, { replace: true })
}

const id = useRoute().params.id as string

void (async () => {
  const { messages, pages } = await $fetch<{ messages: Message[], pages: Page[] }>(`/api/chat/${id}/info`)
  if (messages.length === 0) {
    return
  }
  loadMessages(messages)
  loadPages(pages)
})()

onMounted(() => {
  if (hasInitialContent) {
    handleSend()
  }
})
</script>

<template>
  <div class="flex pt-10 md:pt-0 flex-col md:flex-row w-full h-full overflow-hidden">
    <div class="flex flex-1 flex-col h-full items-center overflow-hidden min-w-0 p-5 gap-2">
      <div class="flex flex-row w-full flex-1 gap-1 min-h-0 overflow-hidden">
        <Pages :pages="currentPages" :current-page="page!" />
      </div>
      <div class="w-full max-w-screen-md flex-shrink-0 flex justify-center">
        <PagesPreview :pages="currentPages" @select="(id) => page = id" />
      </div>
    </div>
    <div
      class="flex flex-col h-screen max-h-screen bg-gray-200 dark:bg-gray-800 w-full md:w-100 p-3 shadow-lg flex-shrink-0">
      <Chat ref="promptAreaRef" v-model:input="input" v-model:resources="resources" :messages="messages"
        :running="running" @send="handleSend" />
    </div>
  </div>
</template>
