import { memo } from 'react'
import Miner from './Miner'
import type { Floor } from '../types'

interface Props {
  floor: Floor
  idx: number
  unlock: (idx: number) => void
  upgrade: (idx: number) => void
}

function FloorCard({ floor, idx, unlock, upgrade }: Props) {
  if (!floor.unlocked) {
    return (
      <button aria-label="Unlock floor" onClick={() => unlock(idx)}>
        🔓
      </button>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <Miner active={floor.pose === 'pick'} />
      <span>Lvl {floor.level}</span>
      <span>{Math.floor(floor.stored)}</span>
      <button aria-label="Upgrade floor" onClick={() => upgrade(idx)}>
        Upg.
      </button>
    </div>
  )
}

export default memo(FloorCard)
