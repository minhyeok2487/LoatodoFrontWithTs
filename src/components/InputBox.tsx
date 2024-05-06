import React, { useEffect, useRef } from "react";

interface InputBoxProps {
  className?: string;
  type: string;
  id: string;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  onKeyPress: () => void;
  message: string;
}

const InputBox: React.FC<InputBoxProps> = ({
  className = "",
  type,
  id,
  placeholder,
  value,
  setValue,
  onKeyPress,
  message,
}) => {
  const messageBoxRef = useRef<HTMLDivElement>(null);
  className = "input-box " + className;

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.style.borderColor = message ? "red" : "";
    }
  }, [message]);

  const handleOnKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onKeyPress();
    }
  };

  return (
    <div className={className} ref={messageBoxRef}>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={handleOnKeyPress}
        required
      />
      {message && <span className="input-warn-message">{message}</span>}
    </div>
  );
};

export default InputBox;
