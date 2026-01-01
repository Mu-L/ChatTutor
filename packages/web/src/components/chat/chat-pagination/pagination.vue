<script setup lang="ts">
import { Card, CardContent } from '@chat-tutor/ui'
import PageCard from './page-card.vue'
</script>

<template>
  <Card class="size-full">
    <CardContent class="h-full">
      <div class="flex h-full flex-row gap-2 overflow-x-auto">
        <PageCard type="mermaid" title="Mermaid" count="1" />
        <PageCard type="ggb" title="GGB" count="2" />
        <PageCard type="mermaid" title="Mermaid" count="1" />
        <PageCard type="ggb" title="GGB" count="2" />
        <PageCard type="mermaid" title="Mermaid" count="1" />
      </div>
    </CardContent>
  </Card>
</template>