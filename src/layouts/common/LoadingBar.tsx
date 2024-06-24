import styled from "@emotion/styled";
import { LinearProgress } from "@mui/material";
import { useRecoilValue } from "recoil";

import { loading } from "@core/atoms/loading.atom";

const LoadingBar = () => {
  const loadingState = useRecoilValue(loading);

  if (!loadingState) {
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
