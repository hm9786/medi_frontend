# MEDI 프론트엔드 개발 가이드

> YouTube 채널 관리 및 분석 플랫폼 - 프론트엔드 개발 문서

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [개발 환경 설정](#개발-환경-설정)
4. [프로젝트 구조](#프로젝트-구조)
5. [주요 기능](#주요-기능)
6. [백엔드 API 연동](#백엔드-api-연동)
7. [폰트 시스템 가이드](#폰트-시스템-가이드)
8. [스타일링 가이드](#스타일링-가이드)
9. [주요 컴포넌트](#주요-컴포넌트)
10. [개발 시 주의사항](#개발-시-주의사항)

---

## 프로젝트 개요

MEDI는 YouTube 크리에이터를 위한 채널 관리 및 분석 플랫폼입니다. 사용자는 자신의 YouTube 채널을 등록하고, 영상 메타데이터를 분석하며, 댓글 분석 및 멘탈 케어 서비스를 제공받을 수 있습니다.

### 주요 기능
- YouTube 채널 등록 및 동기화
- 영상 메타데이터 조회 및 분석
- 댓글 분석 및 필터링
- 멘탈 케어 대시보드
- 콘텐츠 컨설팅

---

## 기술 스택

### 핵심 프레임워크
- **Next.js 16.0.1** - React 기반 풀스택 프레임워크
- **React 19.2.0** - UI 라이브러리
- **Redux Toolkit 2.10.1** - 상태 관리

### 스타일링
- **Tailwind CSS 3.0.24** - 유틸리티 기반 CSS 프레임워크
- **Radix UI** - 접근성 있는 UI 컴포넌트 라이브러리
- **Lucide React** - 아이콘 라이브러리

### 기타
- **Recharts 3.4.1** - 차트 라이브러리

---

## 개발 환경 설정

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn
- 백엔드 서버 실행 중 (http://localhost:8080)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

---

## 프로젝트 구조

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── dashboard/          # 대시보드 페이지 및 레이아웃
│   │   │   ├── layout.js       # 대시보드 레이아웃 (사이드바, 헤더)
│   │   │   └── page.js         # 대시보드 메인 페이지
│   │   ├── login/              # 로그인 페이지
│   │   ├── signup/             # 회원가입 페이지
│   │   ├── oauth2/             # OAuth2 콜백 처리
│   │   ├── globals.css         # 전역 스타일 및 폰트 설정
│   │   └── layout.js           # 루트 레이아웃
│   │
│   ├── components/             # 재사용 가능한 컴포넌트
│   │   ├── dashboard/          # 대시보드 전용 컴포넌트
│   │   │   ├── OverviewTab.js          # 전체 요약 탭
│   │   │   ├── MentalCareTab.js        # 멘탈 케어 탭
│   │   │   ├── ContentConsultingTab.js # 콘텐츠 컨설팅 탭
│   │   │   ├── BadCommentsTab.js       # 원본 악플보기 탭
│   │   │   └── VideoDetailTab.js       # 영상 상세 탭
│   │   └── ui/                 # shadcn/ui 기반 UI 컴포넌트
│   │
│   ├── context/                # React Context
│   │   └── DashboardContext.js # 대시보드 상태 관리
│   │
│   └── lib/                    # 유틸리티 및 설정
│       ├── slices/            # Redux 슬라이스
│       │   └── authSlice.js   # 인증 상태 관리
│       ├── store.js           # Redux 스토어 설정
│       └── utils.js           # 공통 유틸리티 함수
│
├── public/                     # 정적 파일
├── package.json                # 프로젝트 의존성
├── tailwind.config.js         # Tailwind CSS 설정
└── README.md                   # 이 문서
```

---

## 주요 기능

### 1. 인증 시스템
- 이메일/비밀번호 로그인
- Google OAuth2 로그인
- 세션 기반 인증 (쿠키 자동 관리)

### 2. 대시보드
- 채널 목록 조회 및 관리
- 채널 동기화 (YouTube API 연동)
- 채널별 상세 분석

### 3. 채널 상세 페이지
- **전체 요약**: 최근 영상 목록, 댓글 분석 요약
- **멘탈 케어**: 댓글 감정 분석 및 멘탈 건강 지표
- **콘텐츠 컨설팅**: 영상 성과 분석 및 개선 제안
- **원본 악플보기**: 필터링된 부정적 댓글 조회

---

## 폰트 시스템 가이드

프로젝트는 일관된 폰트 시스템을 사용합니다. **새로운 텍스트 요소를 추가할 때 반드시 이 가이드를 따르세요.**

### 폰트 패밀리

1. **Inter** (기본 폰트)
   - 대부분의 텍스트에 사용
   - Google Fonts에서 로드

2. **Roboto** (보조 폰트)
   - 특정 요소에 사용 (필요시)
   - Google Fonts에서 로드

3. **Comic Neue** (로고 전용)
   - 로고 텍스트에만 사용
   - Google Fonts에서 로드

### 폰트 가중치 (Font Weight)

| 요소 | Weight | Tailwind 클래스 |
|------|--------|----------------|
| 로고 | 900 | `font-black` |
| h1, h2, h3, h4 | 500 | `font-medium` |
| 버튼, 라벨 | 500 | `font-medium` |
| 본문 텍스트 | 400 | `font-normal` (기본값) |

### 폰트 크기 (Font Size)

| 요소 | 크기 | Tailwind 클래스 |
|------|------|----------------|
| 로고 | 4xl (2.25rem) | `text-4xl` |
| h1 | 3xl (1.875rem) | `text-3xl` |
| h2 | 2xl (1.5rem) | `text-2xl` |
| h3 | xl (1.25rem) | `text-xl` |
| h4 | lg (1.125rem) | `text-lg` |
| 본문 | base (1rem) | `text-base` |
| 작은 텍스트 | sm (0.875rem) | `text-sm` |

### 줄간격 (Line Height)

**모든 텍스트 요소에 `leading-[1.5]` 적용 필수**

```jsx
// ✅ 올바른 예시
<h1 className="text-3xl font-medium leading-[1.5]">제목</h1>
<p className="text-base leading-[1.5]">본문 텍스트</p>
<button className="font-medium leading-[1.5]">버튼</button>

// ❌ 잘못된 예시
<h1 className="text-3xl font-bold">제목</h1>  // font-bold 사용 금지
<p className="text-base">본문</p>  // leading-[1.5] 누락
```

### 폰트 사용 예시

```jsx
// 로고
<h1 className="text-4xl font-black font-['Comic_Neue'] leading-none">
  Medi
</h1>

// 제목
<h2 className="text-2xl font-medium text-black mb-1 leading-[1.5]">
  내 채널 관리
</h2>

// 본문
<p className="text-gray-600 leading-[1.5]">
  등록된 채널 {count}개
</p>

// 버튼
<Button className="font-medium leading-[1.5]">
  동기화
</Button>
```

---

## 스타일링 가이드

### Tailwind CSS 사용
프로젝트는 Tailwind CSS를 사용합니다. 가능한 한 인라인 클래스를 사용하고, 커스텀 CSS는 최소화합니다.

### 색상 시스템
- `primary` - 주요 색상
- `secondary` - 보조 색상
- `destructive` - 경고/삭제 색상
- `muted` - 비활성/보조 텍스트
- `accent` - 강조 색상

### 반응형 디자인
- 모바일 우선 접근 방식
- `md:`, `lg:`, `xl:` 브레이크포인트 사용

### 컴포넌트 스타일
- shadcn/ui 기반 컴포넌트 사용
- `@/components/ui/` 경로의 컴포넌트 활용

---

## 주요 컴포넌트

### DashboardLayout (`src/app/dashboard/layout.js`)
대시보드의 레이아웃을 담당합니다.
- 사이드바 (채널 목록, 탭 네비게이션)
- 헤더 (로고, 사용자 메뉴)
- Context를 통한 상태 공유

### DashboardPage (`src/app/dashboard/page.js`)
대시보드의 메인 페이지입니다.
- 채널 목록 뷰
- 채널 상세 뷰
- 채널 동기화 및 관리 기능

### OverviewTab (`src/components/dashboard/OverviewTab.js`)
채널의 전체 요약을 보여주는 탭입니다.
- 최근 영상 목록
- 댓글 분석 요약
- 영상 검색 기능

### MentalCareTab (`src/components/dashboard/MentalCareTab.js`)
멘탈 케어 관련 정보를 표시하는 탭입니다.

### ContentConsultingTab (`src/components/dashboard/ContentConsultingTab.js`)
콘텐츠 컨설팅 정보를 표시하는 탭입니다.

### BadCommentsTab (`src/components/dashboard/BadCommentsTab.js`)
필터링된 부정적 댓글을 보여주는 탭입니다.

---
### 세션 쿠키
- 세션 쿠키는 자동으로 전송됩니다 (`credentials: 'include'`)
- 쿠키 이름: `MEDI_SESSION` (백엔드에서 확인 필요)
- 세션 만료 시 401 응답을 반환하면 프론트엔드에서 자동으로 로그인 페이지로 리다이렉트
## 문제 해결

### 일반적인 문제

**1. API 요청이 실패하는 경우**
- 백엔드 서버가 실행 중인지 확인
- `credentials: 'include'`가 포함되어 있는지 확인
- 브라우저 개발자 도구의 Network 탭에서 요청/응답 확인

**2. 세션이 유지되지 않는 경우**
- 쿠키가 제대로 설정되어 있는지 확인
- 브라우저의 쿠키 설정 확인
- 백엔드의 세션 설정 확인

**3. 스타일이 적용되지 않는 경우**
- Tailwind 클래스가 올바른지 확인
- `globals.css`가 import되어 있는지 확인
- 브라우저 캐시 삭제

