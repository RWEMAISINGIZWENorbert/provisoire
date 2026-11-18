import type { LocalizedText } from '@/lib/mock'

/** Resolve a LocalizedText to the active language, falling back to English. */
export function localized(text: LocalizedText, lang: string): string {
  if (lang.startsWith('rw')) return text.rw
  if (lang.startsWith('fr')) return text.fr
  return text.en
}