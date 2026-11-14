<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import { AnimatePresence, motion } from 'motion-v'

const state = reactive({ name: '', email: '', message: '' })
const sent = ref(false)

function validate(values: typeof state): FormError[] {
  const errors: FormError[] = []
  if (!values.name.trim()) errors.push({ name: 'name', message: 'Enter your name.' })
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.push({ name: 'email', message: 'Enter an email address like name@example.com.' })
  if (values.message.trim().length < 10) errors.push({ name: 'message', message: 'Write at least 10 characters.' })
  return errors
}

function onSubmit() {
  // demo only, wire this to a server route or a form service per site
  sent.value = true
}

function reset() {
  Object.assign(state, { name: '', email: '', message: '' })
  sent.value = false
}
</script>

<template>
  <div class="grid gap-10 p-6 sm:p-10 md:grid-cols-[2fr_3fr]">
    <div>
      <h3 class="font-display text-3xl font-semibold tracking-tight">
        Tell us about the project
      </h3>
      <p class="mt-3 text-muted">
        A few lines are enough. Expect a reply within two working days.
      </p>
      <ul class="mt-6 space-y-3">
        <li class="flex items-center gap-3">
          <UIcon
            name="i-lucide-mail"
            class="size-5 text-primary"
          />
          <span>hello@example.com</span>
        </li>
        <li class="flex items-center gap-3">
          <UIcon
            name="i-lucide-map-pin"
            class="size-5 text-primary"
          />
          <span>Milan, Italy</span>
        </li>
      </ul>
    </div>

    <AnimatePresence mode="wait">
      <motion.div
        v-if="!sent"
        key="form"
        :exit="{ opacity: 0, y: -8 }"
        :transition="{ duration: 0.2 }"
      >
        <UForm
          :state="state"
          :validate="validate"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField
            label="Name"
            name="name"
          >
            <UInput
              v-model="state.name"
              autocomplete="name"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Email"
            name="email"
          >
            <UInput
              v-model="state.email"
              type="email"
              autocomplete="email"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Message"
            name="message"
          >
            <UTextarea
              v-model="state.message"
              :rows="4"
              autoresize
              class="w-full"
            />
          </UFormField>
          <UButton
            type="submit"
            label="Send message"
          />
        </UForm>
      </motion.div>
      <motion.div
        v-else
        key="sent"
        role="status"
        class="flex flex-col items-start justify-center gap-4 rounded-lg bg-primary/10 p-8"
        :initial="{ opacity: 0, scale: 0.96 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ type: 'spring', stiffness: 300, damping: 26 }"
      >
        <UIcon
          name="i-lucide-circle-check"
          class="size-8 text-primary"
        />
        <p class="font-display text-xl font-semibold">
          Message ready, {{ state.name }}.
        </p>
        <p class="text-muted">
          This is a demo form, so nothing was sent. Connect it to a server route or a form
          service when a site needs it.
        </p>
        <UButton
          label="Write another message"
          variant="outline"
          @click="reset"
        />
      </motion.div>
    </AnimatePresence>
  </div>
</template>
