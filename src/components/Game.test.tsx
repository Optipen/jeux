import { describe, it } from 'vitest'
import { render } from '@testing-library/react'
import Game from './Game'

describe('Game', () => {
  it('renders without crashing', () => {
    render(<Game />)
  })
})
