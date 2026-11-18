const DATE_LOCALE: Record<string, string> = { en: 'en-RW', fr: 'fr-FR', rw: 'rw-RW' }

export function formatDate(iso: string, lang = 'en'): string {
  return new Intl.DateTimeFormat(DATE_LOCALE[lang] ?? 'en-RW', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatDateTime(iso: string, lang = 'en'): string {
  return new Intl.DateTimeFormat(DATE_LOCALE[lang] ?? 'en-RW', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}