import React, { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import styled from "styled-components";

interface InputBoxProps {
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  message?: string;
  successMessage?: string;
  disabled?: boolean;
  required?: boolean;
  rightButtonText?: string;
  onRightButtonClick?: () => void;
}

const InputBox = forwardRef<HTMLInputElement, InputBoxProps>(
  (
    {
      type,
      placeholder,
      value,
      setValue,
      onKeyDown,
      message,
      successMessage,
      disabled,
      required,
      rightButtonText,
      onRightButtonClick,
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();

        onKeyDown && onKeyDown(e);
      }
    };

    return (
      <Wrapper>
        <InputRow>
          <Input
            ref={ref}
            $hasMessage={!!message}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            required={required}
          />
          {rightButtonText && (
            <Button type="button" onClick={onRightButtonClick}>
              {rightButtonText}
            </Button>
          )}
        </InputRow>
        {message && <Message>{message}</Message>}
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      </Wrapper>
    );
  }
);

InputBox.displayName = "InputBox";

export default InputBox;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 13px;
  width: 100%;
`;

const Input = styled.input<{ $hasMessage: boolean }>`
  flex: 1;
  padding: 19px 16px;
  width: 100%;
  font-size: 16px;
  line-height: 1;
  border: 1px solid
    ${({ $hasMessage, theme }) =>
      $hasMessage ? theme.palette.error.main : theme.app.border};
  border-radius: 10px;
  color: ${({ theme }) => theme.app.text.dark1};
  background: ${({ theme }) => theme.app.bg.light};

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light1};
  }
`;

const Button = styled.button`
  padding: 0 20px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 10px;
  background: ${({ theme }) => theme.app.palette.gray[800]};
  color: ${({ theme }) => theme.app.palette.gray[0]};
`;

const Message = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.error.main};
  font-weight: 600;
`;

export const SuccessMessage = styled(Message)`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.success.main};
  font-weight: 600;
`;
