import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Playground from '~/pages/playground.vue'

describe('playground page', () => {
  it('renders one section per snippet file', async () => {
    const page = await mountSuspended(Playground)
    expect(page.find('h1').text()).toBe('Playground')
    expect(page.findAll('section').length).toBeGreaterThanOrEqual(3)
    expect(page.text()).toContain('app/components/playground/HeroRotating.vue')
  })
})
