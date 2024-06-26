import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";

import { logout } from "@core/apis/auth.api";
import { authAtom } from "@core/atoms/auth.atom";
import queryKeys from "@core/constants/queryKeys";

const Logout = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const resetAuth = useResetRecoilState(authAtom);
  const auth = useRecoilValue(authAtom);

  const handleLogout = async () => {
    try {
      const { success } = await logout();

      if (success) {
        localStorage.removeItem("ACCESS_TOKEN");

        resetAuth();
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Error Logout", error);
    }
  };

  useEffect(() => {
    if (auth.username) {
      handleLogout();
    }
  }, [auth.username]);

  return <div />;
};

export default Logout;
