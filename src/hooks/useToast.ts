import { toast as baseToast } from 'sonner'

export function useToast() {
  return {
    toast: ({ title, variant }: { title: string; variant?: 'default' | 'destructive' }) => {
      if (variant === 'destructive') {
        baseToast.error(title)
      } else {
        baseToast(title)
      }
    }
  }
}
