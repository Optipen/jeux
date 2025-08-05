import { useEffect, useState } from 'react'
import { API_URL } from '../config'
import { useToast } from './useToast'

export interface LeaderboardEntry {
  username: string
  score: number
}

export function useLeaderboard(open: boolean) {
  const [board, setBoard] = useState<LeaderboardEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

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
          toast({ title: 'Erreur réseau', variant: 'destructive' })
        }
      })
    return () => {
      cancelled = true
    }
  }, [open, toast])

  return { board, error }
}
