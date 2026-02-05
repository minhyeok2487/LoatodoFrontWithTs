import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import * as inspectionApi from "@core/apis/inspection.api";
import { authCheckedAtom } from "@core/atoms/auth.atom";
import { STALE_TIME_MS } from "@core/constants";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

const useInspectionSchedule = () => {
  const authChecked = useAtomValue(authCheckedAtom);

  return useQuery({
    queryKey: queryKeyGenerator.getInspectionSchedule(),
    queryFn: () => inspectionApi.getInspectionSchedule(),
    staleTime: STALE_TIME_MS,
    enabled: authChecked,
  });
};

export default useInspectionSchedule;
