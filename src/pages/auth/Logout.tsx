import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useResetRecoilState } from "recoil";

import { logout } from "@core/apis/auth.api";
import { useCharacters } from "@core/apis/character.api";
import { useMember } from "@core/apis/member.api";
import { authAtom } from "@core/atoms/auth.atom";
import useFriends from "@core/hooks/queries/useFriends";

const Logout = () => {
  const queryClient = useQueryClient();

  const { refetch: refetchMember } = useMember();
  const { refetch: refetchCharacters } = useCharacters();
  const { getFriendsQueryKey } = useFriends();
  const navigate = useNavigate();
  const resetAuth = useResetRecoilState(authAtom);

  const handleLogout = async () => {
    try {
      const { success } = await logout();

      if (success) {
        localStorage.removeItem("ACCESS_TOKEN");
        refetchMember();
        refetchCharacters();
        queryClient.invalidateQueries({
          queryKey: getFriendsQueryKey,
        });
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
