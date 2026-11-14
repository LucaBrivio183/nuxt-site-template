<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v'

type Category = 'Design' | 'Build' | 'Care'

const items: { title: string, text: string, category: Category, icon: string }[] = [
  { title: 'Brand pages', text: 'A homepage and a handful of pages that say who you are.', category: 'Design', icon: 'i-lucide-pen-tool' },
  { title: 'Wireframes', text: 'Clickable structure on its own URL before any colour is chosen.', category: 'Design', icon: 'i-lucide-layout-template' },
  { title: 'Static sites', text: 'Pre-rendered pages served by nginx, nothing to patch at runtime.', category: 'Build', icon: 'i-lucide-file-code' },
  { title: 'Server rendering', text: 'Node at runtime for shops, accounts and content that changes.', category: 'Build', icon: 'i-lucide-server' },
  { title: 'Updates', text: 'Every push to main becomes a new image within minutes.', category: 'Care', icon: 'i-lucide-refresh-cw' },
  { title: 'Staging', text: 'A stage copy on its own subdomain, hidden from search engines.', category: 'Care', icon: 'i-lucide-eye-off' },
]

const filters = ['All', 'Design', 'Build', 'Care'] as const
const active = ref<(typeof filters)[number]>('All')
const visible = computed(() =>
  active.value === 'All' ? items : items.filter(item => item.category === active.value),
)
</script>

<template>
  <div class="p-6 sm:p-10">
    <div
      class="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter cards"
    >
      <UButton
        v-for="filter in filters"
        :key="filter"
        :label="filter"
        :aria-pressed="active === filter"
        :variant="active === filter ? 'solid' : 'outline'"
        color="neutral"
        size="sm"
        @click="active = filter"
      />
    </div>
    <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        <motion.li
          v-for="item in visible"
          :key="item.title"
          layout
          :initial="{ opacity: 0, scale: 0.96 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.96 }"
          :transition="{ type: 'spring', stiffness: 380, damping: 32 }"
          class="rounded-lg border border-default bg-elevated/50 p-5"
        >
          <UIcon
            :name="item.icon"
            class="size-6 text-primary"
          />
          <h3 class="mt-4 font-display text-lg font-semibold">
            {{ item.title }}
          </h3>
          <p class="mt-1 text-muted">
            {{ item.text }}
          </p>
          <p class="mt-4 text-sm text-dimmed">
            {{ item.category }}
          </p>
        </motion.li>
      </AnimatePresence>
    </ul>
  </div>
</template>
