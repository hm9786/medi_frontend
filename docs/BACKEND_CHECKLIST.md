# 백엔드 개발 체크리스트

## ✅ 필수 구현 사항

### 🔧 서버 설정
- [ ] Express.js 서버 설정
- [ ] CORS 설정 (`credentials: true` 필수)
- [ ] 세션 미들웨어 설정
- [ ] 포트 8000에서 서버 실행

### 🗄️ 데이터베이스
- [ ] 사용자 테이블 생성
  - [ ] id (Primary Key)
  - [ ] email (Unique)
  - [ ] password (해시화)
  - [ ] name
  - [ ] phone
  - [ ] created_at
  - [ ] updated_at

### 🔐 인증 API 구현

#### 필수 API (10개)
- [ ] `POST /api/auth/check-email` - 이메일 중복 검사
- [ ] `POST /api/auth/send-verification` - 인증번호 발송
- [ ] `POST /api/auth/verify-code` - 인증번호 확인
- [ ] `POST /api/auth/signup` - 회원가입
- [ ] `POST /api/auth/login` - 로그인
- [ ] `GET /api/auth/profile` - 사용자 정보 조회
- [ ] `POST /api/auth/logout` - 로그아웃
- [ ] `POST /api/auth/password-reset-request` - 비밀번호 재설정 요청
- [ ] `POST /api/auth/password-reset` - 비밀번호 재설정
- [ ] `GET /api/auth/check-session` - 세션 확인 (선택사항)

### 📧 이메일 기능
- [ ] 이메일 발송 서비스 설정 (인증번호, 비밀번호 재설정)
- [ ] 인증번호 생성 및 저장 로직
- [ ] 인증번호 만료 시간 관리 (6분)

### 🔒 보안
- [ ] 비밀번호 해시화 (bcrypt)
- [ ] 세션 보안 설정
- [ ] 입력값 유효성 검사
- [ ] SQL Injection 방지
- [ ] XSS 방지

---

## 🧪 테스트 가이드

### 1. API 테스트 순서
1. 이메일 중복 검사
2. 인증번호 발송
3. 인증번호 확인
4. 회원가입
5. 로그인
6. 사용자 정보 조회
7. 로그아웃

### 2. Postman 테스트 설정
```
Base URL: http://localhost:8000/api
Settings: 
- Send cookies automatically: ON
- Follow redirects: ON
```

### 3. 프론트엔드 연동 테스트
```bash
# 백엔드 서버 실행 후
cd frontend
npm run dev
# http://localhost:3000에서 테스트
```

---

## 🚨 주의사항

### CORS 설정 예시
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // 필수!
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
```

### 세션 설정 예시
```javascript
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // HTTPS에서는 true
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24시간
  }
}));
```

### 응답 형식 (필수)
```javascript
// 성공
res.json({
  success: true,
  data: { /* 데이터 */ },
  message: "성공 메시지"
});

// 에러
res.status(400).json({
  success: false,
  message: "에러 메시지",
  errors: { /* 필드별 에러 */ }
});
```

---

## 📞 문의사항

구현 중 문제가 발생하면:
1. API 명세서 확인: `docs/API_SPECIFICATION.md`
2. 프론트엔드 팀과 상의
3. Mock API 참고: `lib/mockApi.ts`

---

## 🎯 완료 후 확인사항

- [ ] 모든 API 엔드포인트 동작 확인
- [ ] 프론트엔드와 연동 테스트 완료
- [ ] 에러 처리 정상 동작
- [ ] 세션 관리 정상 동작
- [ ] CORS 설정 정상 동작
