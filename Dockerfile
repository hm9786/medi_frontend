# ===================================
# Stage 1: Dependencies
# ===================================
FROM node:20-alpine AS deps
WORKDIR /app

# libc6-compat 설치 (Alpine Linux에서 필요)
RUN apk add --no-cache libc6-compat

# package.json과 lock 파일만 복사
COPY package.json package-lock.json* ./
RUN npm ci

# ===================================
# Stage 2: Builder
# ===================================
FROM node:20-alpine AS builder
WORKDIR /app

# deps 스테이지에서 node_modules 복사
COPY --from=deps /app/node_modules ./node_modules

# 소스 코드 전체 복사
COPY . .

# 환경 변수 설정 (빌드 시)
ENV NEXT_TELEMETRY_DISABLED=1

# ⚠️ [추가] 빌드 시 환경변수 에러 방지용 (기본값 설정)
# 실제로는 config.js에서 window.location.origin을 쓰므로 이 값은 무시됨
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Next.js 빌드 실행 (standalone 출력)
RUN npm run build

# ===================================
# Stage 3: Runner
# ===================================FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["sh", "-c", "node server.js || node .next/standalone/server.js || node .next/standalone/server/index.js"]
