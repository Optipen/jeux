interface Props {
  active: boolean
}

export default function Miner({ active }: Props) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        backgroundImage: `url('/sprites/${active ? 'miner_pick.png' : 'miner_idle.png'}')`,
        backgroundSize: '256px 32px',
        animation: `${active ? 'minerPick' : 'minerIdle'} 0.8s steps(4) infinite`,
      }}
      aria-label={active ? 'miner picking' : 'miner idle'}
    />
  )
}
