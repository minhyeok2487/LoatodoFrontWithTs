import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import useAuthActions from "@core/hooks/useAuthActions";

const SocialLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { setAuth } = useAuthActions();

  const getUrlParameter = (name: string): string | null => {
    return searchParams.get(name);
  };

  useEffect(() => {
    const token = getUrlParameter("token");
    const username = getUrlParameter("username");

    if (token && username) {
      setAuth({
        token,
        username,
      });

      navigate("/");
    } else {
      navigate("/login");
    }
  }, []);

  return <div />;
};

export default SocialLogin;
