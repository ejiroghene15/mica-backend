WORKDIR /app


RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

COPY . .


EXPOSE 3000
ENV NODE_ENV=production
