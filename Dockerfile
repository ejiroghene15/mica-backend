# ---- Stage 1: Build ----
FROM node:22-alpine AS builder

WORKDIR /app

# Pin pnpm instead of "latest" so builds don't change under you
RUN corepack enable && corepack prepare pnpm@12.10.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Allow the dependency build scripts pnpm blocks by default
RUN printf '\nallowBuilds:\n  "@google/genai": true\n  "@prisma/engines": true\n  bcrypt: true\n  msgpackr-extract: true\n  prisma: true\n  protobufjs: true\n  unrs-resolver: true\n' >> pnpm-workspace.yaml

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm exec prisma generate

RUN pnpm build

# ---- Stage 2: Production ----
FROM node:22-alpine AS production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@12.10.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN printf '\nallowBuilds:\n  "@google/genai": true\n  "@prisma/engines": true\n  bcrypt: true\n  msgpackr-extract: true\n  prisma: true\n  protobufjs: true\n  unrs-resolver: true\n' >> pnpm-workspace.yaml

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "dist/main"]