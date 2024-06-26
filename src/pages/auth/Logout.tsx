import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { logout } from "@core/apis/auth.api";
import { authAtom } from "@core/atoms/auth.atom";
import useAuthActions from "@core/hooks/useAuthActions";

const Logout = () => {
  const navigate = useNavigate();

  const auth = useRecoilValue(authAtom);

  const { resetAuth } = useAuthActions();

  const handleLogout = async () => {
    try {
      const { success } = await logout();

      if (success) {
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
