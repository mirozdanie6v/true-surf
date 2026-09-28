# TRUE SURF Mini App

True Surf v25 перенесён с автономного HTML-прототипа на Next.js App Router и TypeScript. Структура экранов, визуальный стиль и demo-функции сохранены.

## Контент и бренд-база

Актуальный factual snapshot для реализации находится в [docs/brand-base.md](docs/brand-base.md).

Канонический рабочий source of truth хранится в Google Drive в документе **“TRUE SURF — Research & Brand Base”**. Старые коммерческие предложения и прототипные тексты не считаются актуальными фактами автоматически.

## Локальный запуск

```bash
npm install
npm run dev
```

Проверка:

```bash
npm run lint
npm run typecheck
npm run build
```

Cloudflare Workers:

```bash
npm run preview
npm run deploy
```

Демо-заявки и статусы сохраняются только в `localStorage` текущего устройства.
