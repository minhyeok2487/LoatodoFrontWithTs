import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import Box from "@pages/auth/components/Box";
import UtilLink from "@pages/auth/components/UtilLink";
import Welcome from "@pages/auth/components/Welcome";

import useUpdateApiKey from "@core/hooks/mutations/member/useUpdateApiKey";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import InputBox from "@components/InputBox";

const ApiKeyUpdateForm = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement>(null);
  const characterInputRef = useRef<HTMLInputElement>(null);

  const [apiKey, setApiKey] = useState("");
  const [apiKeyMessage, setApiKeyMessage] = useState("");

  const updateApiKey = useUpdateApiKey({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getMyInformation(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });

      toast.success("API KEY 변경이 완료되었습니다.");
      navigate("/", { replace: true });
    },
  });

  // 메시지 리셋
  const messageReset = () => {
    setApiKeyMessage("");
  };

  // 유효성 검사
  const validation = (): boolean => {
    let isValid = true;

    if (!apiKey) {
      isValid = false;

      if (!apiKey) {
        setApiKeyMessage("ApiKey를 입력해주세요.");
      }
    }

    return isValid;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    messageReset();

    if (validation()) {
      updateApiKey.mutate({
        apiKey,
      });
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

          <Button variant="contained" size="large" type="submit" fullWidth>
            API KEY 업데이트
          </Button>
        </Form>

        <UtilRow>
          <UtilLink to="https://repeater2487.tistory.com/190" target="_blank">
            API KEY 발급하는 방법이 궁금해요!
          </UtilLink>
          <UtilLink
            to="https://developer-lostark.game.onstove.com"
            target="_blank"
          >
            API KEY 발급 받기
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
  gap: 20px;
  margin-top: 10px;
`;
