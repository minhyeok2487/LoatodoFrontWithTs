import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

import AuthLayout from "@layouts/AuthLayout";

import useAuthEmail from "@core/hooks/mutations/auth/useAuthEmail";
import useRequestSignupCertificationEmail from "@core/hooks/mutations/auth/useRequestSignupCertificationEmail";
import useSignup from "@core/hooks/mutations/auth/useSignup";
import useAuthActions from "@core/hooks/useAuthActions";
import { emailRegex, passwordRegex } from "@core/regex";

import Button from "@components/Button";
import InputBox from "@components/InputBox";
import Divider from "@components/form/Divider";

import Box from "./components/Box";
import EmailTimer from "./components/EmailTimer";
import SocialLoginBtns from "./components/SocialLoginBtns";
import UtilLink from "./components/UtilLink";
import Welcome from "./components/Welcome";

const SignUp = () => {
  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement>(null);
  const equalPasswordInputRef = useRef<HTMLInputElement>(null);

  const { setAuth } = useAuthActions();

  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const [authNumber, setAuthNumber] = useState("");
  const [authNumberMessage, setAuthNumberMessage] = useState("");

  const [authEmailExpiredAt, setAuthEmailExpiredAt] = useState("");
  const [authEmailSuccess, setAuthEmailSuccess] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [equalPassword, setEqualPassword] = useState("");
  const [equalPasswordMessage, setEqualPasswordMessage] = useState("");

  // 1. 인증 이메일 전송
  const requestSignupCertificationEmail = useRequestSignupCertificationEmail({
    onSuccess: () => {
      setAuthEmailExpiredAt(
        dayjs().add(3, "minutes").format("YYYY-MM-DD HH:mm:ss")
      );
      toast("입력하신 이메일로 인증번호가 전송되었습니다.");
    },
  });

  // 2. 인증번호와 이메일 확인
  const authEmail = useAuthEmail({
    onSuccess: () => {
      setAuthEmailExpiredAt("");
      setAuthEmailSuccess(true);
    },
  });

  // 3. 회원 가입
  const signup = useSignup({
    onSuccess: (data) => {
      setAuth({
        token: data.token,
        username: data.username,
        adsDate: null,
      });

      toast.success("회원가입이 완료되었습니다.");
      navigate("/signup/characters", { replace: true });
    },
  });

  // 메시지 리셋
  const messageReset = () => {
    setEmailMessage("");
    setAuthNumberMessage("");
    setPasswordMessage("");
    setEqualPasswordMessage("");
  };

  useEffect(() => {
    // 페이지 로드 시 모든 상태 초기화
    setAuthEmailExpiredAt("");
    setAuthEmailSuccess(false);
    messageReset();
  }, []);

  // 인증 메일 전송
  const submitMail = () => {
    messageReset();
    if (!email) {
      setEmailMessage("이메일을 입력해주세요.");
      return;
    }

    if (!emailRegex(email)) {
      setEmailMessage("이메일 형식을 입력해주세요.");
      return;
    }

    requestSignupCertificationEmail.mutate({ mail: email });
  };

  // 인증번호 확인
  const submitAuth = () => {
    messageReset();

    if (!authNumber) {
      setAuthNumberMessage("인증번호를 올바르게 입력해주세요.");
      return;
    }

    authEmail.mutate({ mail: email, number: authNumber });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    messageReset();

    if (!authEmailSuccess) {
      setEmailMessage("이메일 인증이 정상처리되지 않았습니다.");
      setAuthNumberMessage("이메일 인증이 정상처리되지 않았습니다.");
      return;
    }

    if (!email || !authNumber || !password || !equalPassword) {
      if (!email) {
        setEmailMessage("이메일을 입력해주세요.");
      }
      if (!password) {
        setPasswordMessage("비밀번호를 입력해주세요.");
      }
      if (!authNumber) {
        setAuthNumberMessage("인증번호를 입력해주세요.");
      }
      if (!equalPassword) {
        setEqualPasswordMessage("비밀번호 확인을 입력해주세요.");
      }
      return;
    }

    if (!emailRegex(email)) {
      setEmailMessage("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    if (!passwordRegex(password)) {
      setPasswordMessage("비밀번호는 8~20자 영문, 숫자 조합이어야 합니다.");
      return;
    }

    if (password !== equalPassword) {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
      setEqualPasswordMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    signup.mutate({ mail: email, number: authNumber, password, equalPassword });
  };

  return (
    <AuthLayout>
      <Box>
        <Welcome>모코코만큼 환영해요 :)</Welcome>

        <Form ref={formRef} onSubmit={handleSubmit}>
          <InputBox
            type="email"
            placeholder="이메일"
            value={email}
            setValue={setEmail}
            disabled={authEmailSuccess}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitMail();
              }
            }}
            message={emailMessage}
            successMessage={
              authEmailSuccess ? "이메일 인증이 완료되었습니다." : undefined
            }
            rightButtonText={authEmailSuccess ? "" : "전송"}
            onRightButtonClick={submitMail}
          />
          <EmailTimer
            onExpired={() => {
              setAuthNumber("");
              setAuthEmailExpiredAt("");
              setAuthEmailSuccess(false);
              setEmailMessage(
                "인증번호가 만료되었습니다. 이메일 인증을 다시 진행해주세요."
              );
            }}
            expiredAt={authEmailExpiredAt}
            isSuccess={authEmailSuccess}
          />

          {authEmailExpiredAt && !authEmailSuccess && (
            <InputBox
              type="text"
              placeholder="인증번호 확인 (숫자)"
              value={authNumber}
              setValue={setAuthNumber}
              disabled={authEmailSuccess}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitAuth();
                }
              }}
              message={authNumberMessage}
              rightButtonText={authEmailSuccess ? "" : "확인"}
              onRightButtonClick={submitAuth}
            />
          )}

          <InputBox
            type="password"
            placeholder="비밀번호 (8~20자 영문, 숫자)"
            value={password}
            setValue={setPassword}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                equalPasswordInputRef.current?.focus();
              }
            }}
            message={passwordMessage}
          />

          <InputBox
            ref={equalPasswordInputRef}
            type="password"
            placeholder="비밀번호 확인"
            value={equalPassword}
            setValue={setEqualPassword}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                formRef.current?.requestSubmit();
              }
            }}
            message={equalPasswordMessage}
          />

          <Button variant="contained" size="large" type="submit" fullWidth>
            회원가입
          </Button>
        </Form>

        <UtilRow>
          <UtilLink to="/login">뒤로가기</UtilLink>
        </UtilRow>

        <Divider>또는</Divider>

        <SocialLoginBtns />
      </Box>
    </AuthLayout>
  );
};

export default SignUp;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin: 20px 0 16px;
`;

const UtilRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
`;
