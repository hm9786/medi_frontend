"use client"; // 이 페이지는 기능이 매우 많으므로 'use client'가 필수입니다.

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";


// 10. ‼️ [수정됨] 에러/성공 메시지 표시 헬퍼 컴포넌트
// 'SignupStep2Page' 함수 바깥으로 분리했습니다.
// errors와 success를 props로 받도록 수정했습니다.
const FormMessage = ({
  name,
  errors,
  success,
}: {
  name: string;
  errors: { [key: string]: string };
  success: { [key: string]: string };
}) => {
  if (errors[name]) {
    return <p className="text-sm font-medium text-red-500">{errors[name]}</p>;
  }
  if (success[name]) {
    return <p className="text-sm font-medium text-green-600">{success[name]}</p>;
  }
  return null;
};


// 2. '회원가입 2단계' 페이지 본문
export default function SignupStep2Page() {
  // 1. 폼 데이터 '기억' (State)
  const [formData, setFormData] = useState({
    email: "",
    authCode: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });

  // 2. 유효성 검사 에러/성공 메시지 '기억' (State)
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<{ [key: string]: string }>({});

  // 3. 인증 상태 '기억' (State)
  const [isAuthCodeSent, setIsAuthCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const router = useRouter(); // 페이지 이동을 위한 훅

  // 4. 입력창 값이 바뀔 때마다 폼 데이터 State 업데이트
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // 입력창이 바뀌면 에러 메시지 초기화
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  // 5. [기능 명세서] 실시간 유효성 검사 (Password)
 // errors & success state 제거 가능
const passwordError = formData.password.length > 0 && formData.password.length < 8 ? "8자리 이상 영문, 숫자, 특수문자를 사용해 주세요." : "";
formData.password.length > 0 && formData.password.length < 8
  ? "8자리 이상 영문, 숫자, 특수문자를 사용해 주세요."
  : "";

const confirmPasswordError =
formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword
  ? "비밀번호가 일치하지 않습니다."
  : "";

const confirmPasswordSuccess =
formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword
  ? "비밀번호가 일치합니다."
  : "";


  // 6. [기능 명세서] 이메일 형식 검사
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "올바른 이메일 형식이 아닙니다." }));
      return false;
    }
    // [미래] 여기에서 백엔드 API로 이메일 중복 검사
    // if (isEmailDuplicate) {
    //   setErrors((prev) => ({ ...prev, email: "이미 사용 중인 이메일입니다." }));
    //   return false;
    // }

    setErrors((prev) => ({ ...prev, email: "" }));
    setSuccess((prev) => ({ ...prev, email: "사용 가능한 이메일입니다." }));
    return true;
  };

  // 7. [기능 명세서] 인증번호 받기
  const handleRequestAuthCode = () => {
    if (validateEmail()) {
      // [미래] 백엔드로 인증번호 발송 API 호출
      console.log("인증번호 발송:", formData.email);
      setSuccess((prev) => ({
        ...prev,
        email: "인증번호가 발송되었습니다. 6분 내에 입력해주세요.",
      }));
      // ⬇️ "인증번호 확인" 입력창을 보여주도록 상태 변경
      setIsAuthCodeSent(true);
    }
  };

  // 8. [기능 명세서] 인증번호 확인
  const handleVerifyAuthCode = () => {
    if (formData.authCode.length !== 6) {
      setErrors((prev) => ({ ...prev, authCode: "인증번호 6자리를 입력해주세요." }));
      return;
    }

    // [미래] 백엔드로 인증번호 확인 API 호출
    console.log("인증번호 확인:", formData.authCode);

    // (성공했다고 가정)
    setSuccess((prev) => ({ ...prev, authCode: "인증이 완료되었습니다." }));
    setErrors((prev) => ({ ...prev, authCode: "" }));
    setIsEmailVerified(true);

    // 인증이 완료되면 이메일 입력창도 비활성화
    setSuccess((prev) => ({ ...prev, email: "이메일 인증이 완료되었습니다." }));
  };

  // 9. [기능 명세서] 최종 회원가입 버튼 클릭
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 최종 유효성 검사
    if (!isEmailVerified) {
      setErrors((prev) => ({ ...prev, authCode: "이메일 인증을 완료해주세요." }));
      return;
    }
    if (
      formData.password !== formData.confirmPassword ||
      formData.password.length < 8
    ) {
      setErrors((prev) => ({ ...prev, password: "비밀번호를 확인해주세요." }));
      return;
    }
    if (formData.name.length < 2) {
      setErrors((prev) => ({ ...prev, name: "2글자 이상 이름을 입력해주세요." }));
      return;
    }
    // (전화번호 유효성 검사 등...)

    // [미래] 모든 폼 데이터를 백엔드로 전송
    console.log("회원가입 시도:", formData);

    // 성공 시
    alert("회원가입이 완료되었습니다!");
    router.push("/login"); // 로그인 페이지로 이동
  };

  // 10. 에러/성공 메시지 표시 헬퍼 컴포넌트
  // ‼️ [수정됨] FormMessage 컴포넌트 정의가 바깥으로 이동했습니다.


  return (
    <div className="min-h-screen bg-white">
      {/* 메인 콘텐츠 (flex를 사용해 화면 중앙에 배치) */}
      <main className="min-h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-8 w-full max-w-md px-4 py-8">
          {/* 제목 (Roboto 폰트 적용) */}
          <h1 className="text-6xl font-medium font-['Roboto'] text-black text-center">
            회원가입
          </h1>

          {/* 회원가입 폼 */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {/* 아이디(이메일) */}
            <div className="w-full grid gap-1.5">
              <Label
                htmlFor="email"
                className="text-base font-bold font-['Comic_Neue']"
              >
                아이디(이메일)
              </Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  id="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={validateEmail} // 포커스가 벗어날 때 형식 검사
                  disabled={isEmailVerified} // 이메일 인증 완료 시 수정 불가
                  className="h-14 rounded-2xl text-base"
                />
                <Button
                  type="button"
                  onClick={handleRequestAuthCode}
                  disabled={isEmailVerified}
                  className="h-14 rounded-lg text-base shrink-0"
                >
                  {isAuthCodeSent ? "재전송" : "인증번호 받기"}
                </Button>
              </div>
              {/* ‼️ [수정됨] props로 errors와 success를 전달합니다. */}
              <FormMessage name="email" errors={errors} success={success} />
            </div>

            {/*
              ⬇️ "인증번호 받기"를 누르면 (isAuthCodeSent === true가 되면)
              이 부분이 화면에 '추가로 생성'됩니다.
            */}
            {isAuthCodeSent && (
              <div className="w-full grid gap-1.5 animate-in fade-in-50 slide-in-from-top-2 duration-300">
                <Label
                  htmlFor="authCode"
                  className="text-base font-bold font-['Comic_Neue']"
                >
                  인증번호 확인
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    id="authCode"
                    placeholder="인증번호 6자리"
                    value={formData.authCode}
                    onChange={handleChange}
                    disabled={isEmailVerified} // 인증 완료되면 비활성화
                    className="h-14 rounded-2xl text-base"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyAuthCode}
                    disabled={isEmailVerified} // 인증 완료되면 비활성화
                    className="h-14 rounded-lg text-base shrink-0"
                  >
                    확인
                  </Button>
                </div>
                {/* ‼️ [수정됨] props로 errors와 success를 전달합니다. */}
                <FormMessage name="authCode" errors={errors} success={success} />
              </div>
            )}

            {/* 비밀번호 */}
            <div className="w-full grid gap-1.5">
              <Label
                htmlFor="password"
                className="text-base font-bold font-['Comic_Neue']"
              >
                비밀번호
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="8자리 이상 영문, 숫자, 특수문자"
                value={formData.password}
                onChange={handleChange}
                className="h-14 rounded-2xl text-base"
              />
              {/* ‼️ [수정됨] props로 errors와 success를 전달합니다. */}
              <FormMessage name="password" errors={errors} success={success} />
            </div>

            {/* 비밀번호 확인 */}
            <div className="w-full grid gap-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-base font-bold font-['Comic_Neue']"
              >
                비밀번호 확인
              </Label>
              <Input
                type="password"
                id="confirmPassword"
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-14 rounded-2xl text-base"
              />
              {/* ‼️ [수정됨] props로 errors와 success를 전달합니다. */}
              <FormMessage
                name="confirmPassword"
                errors={errors}
                success={success}
              />
            </div>

            {/* 이름 */}
            <div className="w-full grid gap-1.5">
              <Label
                htmlFor="name"
                className="text-base font-bold font-['Comic_Neue']"
              >
                이름
              </Label>
              <Input
                type="text"
                id="name"
                placeholder="이름 (2글자 이상)"
                value={formData.name}
                onChange={handleChange}
                className="h-14 rounded-2xl text-base"
              />
              {/* ‼️ [수정됨] props로 errors와 success를 전달합니다. */}
              <FormMessage name="name" errors={errors} success={success} />
            </div>

            {/* 전화번호 */}
            <div className="w-full grid gap-1.5">
              <Label
                htmlFor="phone"
                className="text-base font-bold font-['Comic_Neue']"
              >
                전화번호
              </Label>
              <Input
                type="tel"
                id="phone"
                placeholder="010-1234-5678"
                value={formData.phone}
                onChange={handleChange}
                className="h-14 rounded-2xl text-base"
              />
              {/* ‼️ [수정됨] props로 errors와 success를 전달합니다. */}
              <FormMessage name="phone" errors={errors} success={success} />
            </div>

            {/* 회원가입 하기 버튼 */}
            <Button
              type="submit"
              size="lg"
              className="h-14 w-full rounded-2xl text-base mt-4 font-bold"
            >
              회원가입 하기
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}