import { Font } from "@react-pdf/renderer";

/**
 * 한글 폰트 등록
 * react-pdf/renderer에서 한글을 표시하기 위해 폰트를 등록합니다.
 * 
 * 중요: react-pdf/renderer는 로컬 파일 경로나 base64 인코딩된 폰트만 지원합니다.
 * 
 * 사용 방법:
 * 1. 폰트 파일 다운로드
 *    - Noto Sans KR 폰트 다운로드: https://fonts.google.com/noto/specimen/Noto+Sans+KR
 *    - 또는 나눔고딕: https://hangeul.naver.com/2017/nanum
 * 
 * 2. public/fonts/ 폴더 생성 및 폰트 파일 추가
 *    - public/fonts/NotoSansKR-Regular.ttf
 *    - public/fonts/NotoSansKR-Bold.ttf
 * 
 * 3. 아래 주석을 해제하여 로컬 폰트 사용
 */

// 한글 폰트 등록
try {
  // 방법 1: 로컬 폰트 파일 사용 (권장)
  // public/fonts/ 폴더에 폰트 파일을 추가한 후 주석을 해제하세요
  Font.register({
    family: "NotoSansKR",
    fonts: [
      {
        src: "/fonts/NotoSansKR-Regular.ttf",
        fontWeight: 400,
      },
      {
        src: "/fonts/NotoSansKR-Regular.ttf", // Medium (600)이 없으면 Regular 사용
        fontWeight: 600,
      },
      {
        src: "/fonts/NotoSansKR-Bold.ttf",
        fontWeight: 700,
      },
    ],
  });
  console.log("한글 폰트 등록 완료: NotoSansKR");
} catch (error) {
  console.warn("한글 폰트 등록 실패:", error);
  console.warn("public/fonts/ 폴더에 NotoSansKR-Regular.ttf와 NotoSansKR-Bold.ttf 파일을 추가하세요.");
  
  // 폴백: 나눔고딕 시도
  try {
    Font.register({
      family: "NotoSansKR",
      fonts: [
        {
          src: "/fonts/NanumGothic-Regular.ttf",
          fontWeight: 400,
        },
        {
          src: "/fonts/NanumGothic-Bold.ttf",
          fontWeight: 700,
        },
      ],
    });
    console.log("나눔고딕 폰트 등록 완료");
  } catch (fallbackError) {
    console.warn("나눔고딕 폰트 등록도 실패:", fallbackError);
    // 최종 폴백: 기본 Helvetica (한글 깨짐 가능)
  }
}

