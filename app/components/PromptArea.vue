<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons'

const input = defineModel<string>('input', { required: true })
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const { running } = defineProps<{
  running: boolean
}>()

const blur = () => {
  textareaRef.value?.blur()
}

const emits = defineEmits<{
  (e: 'send', input: string): void
}>()

const send = (event: KeyboardEvent) => {
  // cmd+enter (Mac) or ctrl+enter (Windows/Linux)
  if (running) return
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    blur()
    emits('send', input.value)
  }
}

defineExpose({
  blur
})
</script>

<template>
  <div
    class="size-full bg-gray-100 p-2 rounded-lg flex flex-row items-center justify-center md:flex-col border border-gray-300 shadow-lg"
  >
    <textarea
      ref="textareaRef"
      v-model="input"
      class="size-full bg-transparent outline-none resize-none text-gray-500"
      @keydown="send"
    />
    <div class="flex flex-row items-center justify-center md:justify-end w-full h-10">
      <div class="w-full flex flex-row mr-auto justify-end">
        <ButtonContainer
          class="size-8 justify-center items-center flex"
          :class="{ 'opacity-50 cursor-not-allowed': running }"
          @click="send"
        >
          <FontAwesomeIcon
            :icon="running ? faSpinner : faPaperPlane"
            class="size-4"
            :class="{ 'animate-spin': running }"
          />
        </ButtonContainer>
      </div>
    </div>
  </div>
</template>