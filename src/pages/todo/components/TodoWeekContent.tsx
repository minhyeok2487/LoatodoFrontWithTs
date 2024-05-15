import { useSetRecoilState } from "recoil";
import * as characterApi from "../../../core/apis/Character.api";
import { useCharacters } from "../../../core/apis/Character.api";
import {
  CharacterType,
  WeekContnetType,
} from "../../../core/types/Character.type";
import { modalState } from "../../../core/atoms/Modal.atom";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import RaidSortWrap from "./week_components/RaidSortWrap";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";

interface Props {
  character: CharacterType;
}

const TodoWeekContent: FC<Props> = ({ character }) => {
  const { refetch: refetchCharacters } = useCharacters();
  const setModal = useSetRecoilState(modalState);
  const [localCharacter, setLocalCharacter] =
    useState<CharacterType>(character);
  const [showSortRaid, setShowSortRaid] = useState(false);

  useEffect(() => {
    setLocalCharacter(character);
  }, [character]);

  const saveRaidSort = async () => {
    try {
      await characterApi.saveRaidSort(character);

      toast("레이드 순서 업데이트가 완료되었습니다.");
      refetchCharacters();
      setShowSortRaid(false);
    } catch (error) {
      console.error("Error saveSort:", error);
    }
  };

  const openAddTodoForm = async () => {
    try {
      const data = await characterApi.getTodoFormData(
        localCharacter.characterId,
        localCharacter.characterName
      );
      makeAddTodoForm(data);
    } catch (error) {
      return null;
    }
  };

  const makeAddTodoForm = (data: WeekContnetType[]) => {
    const modalTitle = localCharacter.characterName + " 주간 숙제 관리";
    const todosByCategory: {
      [key: string]: { 노말: WeekContnetType[]; 하드: WeekContnetType[] };
    } = {};
    const todosGoldCheck: { [key: string]: boolean } = {};

    data.forEach((todo) => {
      if (!todosByCategory[todo.weekCategory]) {
        todosByCategory[todo.weekCategory] = {
          노말: [],
          하드: [],
        };
      }
      if (todo.weekContentCategory === "노말") {
        todosByCategory[todo.weekCategory]["노말"].push(todo);
      } else {
        todosByCategory[todo.weekCategory]["하드"].push(todo);
      }
      if (todosGoldCheck[todo.weekCategory] === undefined) {
        todosGoldCheck[todo.weekCategory] = todo.goldCheck;
      } else {
        todosGoldCheck[todo.weekCategory] =
          todosGoldCheck[todo.weekCategory] || todo.goldCheck;
      }
    });

    const content = Object.entries(todosByCategory).map(
      ([weekCategory, todos], index) => (
        <div key={index} className="week-form-wrap">
          <div className="week-category-name">
            <p>{weekCategory}</p>
            {character.settings.goldCheckVersion &&
              (todosGoldCheck[weekCategory] ? (
                <button
                  className="gold-check-btn checked"
                  // onClick={() =>
                  //   updateWeekGoldCheck(
                  //     weekCategory,
                  //     characterName,
                  //     !todosGoldCheck[weekCategory]
                  //   )
                  // }
                >
                  골드 획득 지정 해제
                </button>
              ) : (
                <button
                  className="gold-check-btn"
                  // onClick={() =>
                  //   updateWeekGoldCheck(
                  //     weekCategory,
                  //     characterName,
                  //     !todosGoldCheck[weekCategory]
                  //   )
                  // }
                >
                  골드 획득 지정
                </button>
              ))}
          </div>
          <div
            className="week-category-wrap"
            style={{ flexDirection: "column" }}
          >
            {Object.entries(todos).map(
              ([weekContentCategory, todo], todoIndex) =>
                todo.length > 0 && (
                  <div key={todoIndex} style={{ display: "flex" }}>
                    <button
                      key={todoIndex}
                      className="button"
                      // onClick={() =>
                      //   updateWeekTodoAll(characterId, characterName, todo)
                      // }
                      style={{
                        backgroundColor:
                          todo.reduce(
                            (count, todoItem) =>
                              count + (todoItem.checked ? 1 : 0),
                            0
                          ) === todo.length
                            ? "#1ddfee"
                            : "#fee1dd",
                        border:
                          todo.reduce(
                            (count, todoItem) =>
                              count + (todoItem.checked ? 1 : 0),
                            0
                          ) === todo.length
                            ? "1px solid black"
                            : "",
                        fontWeight:
                          todo.reduce(
                            (count, todoItem) =>
                              count + (todoItem.checked ? 1 : 0),
                            0
                          ) === todo.length
                            ? "bold"
                            : "",
                      }}
                    >
                      {weekContentCategory}
                      <em>
                        {todo.reduce((sum, todoItem) => sum + todoItem.gold, 0)}
                        G
                      </em>
                    </button>
                    {todo.map((todoItem) => (
                      <button
                        key={todoItem.id}
                        className="button"
                        style={{
                          border: todoItem.checked ? "1px solid black" : "",
                          fontWeight: todoItem.checked ? "bold" : "",
                        }}
                        // onClick={() =>
                        //   updateWeekTodo(characterId, characterName, todoItem)
                        // }
                      >
                        {todoItem.gate}관문 <em>{todoItem.gold}G</em>
                      </button>
                    ))}
                  </div>
                )
            )}
          </div>
        </div>
      )
    );

    const modalContent = (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Button
            variant="contained"
            size="small"
            // onClick={() => updateGoldCharacter(characterName)}
            style={{ cursor: "pointer" }}
          >
            골드 획득 캐릭터 지정 {character.goldCharacter ? "해제" : ""}
          </Button>
          <Button
            variant="contained"
            // onClick={() => updateGoldCheckVersion(characterId)}
            style={{ cursor: "pointer" }}
          >
            골드 획득 체크 방식 : {character.settings.goldCheckVersion ? "체크 방식" : "상위 3개"}
          </Button>
        </div>
        {content}
      </div>
    );
    setModal({
      openModal: true,
      modalTitle: modalTitle,
      modalContent: modalContent,
    });
  };

  return (
    <div className="character-wrap">
      <div
        className="content"
        style={{
          padding: 0,
          display: character.settings.showWeekTodo ? "block" : "none",
        }}
      >
        <p className="title">주간 레이드</p>
        {showSortRaid ? (
          <p className="txt">저장 버튼 클릭시 순서가 저장됩니다.</p>
        ) : (
          <p className="txt">마우스 우클릭 시 한번에 체크됩니다</p>
        )}
        {showSortRaid ? (
          <button
            className={"content-button sort"}
            onClick={() => saveRaidSort()}
            style={{ right: "55px" }}
          >
            저장
          </button>
        ) : (
          <button
            className={"content-button sort"}
            onClick={() => setShowSortRaid(true)}
            style={{ right: "55px" }}
          >
            정렬
          </button>
        )}
        <button className={"content-button"} onClick={() => openAddTodoForm()}>
          편집
        </button>
      </div>
      <div className="character-todo">
        {showSortRaid ? (
          <RaidSortWrap character={localCharacter}/>
        ) : (
          character.todoList.map((todo) => (
            <div className="content-wrap" key={todo.id}>
              <div
                className="content"
                style={{
                  height: 75,
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
                >
                  {/* 여기서 부터 */}
                  <button
                    className={`content-button ${todo.check ? "done" : ""}`}
                    style={{ cursor: "pointer" }}
                    // onClick={() =>
                    //   updateWeekCheck(character.characterName, todo)
                    // }
                    // onContextMenu={(e) =>
                    //   updateWeekCheckAll(e, character.characterName, todo)
                    // }
                  >
                    {todo.check ? <DoneIcon /> : <CloseIcon />}
                  </button>
                  {/* 여기까지 클릭 버튼 */}
                  {/* 여기서 부터 */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <div
                      className={`${todo.check ? "text-done" : ""}`}
                      // onClick={() =>
                      //   updateWeekCheck(character.characterName, todo)
                      // }
                      // onContextMenu={(e) =>
                      //   updateWeekCheckAll(e, character.characterName, todo)
                      // }
                      dangerouslySetInnerHTML={{
                        __html: todo.name.replace(/\n/g, "<br />"),
                      }} // pub 이부분 원래로 원복
                    ></div>
                    <div
                      className={`${todo.check ? "text-done" : ""}`}
                      // onClick={() =>
                      //   updateWeekCheck(character.characterName, todo)
                      // }
                      // onContextMenu={(e) =>
                      //   updateWeekCheckAll(e, character.characterName, todo)
                      // }
                    >
                      <span className="gold">
                        {character.goldCharacter ? todo.gold + " G" : ""}
                      </span>{" "}
                      {/* pub span gold 추가 */}
                    </div>
                    <div
                      className={"input-field"}
                      id={"input_field_" + todo.id}
                    >
                      {todo.message !== null && (
                        <input
                          type="text"
                          spellCheck="false"
                          defaultValue={todo.message}
                          style={{ width: "90%" }}
                          // onBlur={(e) =>
                          //   updateWeekMessage(
                          //     character.id,
                          //     todo.id,
                          //     e.target.value
                          //   )
                          // }
                          // onKeyDown={(e) => {
                          //   if (e.key === "Enter") {
                          //     updateWeekMessage(
                          //       character.id,
                          //       todo.id,
                          //       e.target.value
                          //     );
                          //     e.target.blur();
                          //   }
                          // }}
                          placeholder="메모 추가"
                        />
                      )}
                    </div>
                  </div>
                  {/* 여기까지 출력 글씨 */}
                  {/* 여기서 부터 */}
                  <div>
                    {todo.message === null ? (
                      <input
                        type="button"
                        className="icon-btn-message"
                        id={"input_field_icon_" + todo.id}
                        // onClick={() => changeShow(character.id, todo.id)}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  {/* 여기까지 "+" 버튼 */}
                </div>
              </div>
              <div
                className="content gauge-box"
                style={{ height: 16, padding: 0, position: "relative" }}
              >
                {" "}
                {/* pub guage-box 클래스추가 */}
                {Array.from({ length: todo.totalGate }, (_, index) => (
                  <div
                    key={`${todo.id}-${index}`}
                    className="gauge-wrap"
                    style={{
                      backgroundColor:
                        todo.currentGate > index ? "#ffbfb6" : "", // pub
                      width: 100 / todo.totalGate + "%",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-color)",
                    }}
                  >
                    <span>{index + 1}관문</span>
                  </div>
                ))}
                <span className="gauge-text"></span>
              </div>
            </div>
          ))
        )}
      </div>
      {/* pub 2023-10-23 스타일 적용 완료 */}
      {(character.settings.showWeekEpona ||
        character.settings.showSilmaelChange ||
        character.settings.showCubeTicket) && (
        <div className="content title02" style={{ padding: 0 }}>
          <p className="title">주간 숙제</p>
        </div>
      )}
      {/*주간 숙제(에포나, 큐브, 실마엘)*/}
      {/* <TodoWeekContentContainer
        showMessage={showMessage}
        setIsLoading={setIsLoading}
        character={character}
        characters={characters}
        setCharacters={setCharacters}
        setModalTitle={setModalTitle}
        setModalContent={setModalContent}
        setOpenModal={setOpenModal}
      /> */}
    </div>
  );
};

export default TodoWeekContent;
