import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

import AuthLayout from "@layouts/AuthLayout";

import useRegisterCharacters from "@core/hooks/mutations/auth/useRegisterCharacters";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import InputBox from "@components/InputBox";

import Box from "./components/Box";
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

  const registerCharacters = useRegisterCharacters({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getMyInformation(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });

      toast.success("캐릭터 등록이 완료되었습니다.");
      navigate("/", { replace: true });
    },
  });

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (registerCharacters.isPending) {
      return;
    }

    messageReset();

    if (validation()) {
      registerCharacters.mutate({ apiKey, characterName: character });
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

          <Button variant="contained" size="large" type="submit" fullWidth>
            캐릭터 정보 추가
          </Button>
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
