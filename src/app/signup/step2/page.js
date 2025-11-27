"use client"; // 이 페이지는 기능이 매우 많으므로 'use client'가 필수입니다.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import { apiUrl } from "@/lib/config";

// 10. 에러/성공 메시지 표시 헬퍼 컴포넌트
// (컴포넌트 바깥에 정의하여 ESLint 에러를 방지합니다)
const FormMessage = ({ name, errors, success }) => {
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
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});

  // 3. 인증 상태 '기억' (State)
  const [isAuthCodeSent, setIsAuthCodeSent] = useState(false); // 인증번호를 보냈는지
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증을 완료했는지
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [isSendingCode, setIsSendingCode] = useState(false); // 인증번호 발송 중
  const [isVerifyingCode, setIsVerifyingCode] = useState(false); // 인증번호 확인 중

  const router = useRouter(); // 페이지 이동을 위한 훅

  // 4. 입력창 값이 바뀔 때마다 폼 데이터 State 업데이트
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // 입력창이 바뀌면 에러 메시지 초기화
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  // ‼️ [수정됨] 5. 비밀번호 유효성 검사 (onBlur 이벤트용)
  // useEffect를 삭제하고, onBlur에서 호출할 함수를 만듭니다.
  const validatePasswords = () => {
    let newErrors = { ...errors }; // 기존 에러 복사
    let newSuccess = { ...success }; // 기존 성공 복사
    
    // 비밀번호 8자리 미만 검사
    if (formData.password.length > 0 && formData.password.length < 8) {
      newErrors.password = "8자리 이상 영문, 숫자, 특수문자를 사용해 주세요.";
    } else if (formData.password.length >= 8) {
      newErrors.password = ""; // 에러 없음
    }

    // 비밀번호 일치 검사
    if (
      formData.confirmPassword.length > 0 &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
      newSuccess.confirmPassword = "";
    } else if (
      formData.confirmPassword.length > 0 &&
      formData.password === formData.confirmPassword
    ) {
      newErrors.confirmPassword = "";
      newSuccess.confirmPassword = "비밀번호가 일치합니다.";
    } else {
      newSuccess.confirmPassword = "";
    }
    
    setErrors(newErrors);
    setSuccess(newSuccess);
    
    // handleSubmit에서 사용하기 위해 유효한지 여부를 반환
    // (에러 메시지가 없어야 유효함)
    return !newErrors.password && !newErrors.confirmPassword;
  };

  // 6. [기능 명세서] 이메일 형식 검사
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "올바른 이메일 형식이 아닙니다." }));
      return false;
    }
    // [미래] 여기에서 백엔드 API로 이메일 중복 검사
    // const isDuplicate = await checkEmailDuplicate(formData.email);
    // if (isDuplicate) {
    //   setErrors((prev) => ({ ...prev, email: "이미 사용 중인 이메일입니다." }));
    //   return false;
    // }

    setErrors((prev) => ({ ...prev, email: "" }));
    setSuccess((prev) => ({ ...prev, email: "사용 가능한 이메일입니다." }));
    return true;
  };

  // 7. [기능 명세서] 인증번호 받기
  const handleRequestAuthCode = async () => {
    if (!validateEmail()) {
      return;
    }

    setIsSendingCode(true);
    setErrors((prev) => ({ ...prev, email: "" }));

    try {
      const response = await fetch(apiUrl("api/auth/send-verification"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 세션 쿠키 사용
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      // HTTP 상태 코드 확인
      if (!response.ok) {
        try {
          const errorData = await response.json();
          setErrors((prev) => ({
            ...prev,
            email: errorData.message || "인증번호 발송에 실패했습니다.",
          }));
        } catch {
          setErrors((prev) => ({
            ...prev,
            email: `서버 오류가 발생했습니다. (${response.status})`,
          }));
        }
        return;
      }

      const data = await response.json();

      if (data.success) {
        setSuccess((prev) => ({
          ...prev,
          email: "인증번호가 발송되었습니다. 6분 내에 입력해주세요.",
        }));
        setIsAuthCodeSent(true);
      } else {
        setErrors((prev) => ({
          ...prev,
          email: data.message || "인증번호 발송에 실패했습니다.",
        }));
      }
    } catch (error) {
      console.error("인증번호 발송 오류:", error);
      setErrors((prev) => ({
        ...prev,
        email: "서버 연결에 실패했습니다. 다시 시도해주세요.",
      }));
    } finally {
      setIsSendingCode(false);
    }
  };

  // 8. [기능 명세서] 인증번호 확인
  const handleVerifyAuthCode = async () => {
    if (formData.authCode.length !== 6) {
      setErrors((prev) => ({ ...prev, authCode: "인증번호 6자리를 입력해주세요." }));
      return;
    }

    setIsVerifyingCode(true);
    setErrors((prev) => ({ ...prev, authCode: "" }));

    try {
      const response = await fetch(apiUrl("api/auth/verify-email"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 세션 쿠키 사용
        body: JSON.stringify({
          email: formData.email,
          code: formData.authCode,
        }),
      });

      // HTTP 상태 코드 확인
      if (!response.ok) {
        try {
          const errorData = await response.json();
          setErrors((prev) => ({
            ...prev,
            authCode: errorData.message || "인증 코드가 올바르지 않거나 만료되었습니다.",
          }));
        } catch {
          setErrors((prev) => ({
            ...prev,
            authCode: `서버 오류가 발생했습니다. (${response.status})`,
          }));
        }
        return;
      }

      const data = await response.json();

      if (data.success) {
        setSuccess((prev) => ({ ...prev, authCode: "인증이 완료되었습니다." }));
        setIsEmailVerified(true);
        setSuccess((prev) => ({ ...prev, email: "이메일 인증이 완료되었습니다." }));
      } else {
        setErrors((prev) => ({
          ...prev,
          authCode: data.message || "인증 코드가 올바르지 않거나 만료되었습니다.",
        }));
      }
    } catch (error) {
      console.error("인증번호 확인 오류:", error);
      setErrors((prev) => ({
        ...prev,
        authCode: "서버 연결에 실패했습니다. 다시 시도해주세요.",
      }));
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // 9. [기능 명세서] 최종 회원가입 버튼 클릭
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ‼️ [수정됨] 제출 시점에 모든 유효성 검사를 다시 실행합니다.
    const isPasswordValid = validatePasswords(); // 비밀번호 검사
    const isEmailValid = validateEmail(); // 이메일 검사

    // 최종 유효성 검사
    let submitErrors = {};
    if (!isEmailVerified) {
      submitErrors.authCode = "이메일 인증을 완료해주세요.";
    }
    if (formData.name.length < 2) {
      submitErrors.name = "2글자 이상 이름을 입력해주세요.";
    }
    
    // ‼️ [수정됨] 모든 에러를 한 번에 업데이트
    setErrors(prev => ({...prev, ...submitErrors}));

    // ‼️ [수정됨] 모든 검사를 통과했는지 확인
    if (!isPasswordValid || !isEmailValid || !isEmailVerified || formData.name.length < 2) {
      return;
    }

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, submit: "" }));

    try {
      // 회원가입 API 호출
      const response = await fetch(apiUrl("api/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 세션 쿠키 사용
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          isTermsAgreed: true, // Step1에서 이미 동의했으므로 true
        }),
      });

      // HTTP 상태 코드 확인
      if (!response.ok) {
        try {
          const errorData = await response.json();
          setErrors((prev) => ({
            ...prev,
            submit: errorData.message || "회원가입에 실패했습니다.",
          }));
        } catch {
          setErrors((prev) => ({
            ...prev,
            submit: `서버 오류가 발생했습니다. (${response.status})`,
          }));
        }
        return;
      }

      const data = await response.json();

      if (data.success) {
        alert("회원가입이 완료되었습니다!");
        router.push("/login");
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: data.message || "회원가입에 실패했습니다.",
        }));
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "서버 연결에 실패했습니다. 다시 시도해주세요.",
      }));
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <Navigation variant="landing" />

      {/* 메인 콘텐츠 (flex를 사용해 화면 중앙에 배치) */}
      <main className="min-h-screen flex flex-col justify-center items-center pt-20">
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
                  disabled={isEmailVerified || isSendingCode}
                  className="h-14 rounded-lg text-base shrink-0"
                >
                  {isSendingCode ? "발송 중..." : isAuthCodeSent ? "재전송" : "인증번호 받기"}
                </Button>
              </div>
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
                    disabled={isEmailVerified || isVerifyingCode}
                    className="h-14 rounded-lg text-base shrink-0"
                  >
                    {isVerifyingCode ? "확인 중..." : "확인"}
                  </Button>
                </div>
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
                onBlur={validatePasswords} // ⬅️ [수정됨] useEffect 대신 onBlur 추가
                className="h-14 rounded-2xl text-base"
              />
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
                onBlur={validatePasswords} // ⬅️ [수정됨] useEffect 대신 onBlur 추가
                className="h-14 rounded-2xl text-base"
              />
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
              <FormMessage name="phone" errors={errors} success={success} />
            </div>

            {/* 에러 메시지 표시 */}
            {errors.submit && (
              <p className="text-sm font-medium text-red-500">{errors.submit}</p>
            )}

            {/* 회원가입 하기 버튼 */}
            <Button
              type="submit"
              size="lg"
              className="h-14 w-full rounded-2xl text-base mt-4 font-bold"
              disabled={isLoading}
            >
              {isLoading ? "회원가입 중..." : "회원가입 하기"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}