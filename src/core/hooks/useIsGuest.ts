import { useAtomValue } from "jotai";

import { authAtom } from "@core/atoms/auth.atom";

export default () => {
  const auth = useAtomValue(authAtom);

  return !auth.username;
};
