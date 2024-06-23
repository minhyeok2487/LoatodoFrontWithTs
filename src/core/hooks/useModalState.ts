import { useState } from "react";

const useModalState = <S>(): [S | undefined, (value?: S) => void] => {
  const [state, setInnerState] = useState<S | undefined>(undefined);

  const setState = (newState?: S) => {
    setInnerState(newState);
  };

  return [state, setState];
};

export default useModalState;
