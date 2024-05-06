import { useNavigate } from "react-router-dom";
import { logout } from "../../core/apis/Auth.api";
import { useEffect } from "react";

const Logout = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response === 200) {
        localStorage.removeItem("ACCESS_TOKEN");
        navigate("/");
      }
    } catch (error) {
      console.error("Error Logout", error);
    }
  };

  useEffect(()=>{
    handleLogout();
  },[]);
  return <div></div>;
};

export default Logout;
