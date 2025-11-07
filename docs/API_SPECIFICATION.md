# 백엔드 API 명세서

## 🔧 기본 설정

### Base URL
```
http://localhost:8000/api
```

### 인증 방식
- **세션 기반 인증** (JWT 사용 안함)
- 쿠키를 통한 세션 관리
- `withCredentials: true`로 쿠키 자동 전송

### CORS 설정 필요
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // 쿠키 허용 필수
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
```

## 📡 API 엔드포인트

### 공통 응답 형식

#### 성공 응답
```json
{
  "success": true,
  "data": { /* 실제 데이터 */ },
  "message": "성공 메시지"
}
```

#### 에러 응답
```json
{
  "success": false,
  "message": "에러 메시지",
  "errors": {  // 필드별 에러 (선택사항)
    "email": ["이미 사용중인 이메일입니다"],
    "password": ["8자리 이상 입력해주세요"]
  }
}
```

---

## 🔐 인증 관련 API

### 1. 이메일 중복 검사
```
POST /auth/check-email
```

**요청**
```json
{
  "email": "user@example.com"
}
```

**응답**
```json
{
  "success": true,
  "data": {
    "available": true
  },
  "message": "사용 가능한 이메일입니다"
}
```

---

### 2. 인증번호 발송
```
POST /auth/send-verification
```

**요청**
```json
{
  "email": "user@example.com"
}
```

**응답**
```json
{
  "success": true,
  "data": {},
  "message": "인증번호가 발송되었습니다"
}
```

---

### 3. 인증번호 확인
```
POST /auth/verify-code
```

**요청**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**응답**
```json
{
  "success": true,
  "data": {},
  "message": "인증이 완료되었습니다"
}
```

---

### 4. 회원가입
```
POST /auth/signup
```

**요청**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

**응답**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "user@example.com",
      "name": "홍길동",
      "phone": "010-1234-5678"
    }
  },
  "message": "회원가입이 완료되었습니다"
}
```

**중요**: 회원가입 성공 시 세션 생성 필요

---

### 5. 로그인
```
POST /auth/login
```

**요청**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "user@example.com",
      "name": "홍길동",
      "phone": "010-1234-5678"
    }
  },
  "message": "로그인 성공"
}
```

**중요**: 로그인 성공 시 세션 생성 필요

---

### 6. 사용자 정보 조회
```
GET /auth/profile
```

**요청**: 세션 쿠키 필요

**응답**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678"
  },
  "message": "사용자 정보 조회 성공"
}
```

**에러 (401)**
```json
{
  "success": false,
  "message": "인증이 필요합니다"
}
```

---

### 7. 로그아웃
```
POST /auth/logout
```

**요청**: 세션 쿠키 필요

**응답**
```json
{
  "success": true,
  "data": {},
  "message": "로그아웃 완료"
}
```

**중요**: 세션 삭제 필요

---

### 8. 세션 확인 (선택사항)
```
GET /auth/check-session
```

**요청**: 세션 쿠키 필요

**응답**
```json
{
  "success": true,
  "data": {},
  "message": "세션 유효"
}
```

---

### 9. 비밀번호 재설정 요청
```
POST /auth/password-reset-request
```

**요청**
```json
{
  "email": "user@example.com"
}
```

**응답**
```json
{
  "success": true,
  "data": {},
  "message": "비밀번호 재설정 이메일이 발송되었습니다"
}
```

---

### 10. 비밀번호 재설정
```
POST /auth/password-reset
```

**요청**
```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "newpassword123"
}
```

**응답**
```json
{
  "success": true,
  "data": {},
  "message": "비밀번호가 변경되었습니다"
}
```

---

## 🛠️ 세션 구현 예시 (Express.js)

### 세션 설정
```javascript
const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // HTTPS에서는 true
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24시간
  }
}));
```

### 로그인 구현 예시
```javascript
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // 사용자 인증 로직
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({
      success: false,
      message: '이메일 또는 비밀번호가 올바르지 않습니다'
    });
  }
  
  // 세션 생성
  req.session.userId = user.id;
  
  res.json({
    success: true,
    data: { user },
    message: '로그인 성공'
  });
});
```

### 인증 미들웨어
```javascript
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: '인증이 필요합니다'
    });
  }
  next();
};

// 사용법
app.get('/api/auth/profile', requireAuth, (req, res) => {
  // 사용자 정보 반환
});
```

---

## 🧪 테스트 방법

### 1. Postman 테스트
- `withCredentials: true` 설정
- 쿠키 자동 저장/전송 확인

### 2. 프론트엔드 연동 테스트
```bash
# 프론트엔드 실행
npm run dev

# 백엔드 실행 (포트 8000)
# 브라우저에서 http://localhost:3000 접속
```

### 3. Mock API 테스트
```bash
# .env.local에 추가
NEXT_PUBLIC_USE_MOCK_API=true
```

---

## ⚠️ 주의사항

1. **CORS 설정 필수**: `credentials: true` 설정
2. **세션 보안**: HttpOnly, Secure 쿠키 사용
3. **에러 응답**: 일관된 형식 유지
4. **상태 코드**: 적절한 HTTP 상태 코드 사용
   - 200: 성공
   - 400: 잘못된 요청
   - 401: 인증 필요
   - 409: 중복 데이터
   - 422: 유효성 검사 실패
   - 500: 서버 오류
