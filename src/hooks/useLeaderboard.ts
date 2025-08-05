import { useEffect, useState } from 'react'
import { API_URL } from '../config'

export interface LeaderboardEntry {
  username: string
  score: number
}

export function useLeaderboard(open: boolean) {
  const [board, setBoard] = useState<LeaderboardEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    fetch(API_URL)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setBoard(d.slice(0, 30))
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBoard([])
          setError('network')
        }
      })
    return () => {
      cancelled = true
    }
  }, [open])

  return { board, error }
}
