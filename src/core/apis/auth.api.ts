import { BASE_URL } from "@core/constants";
import type { NoDataResponse } from "@core/types/api";
import type {
  AuthEmailRequest,
  IdPwLoginRequest,
  IdPwLoginResponse,
  RegisterCharactersRequest,
  RequestPasswordCertificationEmailRequest,
  RequestSignupCertificationEmailRequest,
  SignupRequest,
  SignupResponse,
  UpdatePasswordRequest,
} from "@core/types/auth";

import mainAxios from "./mainAxios";

// 소셜 로그인
export const socialLogin = (provider: string) => {
  const frontendUrl = `${window.location.protocol}//${window.location.host}`;
  window.location.href = `${BASE_URL}/auth/authorize/${provider}?redirect_url=${frontendUrl}`;
};

// 일반 로그인
export const idpwLogin = ({
  username,
  password,
}: IdPwLoginRequest): Promise<IdPwLoginResponse> => {
  return mainAxios
    .post("/v3/auth/login", { username, password })
    .then((res) => res.data);
};

export const logout = (): Promise<NoDataResponse> => {
  return mainAxios.get("/v3/auth/logout");
};

// 회원가입 - 인증번호를 이메일로 전송
export const requestSignupCertificationEmail = ({
  mail,
}: RequestSignupCertificationEmailRequest): Promise<NoDataResponse> => {
  return mainAxios.post("/v3/mail", { mail });
};

// 인증번호 확인
export const authEmail = ({
  mail,
  number,
}: AuthEmailRequest): Promise<NoDataResponse> => {
  return mainAxios.post("/v3/mail/auth", {
    mail,
    number,
  });
};

// 회원가입
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

// 비밀번호 변경 - 인증번호를 이메일로 전송
export const requestPasswordCertificationEmail = ({
  mail,
}: RequestPasswordCertificationEmailRequest): Promise<NoDataResponse> => {
  return mainAxios.post("/v3/mail/password", { mail });
};

// 비밀번호 변경
export const updatePassword = ({
  mail,
  number,
  newPassword,
}: UpdatePasswordRequest): Promise<NoDataResponse> => {
  return mainAxios.post("/v4/auth/password", {
    mail,
    number,
    newPassword,
  });
};

// 캐릭터 정보 추가
export const registerCharacters = ({
  apiKey,
  characterName,
}: RegisterCharactersRequest): Promise<NoDataResponse> => {
  return mainAxios.post("/v3/auth/character", { apiKey, characterName });
};
