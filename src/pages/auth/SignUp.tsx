import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import AuthLayout from "@layouts/AuthLayout";

import * as authApi from "@core/apis/Auth.api";
import { loading } from "@core/atoms/Loading.atom";
import { emailRegex, passwordRegex } from "@core/regex";

import InputBox from "@components/InputBox";

import EmailTimer from "./components/EmailTimer";
import SocialLoginBtns from "./components/SocialLoginBtns";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [startTimer, setStartTimer] = useState(false);
  const [authNumber, setAuthNumber] = useState("");
  const [authNumberMessage, setAuthNumberMessage] = useState("");
  const [authEmail, setAuthEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [equalPassword, setEqualPassword] = useState("");
  const [equalPasswordMessage, setEqualPasswordMessage] = useState("");
  const setLoadingState = useSetRecoilState(loading);

  const navigate = useNavigate();

  // 메시지 리셋
  const messageReset = () => {
    setUsernameMessage("");
    setAuthNumberMessage("");
    setPasswordMessage("");
    setEqualPasswordMessage("");
  };

  // 메일 전송
  const submitMail = async () => {
    messageReset();
    if (!username) {
      setUsernameMessage("이메일을 입력해주세요.");
      return;
    }
    if (!emailRegex(username)) {
      setUsernameMessage("이메일 형식을 입력해주세요.");
      return;
    }

    try {
      setLoadingState(true);
      const response = await authApi.submitMail(username);
      if (response.success) {
        setStartTimer(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // setLoadingState(false);
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
      const response = await authApi.authMail(username, authNumber);
      if (response) {
        setStartTimer(false);
        const usernameInput = document.getElementById(
          "email-input-box"
        ) as HTMLInputElement;
        if (usernameInput) {
          usernameInput.readOnly = true;
        }
        const authEmailInput = document.getElementById(
          "email-auth-input-box"
        ) as HTMLInputElement;
        if (authEmailInput) {
          authEmailInput.readOnly = true;
        }
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

  const signUp = async () => {
    messageReset();
    if (!username || !authNumber || !password || !equalPassword) {
      if (!username) {
        setUsernameMessage("이메일을 입력해주세요.");
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

    if (!emailRegex(username)) {
      setUsernameMessage("올바른 이메일 형식을 입력해주세요.");
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
      setUsernameMessage("이메일 인증이 정상처리되지 않았습니다.");
      setAuthNumberMessage("이메일 인증이 정상처리되지 않았습니다.");
      return;
    }

    try {
      const response = await authApi.signup(
        username,
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
      <div className="auth-container">
        <div className="mention">
          <p>모코코만큼 환영해요 :)</p>
        </div>
        <div className="signup-wrap">
          <InputBox
            type="email"
            placeholder="이메일"
            value={username}
            setValue={setUsername}
            onKeyDown={submitMail}
            message={usernameMessage}
            rightButtonText="전송"
            onRightButtonClick={submitMail}
          />
          <EmailTimer startTimer={startTimer} />
          <InputBox
            type="text"
            placeholder="인증번호 확인 (숫자)"
            value={authNumber}
            setValue={setAuthNumber}
            onKeyDown={authMail}
            message={authNumberMessage}
            rightButtonText="확인"
            onRightButtonClick={authMail}
          />
          <InputBox
            type="password"
            placeholder="비밀번호 (8~20자 영문, 숫자)"
            value={password}
            setValue={setPassword}
            onKeyDown={signUp}
            message={passwordMessage}
          />
          <InputBox
            type="password"
            placeholder="비밀번호 확인"
            value={equalPassword}
            setValue={setEqualPassword}
            onKeyDown={signUp}
            message={equalPasswordMessage}
          />
          <button type="button" className="login-btn" onClick={signUp}>
            회원가입
          </button>
          <div className="link-wrap">
            <Link className="signup" to="/login">
              뒤로가기
            </Link>
          </div>
        </div>
        <div className="bar">또는</div>
        <SocialLoginBtns />
      </div>
    </AuthLayout>
  );
};

export default SignUp;
