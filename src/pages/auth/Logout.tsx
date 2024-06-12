import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { logout } from "@core/apis/Auth.api";
import { useCharacters } from "@core/apis/Character.api";
import { useFriends } from "@core/apis/Friend.api";
import { useMember } from "@core/apis/Member.api";

const Logout = () => {
  const { refetch: refetchMember } = useMember();
  const { refetch: refetchCharacters } = useCharacters();
  const { refetch: refetchFriends } = useFriends();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response === 200) {
        localStorage.removeItem("ACCESS_TOKEN");
        refetchMember();
        refetchCharacters();
        refetchFriends();
        navigate("/");
      }
    } catch (error) {
      console.error("Error Logout", error);
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return <div />;
};

export default Logout;
