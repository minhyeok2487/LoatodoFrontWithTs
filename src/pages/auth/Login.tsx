import styled from "@emotion/styled";
import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import AuthLayout from "@layouts/AuthLayout";

import { idpwLogin } from "@core/apis/Auth.api";
import { themeAtom } from "@core/atoms/Theme.atom";
import { emailRegex } from "@core/regex";

import InputBox from "@components/InputBox";
import Logo from "@components/Logo";

import "@styles/pages/Auth.css";

import SocialLoginBtns from "./components/SocialLoginBtns";

interface Props {
  message?: string;
}

const Login: FC<Props> = ({ message = "" }) => {
  const theme = useRecoilValue(themeAtom);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // 유효성 검사
  const validation = () => {
    if (!username || !password) {
      if (!username) {
        setUsernameMessage("이메일을 입력해주세요.");
      }
      if (!password) {
        setPasswordMessage("비밀번호를 입력해주세요.");
      }
      return;
    }

    if (!emailRegex(username)) {
      setUsernameMessage("이메일 형식을 입력해주세요.");
    }
  };

  // 메시지 리셋
  const messageReset = () => {
    setUsernameMessage("");
    setPasswordMessage("");
  };

  // 로그인 기능
  const login = async () => {
    messageReset();
    validation();
    try {
      const response = await idpwLogin(username, password);
      localStorage.setItem("ACCESS_TOKEN", response.token);
      window.location.replace("/");
    } catch (error) {
      setPasswordMessage("이메일 또는 패스워드가 일치하지 않습니다.");
      setUsernameMessage("이메일 또는 패스워드가 일치하지 않습니다.");
    }
  };

  return (
    <AuthLayout>
      <Wrapper className="auth-container">
        {/* 메시지 받으면 보임 (ex. 비로그인 상태에서 숙제, 깐부탭 클릭 시) */}

        <Logo isDarkMode={theme === "dark"} />

        {message && <Message>{message}</Message>}

        <Form>
          <InputBox
            className="login"
            type="email"
            id="email-input-box"
            placeholder="이메일"
            value={username}
            setValue={setUsername}
            onKeyPress={login}
            message={usernameMessage}
          />
          <InputBox
            className="password"
            type="password"
            id="password-input-box"
            placeholder="비밀번호"
            value={password}
            setValue={setPassword}
            onKeyPress={login}
            message={passwordMessage}
          />

          <SubmitButton type="submit" onClick={login}>
            로그인
          </SubmitButton>
        </Form>

        <UtilRow>
          <Link to="/signup">회원가입</Link>

          {/* <Link
            to="/find-password"
            onClick={(e) => {
              e.preventDefault();

              alert("기능 준비중입니다. 잠시만 기다려주세요.");
            }}
          >
            비밀번호를 잊어버렸어요
          </Link> */}
        </UtilRow>

        <SocialDivider>또는</SocialDivider>

        <SocialLoginBtns />
      </Wrapper>
    </AuthLayout>
  );
};

export default Login;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 45px;
  padding: 40px 60px 80px;
  width: 100%;
  max-width: 570px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.light};
  border-radius: 16px;
`;

const Message = styled.span`
  margin-bottom: 24px;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SubmitButton = styled.button`
  margin: 16px 0;
  width: 100%;
  height: 50px;
  border-radius: 20px;
  background: ${({ theme }) => theme.app.semiBlack1};
  color: ${({ theme }) => theme.app.white};
`;

const UtilRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 10px;

  a {
    line-height: 1;
    font-size: 14px;
    font-weight: 700;
    border-bottom: 1px solid ${({ theme }) => theme.app.text.dark1};
  }
`;

const SocialDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 30px;
  width: 100%;
  font-size: 14px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.app.border};
  }
`;
