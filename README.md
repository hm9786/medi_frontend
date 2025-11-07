# Medi - SNS 댓글 관리 솔루션 (Frontend)

AI가 당신의 댓글창을 24시간 지키는 SNS 댓글관리 솔루션입니다.

## 🛠️ 기술 스택

- **Framework**: Next.js 16.0.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x
- **UI Components**: shadcn/ui (Radix UI 기반)
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📁 프로젝트 구조

```
app/
├── layout.tsx          # 전역 레이아웃 (네비게이션 포함)
├── page.tsx           # 메인 페이지
├── login/             # 로그인 페이지
├── hello/             # 회원가입 시작 페이지
├── signup/
│   ├── step1/         # 회원가입 1단계 (약관 동의)
│   └── step2/         # 회원가입 2단계 (정보 입력)
└── findpassword/      # 비밀번호 찾기

lib/
└── api.ts            # API 클라이언트 설정

components/
└── ui/               # shadcn/ui 컴포넌트들
```

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
```bash
# .env.local 파일 생성
cp env.example .env.local

# 백엔드 API 주소 설정
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📋 주요 기능

### 인증 시스템
- ✅ 회원가입 (이메일 인증 포함)
- ✅ 로그인/로그아웃
- ✅ 비밀번호 찾기
- ✅ JWT 토큰 기반 인증

### UI/UX
- ✅ 반응형 디자인
- ✅ 다크모드 지원 준비
- ✅ 접근성 고려된 컴포넌트
- ✅ 로딩 상태 및 에러 처리

## 🔧 백엔드 연동

### 인증 방식
- **세션 기반 인증** (JWT 사용 안함)
- 쿠키를 통한 세션 관리
- `withCredentials: true`로 쿠키 자동 전송

### API 엔드포인트
```
POST /api/auth/check-email           # 이메일 중복 검사
POST /api/auth/send-verification     # 인증번호 발송
POST /api/auth/verify-code           # 인증번호 확인
POST /api/auth/signup                # 회원가입
POST /api/auth/login                 # 로그인
GET  /api/auth/profile               # 사용자 정보 조회
POST /api/auth/logout                # 로그아웃
GET  /api/auth/check-session         # 세션 확인 (선택사항)
POST /api/auth/password-reset-request # 비밀번호 재설정 요청
POST /api/auth/password-reset        # 비밀번호 재설정
```

### CORS 설정 필수
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // 쿠키 허용 필수
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
```

### 상세 API 명세서
📋 [API 명세서 보기](./docs/API_SPECIFICATION.md)

### 테스트 방법

#### Mock API로 테스트 (백엔드 없이)
```bash
# .env.local에 추가
NEXT_PUBLIC_USE_MOCK_API=true

# 테스트 계정
이메일: test@example.com
비밀번호: password123
인증번호: 123456
```

#### 백엔드 연동 테스트
```bash
# 1. 백엔드 서버 실행 (포트 8000)
# 2. 프론트엔드 실행
npm run dev

# 3. 브라우저에서 테스트
http://localhost:3000
```

## 📦 빌드 및 배포

### 프로덕션 빌드
```bash
npm run build
npm run start
```

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.