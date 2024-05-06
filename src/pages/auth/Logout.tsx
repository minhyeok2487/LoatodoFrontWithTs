import { useNavigate } from "react-router-dom";
import { logout } from "../../core/apis/Auth.api";
import { useEffect } from "react";
import { useFriends } from "../../core/apis/Friend.api";
import { useMember } from "../../core/apis/Member.api";
import { useCharacters } from "../../core/apis/Character.api";

const Logout = () => {
  const { data: member, refetch: refetchMember } = useMember();
  const { data: characters, refetch: refetchCharacters } = useCharacters();
  const { data: friends, refetch: refetchFriends } = useFriends();
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
  return <div></div>;
};

export default Logout;
