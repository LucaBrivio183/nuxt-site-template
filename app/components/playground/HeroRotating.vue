<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v'

const words = ['load in a blink', 'ship on every push', 'read well on a phone', 'stay yours']
const index = ref(0)
const paused = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    if (!paused.value && !document.hidden) index.value = (index.value + 1) % words.length
  }, 2600)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div
    class="relative isolate px-6 py-20 sm:px-12 sm:py-28"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <div
      class="glow absolute inset-0 -z-10"
      aria-hidden="true"
    />
    <h3 class="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
      <span class="sr-only">Sites that {{ words.join(', ') }}.</span>
      <span aria-hidden="true">
        Sites that
        <span class="block h-[1.1em] overflow-hidden text-primary">
          <AnimatePresence
            mode="wait"
            :initial="false"
          >
            <motion.span
              :key="words[index]"
              class="block"
              :initial="{ y: '0.6em', opacity: 0, filter: 'blur(6px)' }"
              :animate="{ y: 0, opacity: 1, filter: 'blur(0px)' }"
              :exit="{ y: '-0.6em', opacity: 0, filter: 'blur(6px)' }"
              :transition="{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }"
            >
              {{ words[index] }}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </h3>
    <p class="mt-6 max-w-xl text-lg text-muted">
      Hover or focus the hero to pause the rotation. Motion turns off when the visitor asks
      for reduced motion.
    </p>
    <div class="mt-8 flex flex-wrap gap-3">
      <UButton
        label="Start a project"
        size="lg"
      />
      <UButton
        label="See the work"
        size="lg"
        color="neutral"
        variant="ghost"
        trailing-icon="i-lucide-arrow-down"
      />
    </div>
  </div>
</template>

<style scoped>
.glow {
  background: radial-gradient(60% 80% at 85% 10%, color-mix(in oklab, var(--ui-primary) 22%, transparent), transparent);
}
</style>
