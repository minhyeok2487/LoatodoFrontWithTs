import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import AuthLayout from "@layouts/AuthLayout";

import * as authApi from "@core/apis/Auth.api";
import { useCharacters } from "@core/apis/Character.api";
import { loading } from "@core/atoms/Loading.atom";

import InputBox from "@components/InputBox";

const SignUpCharacters = () => {
  const { refetch: refetchCharacters } = useCharacters();
  const [apiKey, setApiKey] = useState<string>("");
  const [apiKeyMessage, setApiKeyMessage] = useState<string>("");
  const [character, setCharacter] = useState<string>("");
  const [characterMessage, setCharacterMessage] = useState<string>("");
  const setLoadingState = useSetRecoilState(loading);

  const navigate = useNavigate();

  // 메시지 리셋
  const messageReset = () => {
    setApiKeyMessage("");
    setCharacterMessage("");
  };

  // 유효성 검사
  const validation = (): boolean => {
    let isValid = true;
    if (!apiKey || !character) {
      isValid = false;
      if (!apiKey) {
        setApiKeyMessage("ApiKey를 입력해주세요.");
      }
      if (!character) {
        setCharacterMessage("대표캐릭터를 입력해주세요.");
      }
    }
    return isValid;
  };

  const addCharacter = async () => {
    messageReset();
    if (!validation()) {
      return;
    }
    try {
      setLoadingState(true);
      await authApi.addCharacters(apiKey, character);
      refetchCharacters();
      alert("완료되었습니다.");
      navigate("/");
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-container">
        <div className="mention">
          <p>캐릭터 정보 추가</p>
        </div>
        <div className="signup-wrap">
          <InputBox
            className="apikey"
            type="text"
            id="apikey-input-box"
            placeholder="로스트아크 ApiKey"
            value={apiKey}
            setValue={setApiKey}
            onKeyPress={addCharacter}
            message={apiKeyMessage}
          />
          <InputBox
            className="character"
            type="text"
            id="character-input-box"
            placeholder="대표 캐릭터"
            value={character}
            setValue={setCharacter}
            onKeyPress={addCharacter}
            message={characterMessage}
          />
          <button type="button" className="login-btn" onClick={addCharacter}>
            캐릭터 정보 추가
          </button>
          <div className="link-wrap">
            <Link className="signup" to="/">
              홈으로
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUpCharacters;
