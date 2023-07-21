<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { useCommand } from '@/composables/command'
import { useThemeStore } from '@/store'
import BaseLayout from '@/components/layout/BaseLayout.vue'

const themeStore = useThemeStore()
const { initCommands } = useCommand()
initCommands()
</script>

<template>
  <NConfigProvider :theme="themeStore.naiveTheme">
    <BaseLayout>
      <RouterView />
    </BaseLayout>
  </NConfigProvider>
</template>
