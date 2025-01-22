import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";

import { authAtom, isAccountChangedAtom } from "@core/atoms/auth.atom";
import { LOCAL_STORAGE_KEYS } from "@core/constants";

export default () => {
  const setIsAccountChanged = useSetAtom(isAccountChangedAtom);
  const innerSetAuth = useSetAtom(authAtom);
  const innerResetAuth = useResetAtom(authAtom);

  const setAuth = ({
    username,
    token,
    adsDate = null,
  }: {
    username: string;
    token: string;
    adsDate: null | string;
  }) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, token);
    setIsAccountChanged(true);
    innerSetAuth({
      token,
      username,
      adsDate,
    });
  };

  const resetAuth = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
    setIsAccountChanged(true);
    innerResetAuth();
  };

  return { setAuth, resetAuth };
};
