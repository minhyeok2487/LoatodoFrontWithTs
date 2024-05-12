import { Navigate, useLocation } from "react-router-dom";

const SocialLogin = () => {
  const location = useLocation();

  const getUrlParameter = (name: string): string | null => {
    let search = location.search;
    let params = new URLSearchParams(search);
    return params.get(name);
  };

  const token = getUrlParameter("token");

  if (token) {
    localStorage.setItem("ACCESS_TOKEN", token);
    return (
      <Navigate
        to={{
          pathname: "/"
        }}
      />
    );
  } else {
    return (
      <Navigate
        to={{
          pathname: "/login"
        }}
      />
    );
  }
};

export default SocialLogin;
