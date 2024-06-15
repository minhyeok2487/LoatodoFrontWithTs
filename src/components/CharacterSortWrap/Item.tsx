import React, { forwardRef } from "react";

import { CharacterType } from "@core/types/Character.type";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  withOpacity?: boolean;
  isDragging?: boolean;
  style?: React.CSSProperties;
  character: CharacterType;
}

export const Item = forwardRef<HTMLDivElement, Props>(
  (
    { withOpacity = false, isDragging = false, style, character, ...props },
    ref
  ) => {
    const inlineStyles: React.CSSProperties = {
      opacity: withOpacity ? 0.5 : 1,
      transformOrigin: "50% 50%",
      borderRadius: "5px",
      cursor: isDragging ? "grabbing" : "grab",
      boxShadow: isDragging
        ? "rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px"
        : "rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px",
      backgroundImage:
        character.characterImage !== null
          ? `url(${character.characterImage})`
          : "",
      backgroundPosition:
        character.characterClassName === "도화가" ||
        character.characterClassName === "기상술사"
          ? "left 25px top -70px"
          : "left 25px top -35px",
      backgroundColor: "gray",
      ...style,
    };

    return (
      <div
        className="character-info-mini"
        ref={ref}
        style={inlineStyles}
        {...props}
      >
        <p>{character.characterName}</p>
        <p>Lv. {character.itemLevel}</p>
      </div>
    );
  }
);

Item.displayName = "Item";
