export interface Floor {
  unlocked: boolean
  level: number
  stored: number
  pose: 'idle' | 'pick'
}
