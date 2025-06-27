import {
  type InputHTMLAttributes,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import styled from "styled-components";

import Button from "@components/Button";

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

const InputBox = forwardRef<HTMLInputElement, InputBoxProps>((props, ref) => {
  const {
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
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 모바일 포커스 꼬임 방지
      onKeyDown?.(e);
    }
  };

  const handleFocus = () => {
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <Wrapper>
      <InputRow>
        <Input
          ref={inputRef}
          $hasMessage={!!message}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          required={required}
        />
        {rightButtonText && (
          <Button
            type="button"
            variant="contained"
            size="large"
            onClick={onRightButtonClick}
          >
            {rightButtonText}
          </Button>
        )}
      </InputRow>
      {message && <Message>{message}</Message>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
    </Wrapper>
  );
});

InputBox.displayName = "InputBox";

export default InputBox;

// --- styled-components ---

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
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
  background: ${({ theme }) => theme.app.bg.white};

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light1};
  }
`;

const Message = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.error.main};
  font-weight: 600;
`;

const SuccessMessage = styled(Message)`
  color: ${({ theme }) => theme.palette.success.main};
`;
