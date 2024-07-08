import React, { forwardRef } from "react";
import styled from "styled-components";

import { Character } from "@core/types/character";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  withOpacity?: boolean;
  isDragging?: boolean;
  style?: React.CSSProperties;
  character: Character;
}

const Item = forwardRef<HTMLDivElement, Props>(
  (
    { withOpacity = false, isDragging = false, style, character, ...props },
    ref
  ) => {
    return (
      <Wrapper
        ref={ref}
        style={style}
        $isDragging={isDragging}
        $withOpacity={withOpacity}
        $character={character}
        {...props}
      >
        <Text>{character.characterName}</Text>
        <Text>Lv. {character.itemLevel}</Text>
      </Wrapper>
    );
  }
);

Item.displayName = "Item";

export default Item;

const Wrapper = styled.div<{
  $character: Character;
  $isDragging: boolean;
  $withOpacity: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 10px;
  height: 70px;
  color: ${({ theme }) => theme.app.white};
  background-size: 120%;
  transform-origin: 50% 50%;
  border-radius: 5px;
  opacity: ${({ $withOpacity }) => ($withOpacity ? 0.5 : 1)};
  cursor: ${({ $isDragging }) => ($isDragging ? "grabbing" : "grab")};
  box-shadow: ${({ $isDragging }) =>
    $isDragging
      ? "rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px"
      : "rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px"};
  background-image: ${({ $character }) =>
    $character?.characterImage ? `url(${$character.characterImage})` : "none"};
  background-color: gray;
  background-position: ${({ $character }) =>
    $character.characterClassName === "도화가" ||
    $character.characterClassName === "기상술사"
      ? "left 25px top -70px"
      : "left 25px top -35px"};
`;

const Text = styled.span`
  color: ${({ theme }) => theme.app.white};
  font-size: 14px;
`;
