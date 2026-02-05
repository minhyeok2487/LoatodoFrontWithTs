import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import * as inspectionApi from "@core/apis/inspection.api";
import { authCheckedAtom } from "@core/atoms/auth.atom";
import { STALE_TIME_MS } from "@core/constants";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

const useInspectionDetail = (
  inspectionCharacterId: number,
  startDate?: string,
  endDate?: string
) => {
  const authChecked = useAtomValue(authCheckedAtom);

  return useQuery({
    queryKey: queryKeyGenerator.getInspectionDetail({
      id: inspectionCharacterId,
      startDate,
      endDate,
    }),
    queryFn: () =>
      inspectionApi.getInspectionCharacterDetail(
        inspectionCharacterId,
        startDate,
        endDate
      ),
    staleTime: STALE_TIME_MS,
    enabled: authChecked && !!inspectionCharacterId,
  });
};

export default useInspectionDetail;
