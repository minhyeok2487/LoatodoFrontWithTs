import { LinearProgress } from "@mui/material";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import styled from "styled-components";

import queryKeyGenerator from "@core/utils/queryKeyGenerator";

const LoadingBar = () => {
  const isFetching = useIsFetching({
    predicate: (query) => {
      return ![
        queryKeyGenerator.getNotifications()[0],
        queryKeyGenerator.getNotificationStatus()[0],
      ].includes(query.queryKey[0]);
    },
  });
  const isMutating = useIsMutating();

  if (!isFetching && !isMutating) {
    return null;
  }
  return (
    <Wrapper>
      <LinearProgress color="success" style={{ height: 7 }} />
    </Wrapper>
  );
};

export default LoadingBar;

const Wrapper = styled.div`
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
`;
