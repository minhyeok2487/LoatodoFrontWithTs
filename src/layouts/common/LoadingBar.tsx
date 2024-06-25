import styled from "@emotion/styled";
import { LinearProgress } from "@mui/material";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";

import { loading } from "@core/atoms/loading.atom";

const LoadingBar = () => {
  const loadingState = useRecoilValue(loading);
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  if (!loadingState && !isFetching && !isMutating) {
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
