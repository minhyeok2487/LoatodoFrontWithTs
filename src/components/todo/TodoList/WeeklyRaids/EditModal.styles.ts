import styled from "styled-components";

import type { WeekContentCategory } from "@core/types/lostark";

import Button from "@components/Button";

export const ModalButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 6px;
  padding: 0 16px;

  button {
    box-shadow: none;
    background: ${({ theme }) => theme.app.bg.white};
    border: 1px solid ${({ theme }) => theme.app.border};
    color: ${({ theme }) => theme.app.text.main};
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;

    &:hover {
      box-shadow: none;
      background: ${({ theme }) => theme.app.bg.main};
    }
  }

  ${({ theme }) => theme.medias.max500} {
    flex-direction: column;
    padding: 0;
  }
`;

export const ContentWrapper = styled.div`
  border-top: 1px dashed ${({ theme }) => theme.app.border};
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 14px;
  padding-top: 14px;
  font-size: 16px;
  p {
    font-weight: 600;
  }
`;

export const CategoryRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  line-height: 1;
`;

export const GetGoldButton = styled.button<{ $isActive?: boolean }>`
  position: relative;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  color: ${({ theme }) => theme.app.palette.gray[700]};
  overflow: hidden;
  padding: 5px 6px;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.app.palette.yellow[350] : theme.app.palette.gray[150]};
`;

export const Difficulty = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const GatewayButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  background: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 10px;

  & > button {
    flex: 1;
    padding: 8px 0;
  }
`;

export const GatewayHeadButton = styled.button<{
  $isActive?: boolean;
  $difficulty: WeekContentCategory;
}>`
  z-index: ${({ $isActive }) => ($isActive ? 1 : "unset")};
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.app.bg.white : theme.app.bg.gray1};
  color: ${({ theme }) => theme.app.text.light2};
  border: 1px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.app.text.main : theme.app.bg.gray1};
  border-radius: 10px;

  p {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;

    strong {
      font-size: 14px;
      font-weight: ${({ $isActive }) => ($isActive ? 600 : "unset")};
      color: ${({ $difficulty, theme }) =>
        (() => {
          switch ($difficulty) {
            case "하드":
              return theme.app.text.red;
            case "노말":
              return theme.app.text.blue;
            case "나이트메어":
              return theme.app.text.purple;
            default:
              return theme.app.text.main;
          }
        })()};
    }
  }
`;

export const GatewayButton = styled.button<{ $isActive?: boolean }>`
  z-index: ${({ $isActive }) => ($isActive ? 1 : "unset")};
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.app.bg.white : theme.app.bg.gray1};
  border: 1px solid
    ${({ $isActive, theme }) =>
      $isActive ? theme.app.text.main : theme.app.bg.gray1};
  box-shadow: ${({ $isActive }) =>
    $isActive ? "0 0 10px rgba(0, 0, 0, 0.1)" : "unset"};

  color: ${({ theme }) => theme.app.text.light2};
  border-radius: 10px;

  p {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;

    strong {
      font-size: 14px;
      font-weight: ${({ $isActive }) => ($isActive ? 600 : "unset")};
      color: ${({ $isActive, theme }) =>
        $isActive ? theme.app.text.dark1 : theme.app.text.dark2};
    }
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CategoryTitle = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-left: 3px;
`;

export const BusGoldContainer = styled.p`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const BusFeeTitle = styled.p`
  font-size: 14px;
  display: inline-block;
  background: ${({ theme }) => theme.app.palette.yellow[300]};
  padding: 2px 4px;
  border-radius: 4px;
  align-item: center;
  margin-right: 3px;
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledInput = styled.input`
  padding: 1px 4px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 4px;
  font-size: 15px;
  width: 100px;
  color: ${({ theme }) => theme.app.text.black};
  background: ${({ theme }) => theme.app.bg.gray1};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.app.border};
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledButton = styled(Button)`
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 4px;
`;

export const GoldText = styled.p`
  font-size: 16px;
  margin: 0;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.main};
  cursor: pointer;

  label {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
  }

  input[type="checkbox"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid ${({ theme }) => theme.app.border};
    border-radius: 4px;
    background: ${({ theme }) => theme.app.bg.white};
    cursor: pointer;
    position: relative;
    transition: all 0.2s;

    &:checked {
      background: ${({ theme }) => theme.app.palette.yellow[300]};
      border-color: ${({ theme }) => theme.app.palette.yellow[300]};

      &::after {
        content: "✓";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: ${({ theme }) => theme.app.text.black};
        font-size: 12px;
        font-weight: bold;
      }
    }

    &:hover {
      border-color: ${({ theme }) => theme.app.palette.yellow[300]};
    }
  }
`;

export const GoldDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
`;

export const CharacterGoldBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.app.text.black};
  font-size: 10px;
  font-weight: 700;
  padding: 2px 4px;
  border-radius: 6px;
  min-width: 20px;
  line-height: 1;
  border: 1px solid ${({ theme }) => theme.app.palette.yellow[450]};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;
