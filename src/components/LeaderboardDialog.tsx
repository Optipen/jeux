import { useLeaderboard } from '../hooks/useLeaderboard'

interface Props {
  open: boolean
  onClose: () => void
}

export default function LeaderboardDialog({ open, onClose }: Props) {
  const { board, error } = useLeaderboard(open)
  if (!open) return null
  return (
    <div
      role="dialog"
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div className="bg-white p-4">
        <h2>Leaderboard</h2>
        {error && <p>Failed to load leaderboard</p>}
        <ol>
          {board.map((b, i) => (
            <li key={i}>
              {b.username}: {b.score}
            </li>
          ))}
        </ol>
        <button onClick={onClose} aria-label="Close leaderboard">
          Close
        </button>
      </div>
    </div>
  )
}
