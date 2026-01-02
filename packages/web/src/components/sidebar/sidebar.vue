<script setup lang="ts">
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@chat-tutor/ui'
import SidebarChatHistory from './sidebar-chat-history.vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCog, faBars, faPlus } from '@fortawesome/free-solid-svg-icons'

const router = useRouter()
const open = ref(false)
watch(router.currentRoute, (route) => {
  open.value = route.path === '/'
}, { immediate: true })
</script>

<template>
  <SidebarProvider v-model:open="open">
    <Sidebar collapsible="icon" variant="inset">
      <SidebarContent class="text-gray-500 select-none dark:text-gray-400">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton as-child class="size-8" @click="open = !open">
                  <div class="size-4">
                    <FontAwesomeIcon :icon="faBars" />
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton as-child tooltip="New Chat" @click="router.push('/')">
                  <div class="size-4">
                    <FontAwesomeIcon :icon="faPlus" />
                    <span>New Chat</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton as-child tooltip="Settings" @click="router.push('/settings')">
                  <div>
                    <FontAwesomeIcon :icon="faCog" />
                    <span>Settings</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarChatHistory v-show="open" />
      </SidebarContent>
    </Sidebar>
    <main class="size-full overflow-hidden">
      <slot name="main" />
    </main>
  </SidebarProvider>
</template>