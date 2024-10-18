FROM node:20-bullseye-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update && \ 
  apt-get install -y --no-install-recommends dumb-init && \
  corepack enable 

COPY . /app  
WORKDIR /app  

# Cache production dependencies
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --ignore-scripts

# Build the application with all dependencies
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts && \
  pnpm build

# Production image, copy all the files and run nestjs app
FROM node:20-bullseye-slim as runner
WORKDIR /app 
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nest

COPY --from=base --chown=nest:nodejs /app/package.json ./package.json
COPY --from=prod-deps --chown=nest:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nest:nodejs /app/dist ./dist

USER nest

EXPOSE 3000

CMD [ "node", "dist/src/main.js" ]
