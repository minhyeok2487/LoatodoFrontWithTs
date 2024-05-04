import { FC } from "react";
import "../styles/layouts/DefaultButton.css";

interface Props {
  handleEvent: any;
  name: string;
}
const DefaultButton: FC<Props> = ({ handleEvent, name }) => {
  return (
    <div className="btn-wrap" onClick={handleEvent}>
      <button className="btn">{name}</button>
    </div>
  );
};

export default DefaultButton;
