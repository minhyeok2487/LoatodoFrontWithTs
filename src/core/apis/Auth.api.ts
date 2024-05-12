import { PROD_URL } from "../Constants";
import api from "./api";

export async function idpwLogin(
  username: string,
  password: string
): Promise<any> {
  return await api
    .get('/v3/auth/login')
    .then((res) => res.data);
}

export function socialLogin(
  provider: string
  ) {
    const frontendUrl = window.location.protocol + "//" + window.location.host;
    window.location.href = PROD_URL + "/auth/authorize/" + provider + "?redirect_url=" + frontendUrl;
}

export async function logout() : Promise<any> {
  return await api
    .get('/v3/auth/logout')
    .then((res) => res.status);
}
