export interface IdPwLoginRequest {
  username: string;
  password: string;
}

export interface IdPwLoginResponse {
  id: string;
  username: string;
  role: string;
  token: string;
}

export interface RequestCertificationEmailRequest {
  mail: string;
}

export interface AuthEmailRequest {
  mail: string;
  number: string;
}

export interface SignupRequest {
  mail: string;
  number: string;
  password: string;
  equalPassword: string;
}

export interface UpdatePasswordRequest {
  mail: string;
  number: string;
  newPassword: string;
}

export interface SignupResponse {
  memberId: string;
  username: string;
  role: string;
  token: string;
}

export interface RegisterCharactersRequest {
  apiKey: string;
  characterName: string;
}
