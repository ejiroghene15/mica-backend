# ---- Stage 1: Build ----
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@12.10.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

# Placeholder only for this command: prisma.config.ts needs DATABASE_URL to exist, but generate never connects
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" ./node_modules/.bin/prisma generate

# Build, then print the output layout so you can confirm where main.js ends up
RUN ./node_modules/.bin/nest build && ls -R dist | head -30

# ---- Stage 2: Production ----
FROM node:22-alpine AS production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@12.10.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "dist/src/main"]