import styled from "@emotion/styled";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import AuthLayout from "@layouts/AuthLayout";

import * as authApi from "@core/apis/auth.api";
import { loading } from "@core/atoms/loading.atom";
import queryKeys from "@core/constants/queryKeys";

import InputBox from "@components/InputBox";

import Box from "./components/Box";
import SubmitButton from "./components/SubmitButton";
import UtilLink from "./components/UtilLink";
import Welcome from "./components/Welcome";

const SignUpCharacters = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement>(null);
  const characterInputRef = useRef<HTMLInputElement>(null);

  const [apiKey, setApiKey] = useState("");
  const [apiKeyMessage, setApiKeyMessage] = useState("");

  const [character, setCharacter] = useState("");
  const [characterMessage, setCharacterMessage] = useState("");

  const [loadingState, setLoadingState] = useRecoilState(loading);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoadingState(true);

    if (loadingState) {
      return;
    }

    messageReset();

    if (validation()) {
      try {
        await authApi.addCharacters({ apiKey, characterName: character });

        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_MY_INFORMATION],
        });
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_CHARACTERS],
        });
        navigate("/");
        alert("완료되었습니다.");
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoadingState(false);
      }
    } else {
      setLoadingState(false);
    }
  };

  return (
    <AuthLayout>
      <Box>
        <Welcome>캐릭터 정보 추가</Welcome>

        <Form ref={formRef} onSubmit={handleSubmit}>
          <InputBox
            type="text"
            placeholder="로스트아크 ApiKey"
            value={apiKey}
            setValue={setApiKey}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                characterInputRef.current?.focus();
              }
            }}
            message={apiKeyMessage}
          />
          <InputBox
            ref={characterInputRef}
            type="text"
            placeholder="대표 캐릭터"
            value={character}
            setValue={setCharacter}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                formRef.current?.requestSubmit();
              }
            }}
            message={characterMessage}
          />

          <SubmitButton>캐릭터 정보 추가</SubmitButton>
        </Form>

        <UtilRow>
          <UtilLink to="/">홈으로</UtilLink>

          <UtilLink
            to="https://developer-lostark.game.onstove.com"
            target="_blank"
          >
            API KEY 발급 받기
          </UtilLink>
        </UtilRow>
      </Box>
    </AuthLayout>
  );
};

export default SignUpCharacters;

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
