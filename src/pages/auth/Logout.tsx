import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { todoServerAtom } from "@core/atoms/todo.atom";
import useLogout from "@core/hooks/mutations/auth/useLogout";
import useAuthActions from "@core/hooks/useAuthActions";
import useIsGuest from "@core/hooks/useIsGuest";

const Logout = () => {
  const navigate = useNavigate();

  const isGuest = useIsGuest();

  const resetTodoServer = useResetAtom(todoServerAtom);
  const { resetAuth } = useAuthActions();

  const logout = useLogout({
    onSuccess: () => {
      resetAuth();
      navigate("/", { replace: true });
    },
  });

  useEffect(() => {
    if (!isGuest) {
      resetTodoServer();
      logout.mutate();
    }
  }, [isGuest]);

  return <div />;
};

export default Logout;
