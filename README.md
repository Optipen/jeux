# Elevator Miner

Mini-game React/TypeScript built with Vite. Components and hooks split for clarity.

## Development

```bash
npm install
npm run dev
```

## Testing

```bash
npm run lint
npm test
npm run build
```

## Leaderboard security

The backend should verify the HMAC signature from Telegram `initData` before accepting a score.

```ts
import crypto from 'node:crypto'

export function verifyTelegramHmac(initData: string, botToken: string) {
  const secret = crypto.createHash('sha256').update(botToken).digest()
  const hmac = crypto.createHmac('sha256', secret).update(initData).digest('hex')
  return hmac === new URLSearchParams(initData).get('hash')
}
```

See the [Telegram docs](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app) for details.
