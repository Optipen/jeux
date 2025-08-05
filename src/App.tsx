import Game from '@/components/Game'
import { ToastProvider } from '@/components/ui/ToastProvider'

export default function App() {
  return (
    <ToastProvider>
      <Game />
    </ToastProvider>
  )
}
