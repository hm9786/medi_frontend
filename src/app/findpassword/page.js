"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

// 에러/성공 메시지 표시 헬퍼 컴포넌트
const FormMessage = ({ name, errors, success }) => {
  if (errors[name]) {
    return <p className="text-sm font-medium text-red-500">{errors[name]}</p>;
  }
  if (success[name]) {
    return <p className="text-sm font-medium text-green-600">{success[name]}</p>;
  }
  return null;
};

export default function FindPasswordPage() {
  // 폼 데이터 State
  const [formData, setFormData] = useState({
    email: "",
    authCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 유효성 검사 에러/성공 메시지 State
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});

  // 인증 상태 State
  const [isAuthCodeSent, setIsAuthCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const router = useRouter();

  // 입력창 값 변경 핸들러
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // 입력창이 바뀌면 에러 메시지 초기화
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  // 이메일 형식 검사
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "올바른 이메일 형식이 아닙니다." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  // 비밀번호 유효성 검사
  const validatePasswords = () => {
    let newErrors = { ...errors };
    let newSuccess = { ...success };

    // 비밀번호 8자리 미만 검사
    if (formData.newPassword.length > 0 && formData.newPassword.length < 8) {
      newErrors.newPassword = "8자리 이상 영문, 숫자, 특수문자를 사용해 주세요.";
    } else if (formData.newPassword.length >= 8) {
      newErrors.newPassword = "";
    }

    // 비밀번호 일치 검사
    if (
      formData.confirmPassword.length > 0 &&
      formData.newPassword !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
      newSuccess.confirmPassword = "";
    } else if (
      formData.confirmPassword.length > 0 &&
      formData.newPassword === formData.confirmPassword
    ) {
      newErrors.confirmPassword = "";
      newSuccess.confirmPassword = "비밀번호가 일치합니다.";
    } else {
      newSuccess.confirmPassword = "";
    }

    setErrors(newErrors);
    setSuccess(newSuccess);

    return !newErrors.newPassword && !newErrors.confirmPassword;
  };

  // 인증번호 받기
  const handleRequestAuthCode = async () => {
    if (!validateEmail()) {
      return;
    }

    setIsSendingCode(true);
    setErrors((prev) => ({ ...prev, email: "" }));

    try {
      const response = await fetch("http://localhost:8080/api/auth/send-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
        }),
      });

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
          email: "인증번호가 발송되었습니다. 5분 내에 입력해주세요.",
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

  // 인증번호 확인
  const handleVerifyAuthCode = async () => {
    if (formData.authCode.length !== 6) {
      setErrors((prev) => ({ ...prev, authCode: "인증번호 6자리를 입력해주세요." }));
      return;
    }

    setIsVerifyingCode(true);
    setErrors((prev) => ({ ...prev, authCode: "" }));

    // 인증번호 확인은 비밀번호 재설정 API에서 함께 처리되므로
    // 여기서는 단순히 형식만 확인하고, 실제 확인은 비밀번호 재설정 시점에 수행
    setSuccess((prev) => ({ ...prev, authCode: "인증번호가 입력되었습니다." }));
    setIsCodeVerified(true);
    setIsVerifyingCode(false);
  };

  // 비밀번호 재설정
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // 최종 유효성 검사
    const isPasswordValid = validatePasswords();
    const isEmailValid = validateEmail();

    if (!isEmailValid) {
      return;
    }

    if (!isAuthCodeSent) {
      setErrors((prev) => ({
        ...prev,
        submit: "인증번호를 먼저 받아주세요.",
      }));
      return;
    }

    if (!formData.authCode || formData.authCode.length !== 6) {
      setErrors((prev) => ({
        ...prev,
        authCode: "인증번호 6자리를 입력해주세요.",
      }));
      return;
    }

    if (!isPasswordValid) {
      setErrors((prev) => ({
        ...prev,
        submit: "비밀번호를 올바르게 입력해주세요.",
      }));
      return;
    }

    setIsResetting(true);
    setErrors((prev) => ({ ...prev, submit: "" }));

    try {
      const response = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          code: formData.authCode,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          setErrors((prev) => ({
            ...prev,
            submit: errorData.message || "비밀번호 재설정에 실패했습니다.",
            authCode: errorData.message?.includes("인증 코드") ? errorData.message : "",
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
        alert("비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.");
        router.push("/login");
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: data.message || "비밀번호 재설정에 실패했습니다.",
        }));
      }
    } catch (error) {
      console.error("비밀번호 재설정 오류:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "서버 연결에 실패했습니다. 다시 시도해주세요.",
      }));
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <Navigation />

      {/* 메인 콘텐츠 */}
      <main className="min-h-screen flex flex-col justify-start items-center pt-16">
        <div className="flex flex-col items-center gap-8 w-full max-w-md px-4 py-8">
          {/* 제목 */}
          <h1 className="text-6xl font-medium font-['Roboto'] text-black mb-12">
            비밀번호 찾기
          </h1>

          {/* 비밀번호 재설정 폼 */}
          <form onSubmit={handleResetPassword} className="w-full flex flex-col gap-4">
            {/* 이메일 입력 */}
            <div className="w-full grid gap-1.5">
              <Label
                htmlFor="email"
                className="text-xl font-bold font-['Comic_Neue'] text-black"
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
                  onBlur={validateEmail}
                  disabled={isCodeVerified}
                  className="h-14 rounded-2xl text-base"
                />
                <Button
                  type="button"
                  onClick={handleRequestAuthCode}
                  disabled={isCodeVerified || isSendingCode}
                  className="h-14 rounded-lg text-base shrink-0"
                >
                  {isSendingCode ? "발송 중..." : isAuthCodeSent ? "재전송" : "인증번호 받기"}
                </Button>
              </div>
              <FormMessage name="email" errors={errors} success={success} />
            </div>

            {/* 인증번호 입력 (인증번호 발송 후 표시) */}
            {isAuthCodeSent && (
              <div className="w-full grid gap-1.5 animate-in fade-in-50 slide-in-from-top-2 duration-300">
                <Label
                  htmlFor="authCode"
                  className="text-xl font-bold font-['Comic_Neue'] text-black"
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
                    disabled={isCodeVerified}
                    maxLength={6}
                    className="h-14 rounded-2xl text-base"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyAuthCode}
                    disabled={isCodeVerified || isVerifyingCode}
                    className="h-14 rounded-lg text-base shrink-0"
                  >
                    {isVerifyingCode ? "확인 중..." : "확인"}
                  </Button>
                </div>
                <FormMessage name="authCode" errors={errors} success={success} />
              </div>
            )}

            {/* 새 비밀번호 입력 (인증번호 확인 후 표시) */}
            {isCodeVerified && (
              <>
                <div className="w-full grid gap-1.5 animate-in fade-in-50 slide-in-from-top-2 duration-300">
                  <Label
                    htmlFor="newPassword"
                    className="text-xl font-bold font-['Comic_Neue'] text-black"
                  >
                    새 비밀번호
                  </Label>
                  <Input
                    type="password"
                    id="newPassword"
                    placeholder="8자리 이상 영문, 숫자, 특수문자"
                    value={formData.newPassword}
                    onChange={handleChange}
                    onBlur={validatePasswords}
                    className="h-14 rounded-2xl text-base"
                  />
                  <FormMessage name="newPassword" errors={errors} success={success} />
                </div>

                {/* 비밀번호 확인 */}
                <div className="w-full grid gap-1.5">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-xl font-bold font-['Comic_Neue'] text-black"
                  >
                    비밀번호 확인
                  </Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={validatePasswords}
                    className="h-14 rounded-2xl text-base"
                  />
                  <FormMessage
                    name="confirmPassword"
                    errors={errors}
                    success={success}
                  />
                </div>
              </>
            )}

            {/* 에러 메시지 표시 */}
            {errors.submit && (
              <p className="text-sm font-medium text-red-500">{errors.submit}</p>
            )}

            {/* 비밀번호 재설정 버튼 */}
            {isCodeVerified && (
              <Button
                type="submit"
                size="lg"
                className="h-14 w-full rounded-2xl text-base mt-4"
                disabled={isResetting}
              >
                {isResetting ? "재설정 중..." : "비밀번호 재설정"}
              </Button>
            )}
          </form>

          {/* 로그인 링크 */}
          <div className="text-sm text-black-600">
            <Link href="/login" className="font-bold text-gray-500 hover:underline">
              로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

