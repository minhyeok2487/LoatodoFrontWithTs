import { forwardRef, useRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import styled from "styled-components";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const MemoInput = forwardRef<HTMLTextAreaElement, Props>(({ ...rest }, ref) => {
  const hiddenRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    if (ref?.current && hiddenRef.current) {
      console.log(hiddenRef.current.scrollHeight);
      ref.style.height = "auto";
      ref.style.height = hiddenRef.current.scrollHeight;
    }
  };

  return (
    <>
      <Input
        ref={ref}
        {...rest}
        onChange={(e) => {
          if (hiddenRef.current) {
            hiddenRef.current.value = e.target.value;
          }
        }}
        onInput={handleInput}
      />
      <Hidden ref={hiddenRef} />
    </>
  );
});

export default MemoInput;

const Input = styled.textarea`
  display: block;
  width: 100%;
  height: auto;
  font-size: 12px;
  background: transparent;
  overflow: hidden;
`;

const Hidden = styled(Input)`
  background: red;
`;
