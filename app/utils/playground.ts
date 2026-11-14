import type { Component } from 'vue'

export interface PlaygroundSnippet {
  id: string
  title: string
  path: string
  component: Component
}

// turns "CardGrid" into "Card grid"
export function snippetTitle(name: string): string {
  const words = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

// one file per snippet under app/components/playground, sorted by file name
export function collectSnippets(modules: Record<string, { default: Component }>): PlaygroundSnippet[] {
  return Object.entries(modules)
    .map(([file, mod]) => {
      const name = file.split('/').pop()!.replace(/\.vue$/, '')
      return {
        id: name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
        title: snippetTitle(name),
        path: `app/components/playground/${name}.vue`,
        component: mod.default,
      }
    })
    .sort((a, b) => a.path.localeCompare(b.path))
}
