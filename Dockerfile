# ---- Stage 1: Build ----
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@12.10.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

# Dummy value: prisma.config.ts requires DATABASE_URL to be set, but generate never connects
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# Call the binary directly so pnpm doesn't re-run its dependency check
RUN ./node_modules/.bin/prisma generate

RUN ./node_modules/.bin/nest build

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

CMD ["node", "dist/main"]