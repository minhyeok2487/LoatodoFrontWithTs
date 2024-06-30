import styled from "@emotion/styled";
import { LinearProgress } from "@mui/material";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

const LoadingBar = () => {
  const isFetching = useIsFetching();
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
