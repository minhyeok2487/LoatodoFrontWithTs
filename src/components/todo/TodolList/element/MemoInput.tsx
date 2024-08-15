import { forwardRef, useEffect, useRef } from "react";
import type {
  MouseEvent,
  MutableRefObject,
  TextareaHTMLAttributes,
} from "react";
import styled from "styled-components";
import type { RuleSet } from "styled-components";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSubmit: () => void;
  onClick: (e: MouseEvent<HTMLTextAreaElement>) => void;
  css?: RuleSet;
  isHidden?: boolean;
}

type ParentRef = MutableRefObject<HTMLTextAreaElement | null>;

const MemoInput = forwardRef<HTMLTextAreaElement, Props>(
  ({ onSubmit, onClick, css, isHidden, ...rest }, ref) => {
    const hiddenRef = useRef<HTMLTextAreaElement>(null);

    const syncText = () => {
      const refFromParent = ref as ParentRef;

      if (hiddenRef.current && refFromParent.current) {
        hiddenRef.current.value = refFromParent.current.value;
      }
    };

    const syncHeight = () => {
      const refFromParent = ref as ParentRef;

      if (hiddenRef.current && refFromParent.current) {
        refFromParent.current.style.height = "auto";
        refFromParent.current.style.height = `${hiddenRef.current.scrollHeight}px`;
      }
    };

    const syncTextarea = () => {
      syncText();
      syncHeight();
    };

    useEffect(() => {
      syncTextarea();
    }, []);

    useEffect(() => {
      syncHeight();
      window.addEventListener("resize", syncHeight);

      return () => {
        window.removeEventListener("resize", syncHeight);
      };
    });

    const textareaProps: TextareaHTMLAttributes<HTMLTextAreaElement> = {
      rows: 1,
      defaultValue: rest.defaultValue,
    };

    return (
      <Wrapper>
        <Input
          ref={ref}
          {...rest}
          {...textareaProps}
          $isHidden={isHidden}
          $customStyle={css}
          spellCheck={false}
          onClick={onClick}
          onInput={syncTextarea}
          onKeyDown={(e) => {
            e.stopPropagation();
            const target = e.target as HTMLInputElement;

            if (e.key === "Enter") {
              onSubmit();

              target.blur();
            }
          }}
        />
        <Hidden
          ref={hiddenRef}
          {...textareaProps}
          $customStyle={css}
          disabled
        />
      </Wrapper>
    );
  }
);

MemoInput.displayName = "MemoInput";

export default MemoInput;

const Wrapper = styled.div`
  position: relative;
`;

const Input = styled.textarea<{
  $customStyle?: RuleSet;
  $isHidden?: boolean;
}>`
  position: ${({ $isHidden }) => ($isHidden ? "absolute" : "relative")};
  left: ${({ $isHidden }) => ($isHidden ? "-9999px" : "unset")};
  display: block;
  width: 100%;
  height: auto;
  font-size: 12px;
  line-height: 1.2;
  background: transparent;
  overflow: hidden;
  word-break: keep-all;

  ${({ $customStyle }) => $customStyle}
`;

const Hidden = styled(Input)`
  position: absolute;
  top: -9999px;
  left: -9999px;
`;
