/** Tiny classnames helper — merges conditional Tailwind classes. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}