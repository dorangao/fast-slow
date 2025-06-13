# Fast vs Slow LLM API

This proof-of-concept uses Next.js to expose a simple API and UI backed by OpenAI.

## Development

```bash
cd frontend
npm install
npm run dev
```

## Docker

Build and run using Docker Compose:

```bash
docker-compose up --build
```

The `OPENAI_API_KEY` environment variable must be provided.
