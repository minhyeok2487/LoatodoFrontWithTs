import styled from "@emotion/styled";
import { useRef, useState } from "react";
import type { FC, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import AuthLayout from "@layouts/AuthLayout";

import { themeAtom } from "@core/atoms/theme.atom";
import useIdPwLogin from "@core/hooks/mutations/auth/useIdPwLogin";
import useAuthActions from "@core/hooks/useAuthActions";
import { emailRegex } from "@core/regex";

import InputBox from "@components/InputBox";
import Logo from "@components/Logo";

import Box from "./components/Box";
import Divider from "./components/Divider";
import SocialLoginBtns from "./components/SocialLoginBtns";
import SubmitButton from "./components/SubmitButton";
import UtilLink from "./components/UtilLink";

interface Props {
  message?: string;
}

const Login: FC<Props> = ({ message = "" }) => {
  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { setAuth } = useAuthActions();
  const theme = useRecoilValue(themeAtom);

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const idPwLogin = useIdPwLogin({
    onSuccess: (data) => {
      setAuth({
        token: data.token,
        username: data.username,
      });

      navigate("/", { replace: true });
    },
  });

  // 유효성 검사
  const isValidate = () => {
    if (!username || !password) {
      if (!username) {
        setUsernameMessage("이메일을 입력해주세요.");
      }
      if (!password) {
        setPasswordMessage("비밀번호를 입력해주세요.");
      }
      return false;
    }

    if (!emailRegex(username)) {
      setUsernameMessage("이메일 형식을 입력해주세요.");
      return false;
    }

    return true;
  };

  // 메시지 리셋
  const messageReset = () => {
    setUsernameMessage("");
    setPasswordMessage("");
  };

  // 로그인 기능
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    messageReset();
    if (isValidate()) {
      try {
        idPwLogin.mutate({ username, password });
      } catch (error) {
        setPasswordMessage("이메일 또는 패스워드가 일치하지 않습니다.");
        setUsernameMessage("이메일 또는 패스워드가 일치하지 않습니다.");
      }
    }
  };

  return (
    <AuthLayout>
      <Box>
        {/* 메시지 받으면 보임 (ex. 비로그인 상태에서 숙제, 깐부탭 클릭 시) */}

        <Logo isDarkMode={theme === "dark"} />

        {message && <Message>{message}</Message>}

        <Form ref={formRef} onSubmit={handleSubmit}>
          <InputBox
            type="email"
            placeholder="이메일"
            value={username}
            setValue={setUsername}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                passwordInputRef.current?.focus();
              }
            }}
            message={usernameMessage}
          />
          <InputBox
            ref={passwordInputRef}
            type="password"
            placeholder="비밀번호"
            value={password}
            setValue={setPassword}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                formRef.current?.requestSubmit();
              }
            }}
            message={passwordMessage}
          />

          <SubmitButton>로그인</SubmitButton>
        </Form>

        <UtilRow>
          <UtilLink to="/signup">회원가입</UtilLink>

          {/* <UtilLink to="/find-password">비밀번호를 잊어버렸어요</UtilLink> */}
        </UtilRow>

        <Divider>또는</Divider>

        <SocialLoginBtns />
      </Box>
    </AuthLayout>
  );
};

export default Login;

const Message = styled.span`
  margin-bottom: 24px;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  width: 100%;
`;

const UtilRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
`;
