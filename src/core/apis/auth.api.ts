import { BASE_URL } from "@core/constants";
import type { MessageResponse } from "@core/types/api";
import type {
  AddCharactersRequest,
  IdPwLoginRequest,
  IdPwLoginResponse,
  MailAuthRequest,
  MailRequest,
  SignupRequest,
  SignupResponse,
} from "@core/types/auth";

import mainAxios from "./mainAxios";

export const idpwLogin = ({
  username,
  password,
}: IdPwLoginRequest): Promise<IdPwLoginResponse> => {
  return mainAxios
    .post("/v3/auth/login", { username, password })
    .then((res) => res.data);
};

export const socialLogin = (provider: string) => {
  const frontendUrl = `${window.location.protocol}//${window.location.host}`;
  window.location.href = `${BASE_URL}/auth/authorize/${provider}?redirect_url=${frontendUrl}`;
};

export const logout = (): Promise<MessageResponse> => {
  return mainAxios.get("/v3/auth/logout").then((res) => res.data);
};

// 인증번호를 이메일로 전송
export const submitMail = ({ mail }: MailRequest): Promise<MessageResponse> => {
  return mainAxios.post("/v3/mail", { mail }).then((res) => res.data);
};

// 인증번호 확인
export const authMail = ({
  mail,
  number,
}: MailAuthRequest): Promise<MessageResponse> => {
  return mainAxios
    .post("/v3/mail/auth", {
      mail,
      number,
    })
    .then((res) => res.data);
};

// 1차 회원가입
export const signup = ({
  mail,
  number,
  password,
  equalPassword,
}: SignupRequest): Promise<SignupResponse> => {
  return mainAxios
    .post("/v4/auth/signup", {
      mail,
      number,
      password,
      equalPassword,
    })
    .then((res) => res.data);
};

// 캐릭터 정보 추가
export const addCharacters = ({
  apiKey,
  characterName,
}: AddCharactersRequest): Promise<IdPwLoginResponse> => {
  return mainAxios
    .post("/v3/auth/character", { apiKey, characterName })
    .then((res) => res.data);
};
