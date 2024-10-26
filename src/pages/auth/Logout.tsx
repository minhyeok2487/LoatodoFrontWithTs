import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useLogout from "@core/hooks/mutations/auth/useLogout";
import useAuthActions from "@core/hooks/useAuthActions";
import useIsGuest from "@core/hooks/useIsGuest";

const Logout = () => {
  const navigate = useNavigate();

  const isGuest = useIsGuest();

  const { resetAuth } = useAuthActions();

  const logout = useLogout({
    onSuccess: () => {
      resetAuth();
      navigate("/", { replace: true });
    },
  });

  useEffect(() => {
    if (!isGuest) {
      logout.mutate();
    }
  }, [isGuest]);

  return null;
};

export default Logout;
