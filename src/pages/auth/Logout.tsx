import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { authAtom } from "@core/atoms/auth.atom";
import useLogout from "@core/hooks/mutations/auth/useLogout";
import useAuthActions from "@core/hooks/useAuthActions";

const Logout = () => {
  const navigate = useNavigate();

  const auth = useRecoilValue(authAtom);

  const { resetAuth } = useAuthActions();

  const logout = useLogout({
    onSuccess: () => {
      resetAuth();
      navigate("/", { replace: true });
    },
  });

  useEffect(() => {
    if (auth.username) {
      logout.mutate();
    }
  }, [auth.username]);

  return <div />;
};

export default Logout;
