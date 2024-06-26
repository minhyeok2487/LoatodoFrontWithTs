import { useResetRecoilState, useSetRecoilState } from "recoil";

import { authAtom } from "@core/atoms/auth.atom";

const useAuthActions = () => {
  const innerSetAuth = useSetRecoilState(authAtom);
  const innerSesetAuth = useResetRecoilState(authAtom);

  const setAuth = ({
    username,
    token,
  }: {
    username: string;
    token: string;
  }) => {
    localStorage.setItem("ACCESS_TOKEN", token);
    innerSetAuth({
      token,
      username,
    });
  };

  const resetAuth = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    innerSesetAuth();
  };

  return { setAuth, resetAuth };
};

export default useAuthActions;
