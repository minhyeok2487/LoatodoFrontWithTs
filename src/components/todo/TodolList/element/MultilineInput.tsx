import { forwardRef, useEffect, useRef } from "react";
import type {
  MouseEvent,
  MutableRefObject,
  TextareaHTMLAttributes,
} from "react";
import styled from "styled-components";
import type { RuleSet } from "styled-components";

interface Props {
  wrapperCss?: RuleSet;
  inputCss?: RuleSet;
  onEnterPress: (value: string) => void;
  onClick?: (e: MouseEvent<HTMLTextAreaElement>) => void;
  isHidden?: boolean;
  maxLength?: number;
  defaultValue?: string;
  placeholder?: string;
}

type ParentRef = MutableRefObject<HTMLTextAreaElement | null>;

const MultilineInput = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      wrapperCss,
      inputCss,
      onEnterPress,
      onClick,
      isHidden,
      maxLength,
      defaultValue,
      placeholder,
    },
    ref
  ) => {
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
      defaultValue,
    };

    return (
      <Wrapper $customStyle={wrapperCss}>
        <Input
          ref={ref}
          {...textareaProps}
          $isHidden={isHidden}
          $customStyle={inputCss}
          spellCheck={false}
          placeholder={placeholder}
          maxLength={maxLength}
          onClick={onClick}
          onInput={syncTextarea}
          onKeyDown={(e) => {
            e.stopPropagation();
            const refFromParent = ref as ParentRef;

            const target = e.target as HTMLInputElement;

            if (e.key === "Enter") {
              if (refFromParent.current) {
                onEnterPress(refFromParent.current.value);
              }

              target.blur();
            }
          }}
        />
        <Hidden
          ref={hiddenRef}
          {...textareaProps}
          $customStyle={inputCss}
          disabled
        />
      </Wrapper>
    );
  }
);

MultilineInput.displayName = "MultilineInput";

export default MultilineInput;

const Wrapper = styled.div<{ $customStyle?: RuleSet }>`
  position: relative;

  ${({ $customStyle }) => $customStyle}
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
