import styled from "styled-components";

import Button from "@components/Button";

const ButtonsPage = () => {
  return (
    <Wrapper>
      <Button variant="contained" onClick={() => {}}>
        로아투두
      </Button>
      <Button variant="outlined" onClick={() => {}}>
        로아투두
      </Button>
      <Button variant="text" onClick={() => {}}>
        로아투두
      </Button>
    </Wrapper>
  );
};

export default ButtonsPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 100vh;
`;
