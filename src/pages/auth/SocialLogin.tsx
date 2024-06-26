import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useAuthActions from "@core/hooks/useAuthActions";

const SocialLogin = () => {
  const location = useLocation();

  const { setAuth } = useAuthActions();

  const getUrlParameter = (name: string): string | null => {
    const { search } = location;
    const params = new URLSearchParams(search);

    return params.get(name);
  };

  const token = getUrlParameter("token");
  const username = getUrlParameter("username");

  const navigate = useNavigate();

  useEffect(() => {
    if (token && username) {
      setAuth({
        token,
        username,
      });
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  return <div />;
};

export default SocialLogin;
