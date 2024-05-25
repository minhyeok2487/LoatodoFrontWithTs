import { BASE_URL } from "../Constants";
import api from "./api";

export async function idpwLogin(
  username: string,
  password: string
): Promise<any> {
  const data = {
    username: username,
    password: password,
  };
  return await api.post("/v3/auth/login", data).then((res) => res.data);
}

export function socialLogin(provider: string) {
  const frontendUrl = window.location.protocol + "//" + window.location.host;
  window.location.href =
    BASE_URL + "/auth/authorize/" + provider + "?redirect_url=" + frontendUrl;
}

export async function logout(): Promise<any> {
  return await api.get("/v3/auth/logout").then((res) => res.status);
}

// 이메일 전송
export async function submitMail(mail: string): Promise<any> {
  const data = { mail: mail };
  return await api.post("/v3/mail", data).then((res) => res.status);
}

// 이메일 인증
export async function authMail(mail: string, number: string): Promise<any> {
  const data = { mail: mail, number: number };
  return await api.post("/v3/mail/auth", data).then((res) => res.status);
}

// 1차 회원가입
export async function signup(
  mail: string,
  number: string,
  password: string,
  equalPassword: string
): Promise<any> {
  const data = {
    mail: mail,
    number: number,
    password: password,
    equalPassword: equalPassword,
  };
  return await api.post("/v3/auth/signup", data).then((res) => res.status);
}

// 캐릭터 정보 추가
export async function addCharacters(
  apiKey: string,
  characterName: string,
): Promise<any> {
  const data = {
    apiKey: apiKey,
    characterName: characterName,
  };
  return await api.post("/v3/auth/character", data).then((res) => res.status);
}