import { forwardRef, useRef } from "react";
import type {
  FormEvent,
  MutableRefObject,
  TextareaHTMLAttributes,
} from "react";
import styled from "styled-components";
import type { RuleSet } from "styled-components";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  css?: RuleSet;
}

const MemoInput = forwardRef<HTMLTextAreaElement, Props>(
  ({ css, ...rest }, ref) => {
    const hiddenRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = (e: FormEvent<HTMLTextAreaElement>) => {
      const refFromParent = (
        ref as MutableRefObject<HTMLTextAreaElement | null>
      ).current;

      if (hiddenRef.current) {
        hiddenRef.current.value = e.currentTarget.value;
      }

      if (refFromParent && hiddenRef.current) {
        const hiddenRect = hiddenRef.current;

        if (hiddenRect) {
          refFromParent.style.height = "auto";
          refFromParent.style.height = `${refFromParent.scrollHeight}px`;
        }
      }
    };

    const textareaProps: TextareaHTMLAttributes<HTMLTextAreaElement> = {
      rows: 1,
    };

    return (
      <>
        <Input
          ref={ref}
          {...rest}
          {...textareaProps}
          $customStyle={css}
          onInput={handleInput}
        />
        <Hidden ref={hiddenRef} {...textareaProps} $customStyle={css} />
      </>
    );
  }
);

MemoInput.displayName = "MemoInput";

export default MemoInput;

const Input = styled.textarea<{
  $customStyle?: RuleSet;
}>`
  display: block;
  width: 100%;
  height: auto;
  font-size: 12px;
  line-height: 1.2;
  background: transparent;
  overflow: hidden;

  ${({ $customStyle }) => $customStyle}
`;

const Hidden = styled(Input)`
  background: red;

  ${({ $customStyle }) => $customStyle}
`;
