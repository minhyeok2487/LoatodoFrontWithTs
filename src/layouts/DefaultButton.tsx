import { FC } from "react";
import type { MouseEventHandler } from "react";

import "@styles/layouts/DefaultButton.css";

interface Props {
  handleEvent: MouseEventHandler<HTMLButtonElement>;
  name: string;
}
const DefaultButton: FC<Props> = ({ handleEvent, name }) => {
  return (
    <div className="btn-wrap">
      <button type="button" className="btn" onClick={handleEvent}>
        {name}
      </button>
    </div>
  );
};

export default DefaultButton;
