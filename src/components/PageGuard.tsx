import type { ReactNode } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";

import { authAtom, authCheckedAtom } from "@core/atoms/auth.atom";
import useMyInformation from "@core/hooks/queries/useMyInformation";
import type { PageGuardRules } from "@core/types/app";

interface Props {
  rules?: PageGuardRules[];
  children: ReactNode;
}

const NeedLogin = ({ rules, children }: Props) => {
  const navigate = useNavigate();
  const auth = useRecoilValue(authAtom);
  const authChecked = useRecoilValue(authCheckedAtom);
  const { getMyInformation } = useMyInformation();

  useEffect(() => {
    if (rules) {
      if (authChecked && !getMyInformation.isFetching) {
        if (rules.includes("ONLY_AUTH_USER")) {
          if (!auth.username) {
            toast.warn("로그인 후에 이용 가능합니다.");
            navigate("/login", { replace: true });
          } else if (rules.includes("ONLY_NO_CHARACTERS_USER")) {
            if (getMyInformation.data?.mainCharacter.characterName) {
              toast.warn("이미 캐릭터를 등록하셨습니다.");
              navigate("/", { replace: true });
            }
          } else if (rules.includes("ONLY_CHARACTERS_REGISTERED_USER")) {
            if (!getMyInformation.data?.mainCharacter.characterName) {
              toast.warn("캐릭터 등록 후 이용해주세요.");
              navigate("/", { replace: true });
            }
          }
        }

        if (rules.includes("ONLY_GUEST")) {
          if (auth.username) {
            navigate("/", { replace: true });
          }
        }
      }
    }
  }, [authChecked, getMyInformation.isFetching]);

  return <>{children}</>;
};

export default NeedLogin;
