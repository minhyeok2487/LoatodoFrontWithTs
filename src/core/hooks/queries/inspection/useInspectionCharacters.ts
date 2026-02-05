import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import * as inspectionApi from "@core/apis/inspection.api";
import { authCheckedAtom } from "@core/atoms/auth.atom";
import { STALE_TIME_MS } from "@core/constants";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

const useInspectionCharacters = () => {
  const authChecked = useAtomValue(authCheckedAtom);

  return useQuery({
    queryKey: queryKeyGenerator.getInspectionCharacters(),
    queryFn: () => inspectionApi.getInspectionCharacters(),
    staleTime: STALE_TIME_MS,
    enabled: authChecked,
  });
};

export default useInspectionCharacters;
