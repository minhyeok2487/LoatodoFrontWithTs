import { FC } from "react";
import { CharacterType } from "../../../../core/types/Character.type";
import * as characterApi from "../../../../core/apis/Character.api";

interface Props {
  character: CharacterType;
}
const SilmaelChangeComponent: FC<Props> = ({ character }) => {
  const { refetch: refetchCharacters } = characterApi.useCharacters();

  /*실마엘 체크*/
  const silmaelChange = async () => {
    try {
      await characterApi.silmaelChange(character);
      refetchCharacters();
    } catch (error) {
      console.error("Error weekEponaCheck:", error);
    }
  };

  /*실마엘 체크(우클릭)*/
  const silmaelChangeAll = async (e: React.MouseEvent) => {
    e.preventDefault();
    silmaelChange();
  };

  return (
    <div className="content-wrap">
      <div
        className="content"
        style={{
          height: 35,
          position: "relative",
          justifyContent: "space-between",
          fontSize: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => silmaelChange()}
          onContextMenu={(e) => silmaelChangeAll(e)}
        >
          <button
            className={`content-button ${
              character.silmaelChange ? "done" : ""
            }`}
            style={{ cursor: "pointer" }}
          ></button>
          <div
            className={`${character.silmaelChange ? "text-done" : ""}`}
            style={{ width: "100%" }}
          >
            실마엘 혈석 교환
          </div>
        </div>
      </div>
    </div>
  );
};

export default SilmaelChangeComponent;
