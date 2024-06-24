import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useResetRecoilState } from "recoil";

import { logout } from "@core/apis/auth.api";
import { useCharacters } from "@core/apis/character.api";
import { useFriends } from "@core/apis/friend.api";
import { useMember } from "@core/apis/member.api";
import { authAtom } from "@core/atoms/auth.atom";

const Logout = () => {
  const { refetch: refetchMember } = useMember();
  const { refetch: refetchCharacters } = useCharacters();
  const { refetch: refetchFriends } = useFriends();
  const navigate = useNavigate();
  const resetAuth = useResetRecoilState(authAtom);

  const handleLogout = async () => {
    try {
      const { success } = await logout();

      if (success) {
        localStorage.removeItem("ACCESS_TOKEN");
        refetchMember();
        refetchCharacters();
        refetchFriends();
        resetAuth();
        navigate("/", { replace: true });
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
