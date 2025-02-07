import { useAtom } from "jotai";
import type { ReactNode } from "react";
import styled from "styled-components";

import { showWideAtom } from "@core/atoms/todo.atom";

interface Props {
  children: ReactNode;
}

const WideWrapper = ({ children }: Props) => {
  const [showWide, setShowWide] = useAtom(showWideAtom);

  return <StyledWrapper $showWide={showWide}>{children}</StyledWrapper>;
};

export default WideWrapper;

const StyledWrapper = styled.div<{ $showWide: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 60px auto 0;
  padding: 20px 0;
  width: 100%;
  max-width: ${({ $showWide }) => ($showWide ? "1880px" : "1280px")};
  height: 100%;
  color: ${({ theme }) => theme.app.text.dark1};

  ${({ theme }) => theme.medias.max1880} {
    padding: 20px 16px;
  }

  ${({ theme }) => theme.medias.max1280} {
    padding: 20px 16px;
  }

  ${({ theme }) => theme.medias.max600} {
    padding: 10px 12px;
  }
`;
