import { MdKeyboardArrowDown } from "@react-icons/all-files/md/MdKeyboardArrowDown";
import type { Dispatch, SetStateAction } from "react";
import { useMemo } from "react";
import styled from "styled-components";

import type { FAQItem } from "@core/types/faq";

interface Props extends FAQItem {
  setOpenId: Dispatch<SetStateAction<null | number>>;
  isOpen: boolean;
  id: number;
}

const FaqItem = ({
  setOpenId,
  isOpen,
  id,
  title,
  description,
  label,
}: Props) => {
  const hasLabel = useMemo(() => !!label, [label]);
  const labelText = useMemo(() => {
    if (hasLabel) {
      return label === "DEBUG" ? "버그 수정 중" : "개발 중";
    }

    return "";
  }, [label]);

  return (
    <Wrapper $isOpen={isOpen}>
      <Header $isOpen={isOpen} onClick={() => setOpenId(isOpen ? null : id)}>
        <TitleRow>
          <DefaultLabel>Q</DefaultLabel>
          <p>{title}</p>
        </TitleRow>

        <MdKeyboardArrowDown />
      </Header>
      <Body $isOpen={isOpen}>
        {hasLabel ? (
          <Label $type={label}>{labelText}</Label>
        ) : (
          <DefaultLabel>A</DefaultLabel>
        )}

        <p dangerouslySetInnerHTML={{ __html: description }} />
      </Body>
    </Wrapper>
  );
};

export default FaqItem;

const Wrapper = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid
    ${({ $isOpen, theme }) =>
      $isOpen ? theme.app.text.main : theme.app.border};
  box-shadow: ${({ $isOpen }) =>
    $isOpen ? "0 0 10px rgba(0, 0, 0, 0.1)" : "unset"};
  background: ${({ theme }) => theme.app.bg.light};
  border-radius: 16px;
`;

const Header = styled.button<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px;
  width: 100%;

  svg {
    color: ${({ theme }) => theme.app.text.main};
    font-size: 28px;
    transform: rotate(${({ $isOpen }) => ($isOpen ? 180 : 0)}deg);
  }
`;

const DefaultLabel = styled.i`
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.black};

  ${({ theme }) => theme.medias.max900} {
    font-size: 18px;
  }
`;

const Label = styled.span<{ $type: FAQItem["label"] }>`
  padding: 7px 5px;
  font-size: 14px;
  line-height: 1;
  border-radius: 6px;
  color: ${({ theme }) => theme.app.black};
  background: ${({ $type, theme }) =>
    $type === "DEBUG" ? theme.app.palette.red[0] : theme.app.palette.blue[0]};
`;

const TitleRow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 15px;

  p {
    flex: 1;
    color: ${({ theme }) => theme.app.text.main};
    font-size: 16px;
    line-height: 28px;
    font-weight: 400;
    text-align: left;

    ${({ theme }) => theme.medias.max900} {
      font-size: 14px;
    }
  }
`;

const Body = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0 24px;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  max-height: ${({ $isOpen }) => ($isOpen ? 1000 : 0)}px;
  overflow: hidden;
  border-top: 1px solid
    ${({ $isOpen, theme }) => ($isOpen ? theme.app.border : "transparent")};
  gap: 15px;
  transition: all 0.2s ease-out;

  ${DefaultLabel}, ${Label} {
    margin-top: 20px;
  }

  p {
    flex: 1;
    color: ${({ theme }) => theme.app.text.light1};
    font-weight: 400;
    word-break: keep-all;
    line-height: 28px;
    text-align: left;
    margin: 20px 0 24px;

    ${({ theme }) => theme.medias.max900} {
      font-size: 14px;
    }

    strong {
      color: ${({ theme }) => theme.app.text.dark2};
      font-weight: 600;
    }
  }
`;
