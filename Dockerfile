# ===================================
# Stage 1: Dependencies
# ===================================
FROM node:18-alpine AS deps
WORKDIR /app

# libc6-compat 설치 (Alpine Linux에서 필요)
RUN apk add --no-cache libc6-compat

# package.json과 lock 파일만 복사
COPY package.json package-lock.json* ./
RUN npm ci

# ===================================
# Stage 2: Builder
# ===================================
FROM node:18-alpine AS builder
WORKDIR /app

# deps 스테이지에서 node_modules 복사
COPY --from=deps /app/node_modules ./node_modules

# 소스 코드 전체 복사
COPY . .

# 환경 변수 설정 (빌드 시)
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js 빌드 실행 (standalone 출력)
RUN npm run build

# ===================================
# Stage 3: Runner
# ===================================
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 보안: 비-루트 사용자 생성
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Public 폴더 복사 (빌드 후)
COPY --from=builder /app/public ./public

# Standalone 폴더 복사 (⭐ 핵심)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# ⭐ server.js로 실행 (next start 아님!)
CMD ["node", "server.js"]
