import styled from "@emotion/styled";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import DefaultLayout from "@layouts/DefaultLayout";

import Box from "@pages/auth/components/Box";
import SubmitButton from "@pages/auth/components/SubmitButton";
import UtilLink from "@pages/auth/components/UtilLink";
import Welcome from "@pages/auth/components/Welcome";

import * as memberApi from "@core/apis/Member.api";
import { loading } from "@core/atoms/Loading.atom";

import InputBox from "@components/InputBox";

const ApiKeyUpdateForm = () => {
  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement>(null);
  const characterInputRef = useRef<HTMLInputElement>(null);

  const setLoadingState = useSetRecoilState(loading);

  const [apiKey, setApiKey] = useState("");
  const [apiKeyMessage, setApiKeyMessage] = useState("");

  const [character, setCharacter] = useState("");
  const [characterMessage, setCharacterMessage] = useState("");

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

    messageReset();

    if (validation()) {
      try {
        setLoadingState(true);
        const response = await memberApi.editApikey({
          apiKey,
          characterName: character,
        });

        if (response) {
          alert("API KEY 변경이 완료되었습니다.");
          navigate("/");
        }
      } catch (error) {
        console.error("Error saveSort:", error);
      } finally {
        setLoadingState(false);
      }
    }
  };

  return (
    <DefaultLayout>
      <Box>
        <Welcome>API KEY 업데이트</Welcome>

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

          <SubmitButton>API KEY 업데이트</SubmitButton>
        </Form>

        <UtilRow>
          <UtilLink to="https://repeater2487.tistory.com/190" target="_blank">
            API KEY 발급하는 방법이 궁금해요!
          </UtilLink>
        </UtilRow>
      </Box>
    </DefaultLayout>
  );
};

export default ApiKeyUpdateForm;

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
