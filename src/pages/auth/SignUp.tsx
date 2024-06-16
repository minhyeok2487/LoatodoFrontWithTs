import styled from "@emotion/styled";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import AuthLayout from "@layouts/AuthLayout";

import * as authApi from "@core/apis/Auth.api";
import { loading } from "@core/atoms/Loading.atom";
import { emailRegex, passwordRegex } from "@core/regex";

import InputBox from "@components/InputBox";

import Box from "./components/Box";
import Divider from "./components/Divider";
import EmailTimer from "./components/EmailTimer";
import SocialLoginBtns from "./components/SocialLoginBtns";
import SubmitButton from "./components/SubmitButton";
import UtilLink from "./components/UtilLink";
import Welcome from "./components/Welcome";

const SignUp = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const equalPasswordInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [startTimer, setStartTimer] = useState(false);
  const [authNumber, setAuthNumber] = useState("");
  const [authNumberMessage, setAuthNumberMessage] = useState("");
  const [authEmail, setAuthEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [equalPassword, setEqualPassword] = useState("");
  const [equalPasswordMessage, setEqualPasswordMessage] = useState("");
  const setLoadingState = useSetRecoilState(loading);
  const [emailAuthSuccess, setEmailAuthSuccess] = useState(false);

  const navigate = useNavigate();

  // 메시지 리셋
  const messageReset = () => {
    setEmailMessage("");
    setAuthNumberMessage("");
    setPasswordMessage("");
    setEqualPasswordMessage("");
  };

  // 메일 전송
  const submitMail = async () => {
    messageReset();
    if (!email) {
      setEmailMessage("이메일을 입력해주세요.");
      return;
    }

    if (!emailRegex(email)) {
      setEmailMessage("이메일 형식을 입력해주세요.");
      return;
    }

    try {
      setLoadingState(true);
      const response = await authApi.submitMail(email);
      if (response.success) {
        setStartTimer(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  const authMail = async () => {
    messageReset();

    if (!authNumber) {
      setAuthNumberMessage("인증번호를 올바르게 입력해주세요.");
      return;
    }

    try {
      setLoadingState(true);
      const response = await authApi.authMail(email, authNumber);
      if (response) {
        setStartTimer(false);
        setEmailAuthSuccess(true);
        setAuthEmail(true);
      } else {
        setAuthNumberMessage(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    messageReset();

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
      setPasswordMessage("비밀번호는 8~10자 영문, 숫자 조합이어야 합니다.");
      return;
    }

    if (password !== equalPassword) {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
      setEqualPasswordMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!authEmail) {
      setEmailMessage("이메일 인증이 정상처리되지 않았습니다.");
      setAuthNumberMessage("이메일 인증이 정상처리되지 않았습니다.");
      return;
    }

    try {
      const response = await authApi.signup(
        email,
        authNumber,
        password,
        equalPassword
      );
      if (response) {
        alert("회원가입이 정상처리 되었습니다.");
        navigate("/signup/character");
      }
    } catch (error) {
      console.log(error);
    }
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
            disabled={emailAuthSuccess}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitMail();
              }
            }}
            message={emailMessage}
            rightButtonText={emailAuthSuccess ? "" : "전송"}
            onRightButtonClick={submitMail}
          />
          <EmailTimer startTimer={startTimer} />

          <InputBox
            type="text"
            placeholder="인증번호 확인 (숫자)"
            value={authNumber}
            setValue={setAuthNumber}
            disabled={emailAuthSuccess}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                authMail();
              }
            }}
            message={authNumberMessage}
            rightButtonText={emailAuthSuccess ? "" : "확인"}
            onRightButtonClick={authMail}
          />

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

          <SubmitButton>회원가입</SubmitButton>
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
  gap: 10px;
  margin-top: 10px;
`;
