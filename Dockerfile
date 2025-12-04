# ===================================
# Stage 1: Dependencies
# ===================================
# ⚠️ 수정: node:18-alpine → node:20-alpine
#  - 이유: Next.js 16은 Node >= 20.9.0 필요
#  - node:20-alpine 이미지는 20.x 대 버전이므로 요구 조건을 만족함
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
# ⚠️ 수정: node:18-alpine → node:20-alpine
FROM node:20-alpine AS builder
WORKDIR /app

# deps 스테이지에서 node_modules 복사
COPY --from=deps /app/node_modules ./node_modules

# 소스 코드 전체 복사
COPY . .

# 환경 변수 설정 (빌드 시)
ENV NEXT_TELEMETRY_DISABLED=1

# (선택) standalone 모드 명시
# 실제로는 next.config.js에서 output: 'standalone' 설정하는 것이 더 중요함
# ENV NEXT_OUTPUT=standalone

# Next.js 빌드 실행 (standalone 출력)
RUN npm run build

# ===================================
# Stage 3: Runner
# ===================================
# ⚠️ 수정: node:18-alpine → node:20-alpine
FROM node:20-alpine AS runner
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

# server.js로 실행 (next start 아님!)
CMD ["node", "server.js"]
