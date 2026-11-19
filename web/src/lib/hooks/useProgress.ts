import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { apiFetch } from '@/lib/api'
import { syncProgress, type ProgressSnapshot } from '@/store/progressSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export interface AnswerPayload {
  questionId: string
  selectedIndex: number
}

export interface ProgressSubmitResponse {
  result: { total: number; correct: number; scorePercent: number }
  xpEarned: number
  progress: ProgressSnapshot
}

interface QuizAnswerLike {
  questionId: string
  selectedIndex: number
}

/** Strip client-computed fields — the server only trusts questionId + pick. */
export function toAnswerPayload(answers: QuizAnswerLike[]): AnswerPayload[] {
  return answers.map((a) => ({
    questionId: a.questionId,
    selectedIndex: a.selectedIndex,
  }))
}

/**
 * Fetch server progress once authenticated and hydrate the Redux store.
 * Call once inside AppShell.
 */
export function useProgressSync() {
  const dispatch = useAppDispatch()
  const authenticated = useAppSelector((s) => s.auth.status === 'authenticated')
  const { data } = useQuery({
    queryKey: ['progress'],
    queryFn: () => apiFetch<ProgressSnapshot>('/api/v1/progress'),
    enabled: authenticated,
    staleTime: 30_000,
  })
  useEffect(() => {
    if (data) dispatch(syncProgress(data))
  }, [data, dispatch])
}

function useSubmitProgress(path: string) {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: { topicId: string; answers: AnswerPayload[] }) =>
      apiFetch<ProgressSubmitResponse>(path, { method: 'POST', body }),
    onSuccess: (data) => {
      // Server snapshot is authoritative — replace local progress wholesale
      dispatch(syncProgress(data.progress))
      void queryClient.invalidateQueries({ queryKey: ['progress'] })
    },
  })
}

export function useSubmitLearnQuiz() {
  return useSubmitProgress('/api/v1/progress/learn-quiz')
}

export function useSubmitPractice() {
  return useSubmitProgress('/api/v1/progress/practice')
}