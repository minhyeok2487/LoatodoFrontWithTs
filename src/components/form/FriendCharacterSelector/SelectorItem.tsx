import { MdClose } from "@react-icons/all-files/md/MdClose";
import { RiHeartPulseFill } from "@react-icons/all-files/ri/RiHeartPulseFill";
import styled, { css } from "styled-components";

import useIsBelowWidth from "@core/hooks/useIsBelowWidth";
import type { Friend } from "@core/types/friend";
import type { ScheduleCharacter } from "@core/types/schedule";
import { getIsDealer } from "@core/utils/character.util";

import PiSword from "@assets/svg/PiSword";

interface Props {
  friend?: Friend;
  character?: ScheduleCharacter;
  onClick?: () => void;
  disabled?: boolean;
  forMobile?: boolean;
  isAddButton?: boolean;
}

const SelectorItem = ({
  friend,
  character,
  onClick,
  disabled,
  forMobile,
  isAddButton,
}: Props) => {
  const isBelowWidth500 = useIsBelowWidth(500);
  const onlyFriend = !!friend && !character;
  const useCharacter = !!character;

  return (
    <Wrapper $forMobile={forMobile} $isAddButton={isAddButton}>
      <button type="button" onClick={onClick} disabled={disabled}>
        {(() => {
          if (onlyFriend) {
            return <span>{friend.nickName}</span>;
          }

          if (useCharacter) {
            return (
              <>
                <div>
                  {getIsDealer(character.characterClassName) ? (
                    <PiSword />
                  ) : (
                    <RiHeartPulseFill />
                  )}{" "}
                  <span>
                    {friend?.nickName ? `${friend.nickName} - ` : ""}[
                    {character.itemLevel} {character.characterClassName}]
                  </span>
                </div>{" "}
                <span>{character.characterName}</span>
              </>
            );
          }

          return null;
        })()}

        {!disabled && (
          <Icon>
            <MdClose />
          </Icon>
        )}
      </button>
      {isBelowWidth500 && !disabled && (
        <ForMobileButton onClick={onClick}>추가하기</ForMobileButton>
      )}
    </Wrapper>
  );
};

export default SelectorItem;

const ForMobileButton = styled.button`
  z-index: 1;
  position: absolute;
  left: 0;
  bottom: 0;
  padding-top: 10px;
  width: 100%;
  height: 30px;
  background: ${({ theme }) => theme.app.bg.gray2};
  border-radius: 0 0 15px 15px;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
`;

const Icon = styled.i`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 10px;
  background: ${({ theme }) => theme.app.bg.gray2};
  color: ${({ theme }) => theme.app.text.light2};
`;

const Wrapper = styled.li<{ $forMobile?: boolean; $isAddButton?: boolean }>`
  position: relative;
  ${({ theme }) => theme.medias.max500} {
    width: ${({ $forMobile }) => ($forMobile ? "100%" : "unset")};
  }

  button:not(${ForMobileButton}) {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: ${({ theme }) => theme.app.bg.gray1};
    border-radius: 15px;
    line-height: 1;

    ${({ theme }) => theme.medias.max500} {
      flex-direction: column;
      width: 100%;

      ${({ $forMobile }) => css`
        margin-bottom: 20px;
      `}

      ${Icon} {
        display: ${({ $forMobile }) => ($forMobile ? "none" : "flex")};
      }
    }

    div {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 6px;
    }

    div > svg {
      width: 21px;
      height: 21px;
    }

    span {
      color: ${({ theme }) => theme.app.text.dark1};
      font-size: 15px;
    }

    ${Icon} {
      transform: rotate(${({ $isAddButton }) => ($isAddButton ? 45 : 0)}deg);
    }
  }
`;
