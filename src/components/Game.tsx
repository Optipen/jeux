import { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  MAX_FLOORS,
  TICK,
  UNLOCK,
  UPG,
  GOLD_BASE,
  HEIGHT_POW,
} from '../config'
import type { Floor } from '../types'
import { usePersistentState } from '../hooks/usePersistentState'
import FloorCard from './FloorCard'
import ElevatorCabin from './ElevatorCabin'
import LeaderboardDialog from './LeaderboardDialog'

function produceGold(floor: Floor, idx: number): Floor {
  if (!floor.unlocked) return floor
  const inc = GOLD_BASE * floor.level * HEIGHT_POW ** idx
  const stored = floor.stored + inc
  return { ...floor, stored, pose: stored > 5 ? 'pick' : 'idle' }
}

export default function Game() {
  const initialFloors: Floor[] = Array.from({ length: MAX_FLOORS }, (_, i) => ({
    unlocked: i === 0,
    level: i === 0 ? 1 : 0,
    stored: 0,
    pose: 'idle',
  }))
  const [gold, setGold] = usePersistentState<number>('gold', 0)
  const [best, setBest] = usePersistentState<number>('best', 0)
  const [floors, setFloors] = usePersistentState<Floor[]>('floors', initialFloors)
  const [lift, setLift] = useState(0)
  const [dlg, setDlg] = useState(false)
  const [coinsFx, setCoinsFx] = useState<{ id: string; idx: number }[]>([])
  const timeouts = useRef<number[]>([])

  useEffect(() => {
    const id = window.setInterval(() => {
      setFloors((p) => p.map((f, idx) => produceGold(f, idx)))
    }, TICK)
    return () => clearInterval(id)
  }, [setFloors])

  useEffect(() => () => timeouts.current.forEach((t) => clearTimeout(t)), [])

  const collect = useCallback(() => {
    const total = floors.reduce((s, f) => s + f.stored, 0)
    if (!total) return
    const fx = floors
      .map((f, idx) => (f.stored > 0 ? { id: crypto.randomUUID(), idx } : null))
      .filter(Boolean) as { id: string; idx: number }[]
    setCoinsFx(fx)
    timeouts.current.push(window.setTimeout(() => setCoinsFx([]), 900))
    setGold((g) => g + Math.floor(total))
    setFloors((p) => p.map((f) => ({ ...f, stored: 0, pose: 'idle' })))
    setBest((b) => Math.max(b, Math.floor(total) + gold))
    setLift(100)
    timeouts.current.push(window.setTimeout(() => setLift(0), 100))
    timeouts.current.push(window.setTimeout(() => setLift(100), 700))
  }, [floors, gold, setFloors, setGold, setBest])

  const unlock = useCallback(
    (idx: number) => {
      const cost = UNLOCK * 2 ** idx
      setGold((g) => {
        if (g < cost) return g
        setFloors((p) =>
          p.map((f, i) => (i === idx ? { ...f, unlocked: true, level: 1 } : f))
        )
        return g - cost
      })
    },
    [setGold, setFloors]
  )

  const upgrade = useCallback(
    (idx: number) => {
      const cost = UPG * floors[idx].level * (idx + 1)
      setGold((g) => {
        if (g < cost) return g
        setFloors((p) =>
          p.map((f, i) => (i === idx ? { ...f, level: f.level + 1 } : f))
        )
        return g - cost
      })
    },
    [floors, setGold, setFloors]
  )

  return (
    <div className="min-h-screen p-4 bg-yellow-50">
      <h1 className="text-xl mb-2">Elevator Miner</h1>
      <p className="mb-2">Gold: {gold} | Best: {best}</p>
      <button className="mr-2" onClick={collect} aria-label="Collect gold">
        Collect
      </button>
      <button onClick={() => setDlg(true)} aria-label="Show leaderboard">
        🏆
      </button>
      <div className="relative mt-4" style={{ height: MAX_FLOORS * 60 }}>
        <ElevatorCabin y={lift} />
        <div className="absolute top-0 left-16">
          {floors.map((f, idx) => (
            <div key={idx} style={{ height: 60 }} className="flex items-center">
              <FloorCard
                floor={f}
                idx={idx}
                unlock={unlock}
                upgrade={upgrade}
              />
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {coinsFx.map((c) => (
          <motion.div
            key={c.id}
            initial={{ position: 'fixed', x: 90, y: window.innerHeight - 140 - c.idx * 60 }}
            animate={{ x: 160, y: 20, scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeIn' }}
            className="text-yellow-400"
          >
            💰
          </motion.div>
        ))}
      </AnimatePresence>
      <LeaderboardDialog open={dlg} onClose={() => setDlg(false)} />
    </div>
  )
}
