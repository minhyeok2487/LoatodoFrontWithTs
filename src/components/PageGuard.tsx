import { useAtomValue } from "jotai";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { authCheckedAtom } from "@core/atoms/auth.atom";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useIsGuest from "@core/hooks/useIsGuest";
import type { PageGuardRules } from "@core/types/app";

interface Props {
  rules?: PageGuardRules[];
  children: ReactNode;
}

const NeedLogin = ({ rules, children }: Props) => {
  const navigate = useNavigate();
  const isGuest = useIsGuest();
  const authChecked = useAtomValue(authCheckedAtom);
  const getCharacters = useCharacters();

  useEffect(() => {
    if (rules) {
      if (authChecked && getCharacters.data) {
        if (rules.includes("ONLY_AUTH_USER")) {
          if (isGuest) {
            toast.warn("로그인 후에 이용 가능합니다.");
            navigate("/login", { replace: true });
          } else if (rules.includes("ONLY_NO_CHARACTERS_USER")) {
            if (getCharacters.data.length > 0) {
              toast.warn("이미 캐릭터를 등록하셨습니다.");
              navigate("/", { replace: true });
            }
          } else if (rules.includes("ONLY_CHARACTERS_REGISTERED_USER")) {
            if (getCharacters.data.length === 0) {
              toast.warn("캐릭터 등록 후 이용해주세요.");
              navigate("/", { replace: true });
            }
          }
        }

        if (rules.includes("ONLY_GUEST")) {
          if (!isGuest) {
            navigate("/", { replace: true });
          }
        }
      }
    }
  }, [authChecked, getCharacters.data]);

  return <>{children}</>;
};

export default NeedLogin;
