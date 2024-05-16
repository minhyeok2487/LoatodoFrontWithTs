import { FC } from "react";
import { CharacterType } from "../../../../core/types/Character.type";
import * as characterApi from "../../../../core/apis/Character.api";

interface Props {
  character: CharacterType;
}
const WeekEponaComponent: FC<Props> = ({ character }) => {
  const { refetch: refetchCharacters } = characterApi.useCharacters();

  /*주간 에포나 체크*/
  const weekEponaCheck = async () => {
    try {
      await characterApi.weekEponaCheck(character);
      refetchCharacters();
    } catch (error) {
      console.error("Error weekEponaCheck:", error);
    }
  };

  /*주간 에포나 체크 All*/
  const weekEponaCheckAll = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await characterApi.weekEponaCheckAll(character);
      refetchCharacters();
    } catch (error) {
      console.error("Error weekEponaCheckAll:", error);
    }
  };

  return (
    <div className="content-wrap">
      <div
        className="content"
        style={{
          height: 35,
          position: "relative",
          justifyContent: "space-between",
          fontSize: 14, //pub 수정
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => weekEponaCheck()}
          onContextMenu={(e) => weekEponaCheckAll(e)}
        >
          <button
            className={`content-button ${
              character.weekEpona === 3
                ? "done"
                : character.weekEpona === 1
                ? "ing"
                : character.weekEpona === 2
                ? "ing2"
                : ""
            }`}
            style={{ cursor: "pointer" }}
          ></button>
          <div
            className={`${character.weekEpona === 3 ? "text-done" : ""}`}
            style={{ width: "100%" }}
          >
            주간에포나
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekEponaComponent;
