import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import { authAtom } from "@core/atoms/auth.atom";

const SocialLogin = () => {
  const setAuth = useSetRecoilState(authAtom);
  const location = useLocation();

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
      localStorage.setItem("ACCESS_TOKEN", token);
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
