import { CharacterType } from "./character";

export interface IdPwLoginRequest {
  username: string;
  password: string;
}

export interface IdPwLoginResponse {
  characters: CharacterType[];
  id: string;
  username: string;
  role: string;
  token: string;
}

export interface MailRequest {
  mail: string;
}

export interface MailAuthRequest {
  mail: string;
  number: string;
}

export interface SignupRequest {
  mail: string;
  number: string;
  password: string;
  equalPassword: string;
}

export interface AddCharactersRequest {
  apiKey: string;
  characterName: string;
}
