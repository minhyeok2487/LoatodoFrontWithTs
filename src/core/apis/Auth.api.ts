import { BASE_URL } from "@core/constants";

import api from "./api";

export const idpwLogin = (username: string, password: string): Promise<any> => {
  const data = {
    username,
    password,
  };
  return api.post("/v3/auth/login", data).then((res) => res.data);
};

export const socialLogin = (provider: string) => {
  const frontendUrl = `${window.location.protocol}//${window.location.host}`;
  window.location.href = `${BASE_URL}/auth/authorize/${provider}?redirect_url=${frontendUrl}`;
};

export const logout = (): Promise<any> => {
  return api.get("/v3/auth/logout").then((res) => res.status);
};

// 이메일 전송
export const submitMail = (mail: string): Promise<any> => {
  const data = { mail };

  return api.post("/v3/mail", data).then((res) => res.status);
};

// 이메일 인증
export const authMail = (mail: string, number: string): Promise<any> => {
  const data = { mail, number };

  return api.post("/v3/mail/auth", data).then((res) => res.status);
};

// 1차 회원가입
export const signup = (
  mail: string,
  number: string,
  password: string,
  equalPassword: string
): Promise<any> => {
  const data = {
    mail,
    number,
    password,
    equalPassword,
  };
  return api.post("/v3/auth/signup", data).then((res) => res.status);
};

// 캐릭터 정보 추가
export const addCharacters = (
  apiKey: string,
  characterName: string
): Promise<any> => {
  const data = {
    apiKey,
    characterName,
  };
  return api.post("/v3/auth/character", data).then((res) => res.status);
};
