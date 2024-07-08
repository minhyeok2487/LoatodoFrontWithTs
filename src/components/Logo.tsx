import { FC } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import LogoBlack from "@assets/images/logo_black.png";
import LogoWhite from "@assets/images/logo_white.png";

interface Props {
  isDarkMode: boolean;
}

const Logo: FC<Props> = ({ isDarkMode }) => {
  return (
    <Wrapper to="/">
      <h1>
        {isDarkMode ? (
          <Image alt="로아 투두" src={LogoWhite} />
        ) : (
          <Image alt="로아 투두" src={LogoBlack} />
        )}
      </h1>
    </Wrapper>
  );
};

export default Logo;

export const Wrapper = styled(Link)``;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
