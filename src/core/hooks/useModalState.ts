import { useState } from "react";

export default <S>(): [S | undefined, (value?: S) => void] => {
  const [state, setInnerState] = useState<S | undefined>(undefined);

  const setState = (newState?: S) => {
    setInnerState(newState);
  };

  return [state, setState];
};
