import styled from "@emotion/styled";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import Button from "@components/Button";

interface ButtonItem {
  label: string;
  onClick(): void;
}

interface Props {
  title: ReactNode;
  buttons?: ButtonItem[];
  children: ReactNode;
  isOpen?: boolean;
  onClose(): void;
}

const Modal = ({
  title,
  buttons = [],
  children,
  isOpen = false,
  onClose,
}: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const handleKeyDownWrapper = (event: KeyboardEvent) => {
      if (event.code === "Escape" && isOpen) {
        onClose();
      }
    };

    if (dialogRef.current) {
      const handleExternalClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        if (
          rect.left > event.clientX ||
          rect.right < event.clientX ||
          rect.top > event.clientY ||
          rect.bottom < event.clientY
        ) {
          onClose();
        }
      };

      if (isOpen) {
        dialogRef.current.showModal();
        dialogRef.current.addEventListener("click", handleExternalClick);
        document.addEventListener("keydown", handleKeyDownWrapper);
      } else {
        dialogRef.current.close();
        dialogRef.current.removeEventListener("click", handleExternalClick);
        document.removeEventListener("keydown", handleKeyDownWrapper);
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDownWrapper);
    };
  }, [isOpen]);

  return (
    <Wrapper ref={dialogRef}>
      <Title>{title}</Title>
      <Description>{children}</Description>
      {buttons.length > 0 && (
        <Buttons>
          {buttons.map((item) => (
            <Button key={item.label} onClick={item.onClick}>
              {item.label}
            </Button>
          ))}
        </Buttons>
      )}
    </Wrapper>
  );
};

export default Modal;

const Wrapper = styled.dialog`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 24px 32px;
  min-width: 300px;
  max-height: 500px;
  border-radius: 16px;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme.app.bg.light};
  color: ${({ theme }) => theme.app.text.main};
`;

const Title = styled.span`
  display: block;
  margin-bottom: 16px;
  width: 100%;
  color: ${({ theme }) => theme.app.text.dark2};
  font-size: 22px;
  font-weight: 700;
  text-align: center;
`;

const Description = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 2;

  .button-wrap {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
`;

const Buttons = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
