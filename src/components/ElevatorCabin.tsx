import { motion } from 'framer-motion'

interface Props {
  y: number
}

export default function ElevatorCabin({ y }: Props) {
  return (
    <motion.img
      src="/sprites/elevator.png"
      alt="cabine"
      animate={{ translateY: `${y}%` }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      className="w-12 h-9 drop-shadow-lg"
    />
  )
}
