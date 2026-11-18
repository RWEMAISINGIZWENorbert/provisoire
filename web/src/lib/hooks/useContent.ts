import { useQuery } from '@tanstack/react-query'

import { apiFetch } from '@/lib/api'
import type { Question, Topic } from '@/lib/mock'

const STALE = 5 * 60 * 1000 // content changes rarely — cache 5 min

export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: () => apiFetch<Topic[]>('/api/v1/content/topics'),
    staleTime: STALE,
  })
}

export function useTopic(slug: string | undefined) {
  return useQuery({
    queryKey: ['topic', slug],
    queryFn: () =>
      apiFetch<{ topic: Topic; questions: Question[] }>(
        `/api/v1/content/topics/${slug}`,
      ),
    enabled: !!slug,
    staleTime: STALE,
  })
}

export function useQuestions() {
  return useQuery({
    queryKey: ['questions'],
    queryFn: () => apiFetch<Question[]>('/api/v1/content/questions'),
    staleTime: STALE,
  })
}