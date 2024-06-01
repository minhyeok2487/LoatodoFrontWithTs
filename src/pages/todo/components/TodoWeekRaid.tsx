import { useRecoilState, useSetRecoilState } from "recoil";
import * as characterApi from "../../../core/apis/Character.api";
import * as friendApi from "../../../core/apis/Friend.api";
import { useCharacters } from "../../../core/apis/Character.api";
import {
  CharacterType,
  TodoType,
  WeekContnetType,
} from "../../../core/types/Character.type";
import { modalState } from "../../../core/atoms/Modal.atom";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import RaidSortWrap from "./week_components/RaidSortWrap";
import { Button } from "@mui/material";
import { FriendType } from "../../../core/types/Friend.type";
import { useFriends } from "../../../core/apis/Friend.api";
import { loading } from "../../../core/atoms/Loading.atom";

interface Props {
  character: CharacterType;
  friend?: FriendType;
}

const TodoWeekRaid: FC<Props> = ({ character, friend }) => {
  const { refetch: refetchCharacters } = useCharacters();
  const { refetch: refetchFriends } = useFriends();
  const [modal, setModal] = useRecoilState(modalState);
  const [showSortRaid, setShowSortRaid] = useState(false);
  const [localCharacter, setLocalCharacter] = useState(character);
  const setLoadingState = useSetRecoilState(loading);

  useEffect(() => {
    setLocalCharacter(character);
  }, [character, showSortRaid]);

  const saveRaidSort = async () => {
    setLoadingState(true);
    if (friend) {
      toast("기능 준비 중입니다.");
      setShowSortRaid(false);
    } else {
      try {
        await characterApi.saveRaidSort(localCharacter);

        toast("레이드 순서 업데이트가 완료되었습니다.");
        refetchCharacters();
        setShowSortRaid(false);
      } catch (error) {
        console.error("Error saveSort:", error);
      }
    }
    setLoadingState(false);
  };

  const openAddTodoForm = async () => {
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.setting) {
        toast.warn("권한이 없습니다.");
      }
      try {
        const data = await friendApi.getTodoFormData(friend, character);
        makeAddTodoForm(data);
      } catch (error) {
        console.log("openAddTodoFrom error : " + error);
      }
    } else {
      try {
        const data = await characterApi.getTodoFormData(
          localCharacter.characterId,
          localCharacter.characterName
        );
        makeAddTodoForm(data);
      } catch (error) {
        console.log("openAddTodoFrom error : " + error);
      }
    }
    setLoadingState(false);
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

    const updateGoldCheckVersion = async () => {
      setLoadingState(true);
      if (friend) {
        toast("기능 준비 중입니다.");
      } else {
        try {
          await characterApi.updateGoldCheckVersion(localCharacter);
          refetchCharacters();
          toast(`${localCharacter.characterName} 의 골드 체크 방식 변경하였습니다.`);
          setModal({
            ...modal,
            openModal: false,
          });
        } catch (error) {
          console.error("Error updateWeekTodo All:", error);
        }
      }
      setLoadingState(false);
    };

    const content = Object.entries(todosByCategory).map(
      ([weekCategory, todos], index) => (
        <div key={index} className="week-form-wrap">
          <div className="week-category-name">
            <p>{weekCategory}</p>
            {localCharacter.settings.goldCheckVersion &&
              (todosGoldCheck[weekCategory] ? (
                <button
                  className="gold-check-btn checked"
                  onClick={() =>
                    updateWeekGoldCheck(
                      weekCategory,
                      !todosGoldCheck[weekCategory]
                    )
                  }
                >
                  골드 획득 지정 해제
                </button>
              ) : (
                <button
                  className="gold-check-btn"
                  onClick={() =>
                    updateWeekGoldCheck(
                      weekCategory,
                      !todosGoldCheck[weekCategory]
                    )
                  }
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
                      onClick={() => updateWeekTodoAll(todo)}
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
                          color: "var(--fColor)",
                        }}
                        onClick={() => updateWeekTodo(todoItem)}
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
            onClick={() => updateGoldCharacter()}
            style={{ cursor: "pointer" }}
          >
            골드 획득 캐릭터 지정 {localCharacter.goldCharacter ? "해제" : ""}
          </Button>
          <Button
            variant="contained"
            onClick={() => updateGoldCheckVersion()}
            style={{ cursor: "pointer" }}
          >
            골드 획득 체크 방식 :{" "}
            {localCharacter.settings.goldCheckVersion
              ? "체크 방식"
              : "상위 3개"}
          </Button>
        </div>
        {content}
      </div>
    );
    setModal({
      ...modal,
      openModal: true,
      modalTitle: modalTitle,
      modalContent: modalContent,
    });
  };

  // 컨텐츠 골드 획득 지정
  const updateWeekGoldCheck = async (
    weekCategory: string,
    updateValue: boolean
  ) => {
    setLoadingState(true);
    if (friend) {
      toast("기능 준비 중입니다.");
    } else {
      try {
        await characterApi.updateCheckGold(
          localCharacter,
          weekCategory,
          updateValue
        );
        refetchCharacters();
        await openAddTodoForm();
      } catch (error) {
        console.log(error);
      }
    }
    setLoadingState(false);
  };

  /*2-1. 캐릭터 주간 숙제 업데이트(추가/삭제)*/
  const updateWeekTodo = async (todo: WeekContnetType) => {
    if (friend) {
      toast("기능 준비 중입니다.");
    } else {
      try {
        await characterApi.updateWeekTodo(localCharacter, todo);
        refetchCharacters();
        await openAddTodoForm();
      } catch (error) {
        console.error("Error updateWeekTodo:", error);
      }
    }
  };

  /*2-2.캐릭터 주간 숙제 업데이트 All(추가/삭제)*/
  const updateWeekTodoAll = async (todos: WeekContnetType[]) => {
    setLoadingState(true);
    if (friend) {
      toast("기능 준비 중입니다.");
    } else {
      try {
        await characterApi.updateWeekTodoAll(localCharacter, todos);
        refetchCharacters();
        await openAddTodoForm();
      } catch (error) {
        console.error("Error updateWeekTodo:", error);
      }
    }
    setLoadingState(false);
  };

  /*3-1.주간숙제 체크*/
  const updateWeekCheck = async (todo: TodoType) => {
    setLoadingState(true);
    if (friend) {
      try {
        await friendApi.updateWeekCheck(localCharacter, todo);
        refetchFriends();
      } catch (error) {
        console.error("Error updateWeekCheck:", error);
      }
    } else {
      try {
        await characterApi.updateWeekCheck(localCharacter, todo);
        refetchCharacters();
      } catch (error) {
        console.error("Error updateWeekCheck:", error);
      }
    }
    setLoadingState(false);
  };

  /*3-2. 캐릭터 주간숙제 체크 All*/
  const updateWeekCheckAll = async (e: React.MouseEvent, todo: TodoType) => {
    setLoadingState(true);
    e.preventDefault();
    if (friend) {
      try {
        await friendApi.updateWeekCheckAll(localCharacter, todo);
        refetchFriends();
      } catch (error) {
        console.error("Error updateWeekCheck:", error);
      }
    } else {
      try {
        await characterApi.updateWeekCheckAll(localCharacter, todo);
        refetchCharacters();
      } catch (error) {
        console.error("Error updateWeekCheck:", error);
      }
    }
    setLoadingState(false);
  };

  /*4.골드획득 캐릭터 업데이트*/
  const updateGoldCharacter = async () => {
    setLoadingState(true);
    if (friend) {
      toast("기능 준비 중입니다.");
    } else {
      try {
        await characterApi.updateGoldCharacter(localCharacter);
        refetchCharacters();
        toast(`${localCharacter.characterName} 의 골드 획득 설정을 변경하였습니다.`);
        setModal({
          ...modal,
          openModal: false,
        });
      } catch (error) {
        console.error("Error updateWeekCheck:", error);
      }
    }
    setLoadingState(false);
  };

  /*5. 주간숙제 메모 노출/미노출*/
  const changeShow = async (todoId: Number) => {
    toast.warn("버그가 있어 수정 중입니다ㅠㅠㅠㅠ");
    // localCharacter.todoList.map((todo) => {
    //   if (todo.id === todoId) {
    //     if (todo.message === null) {
    //       return { ...todo, message: "" };
    //     }
    //   }
    //   return todo;
    // });
    // refetchCharacters();
  };

  /*6. 주간숙제 메모*/
  const updateWeekMessage = async (todoId: number, message: any) => {
    setLoadingState(true);
    if (friend) {
      toast("기능 준비 중입니다.");
    } else {
      try {
        await characterApi.updateWeekMessage(localCharacter, todoId, message);
        refetchCharacters();
      } catch (error) {
        console.error("Error updateWeekMessage:", error);
      }
    }
    setLoadingState(false);
  };

  return (
    <>
      <div
        className="content"
        style={{
          padding: 0,
          display: localCharacter.settings.showWeekTodo ? "block" : "none",
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
          <RaidSortWrap character={localCharacter} />
        ) : (
          localCharacter.todoList.map((todo) => (
            <div className="content-wrap" key={todo.id} style={{}}>
              <div
                className="content"
                style={{
                  height: "100%",
                  position: "relative",
                  justifyContent: "space-between",
                  fontSize: 14,
                  fontWeight: "bold",
                  paddingTop: 10,
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
                  <button
                    className={`content-button ${todo.check ? "done" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => updateWeekCheck(todo)}
                    onContextMenu={(e) => updateWeekCheckAll(e, todo)}
                  >
                    {/* {todo.check ? <DoneIcon /> : <CloseIcon />} */}
                  </button>
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
                      onClick={() => updateWeekCheck(todo)}
                      onContextMenu={(e) => updateWeekCheckAll(e, todo)}
                      dangerouslySetInnerHTML={{
                        __html: todo.name.replace(/\n/g, "<br />"),
                      }}
                    ></div>
                    <div
                      className={`${todo.check ? "text-done" : ""}`}
                      onClick={() => updateWeekCheck(todo)}
                      onContextMenu={(e) => updateWeekCheckAll(e, todo)}
                    >
                      <span className="gold">
                        {localCharacter.goldCharacter ? todo.gold + " G" : ""}
                      </span>{" "}
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
                          onBlur={(e) =>
                            updateWeekMessage(
                              todo.id,
                              (e.target as HTMLInputElement).value
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateWeekMessage(
                                todo.id,
                                (e.target as HTMLInputElement).value
                              );
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          placeholder="메모 추가"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    {todo.message === null ? (
                      <input
                        type="button"
                        className="icon-btn-message"
                        id={"input_field_icon_" + todo.id}
                        onClick={() => changeShow(todo.id)}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div
                className="content gauge-box"
                style={{ height: 16, padding: 0, position: "relative" }}
              >
                {Array.from({ length: todo.totalGate }, (_, index) => (
                  <div
                    key={`${todo.id}-${index}`}
                    className="gauge-wrap"
                    style={{
                      backgroundColor:
                        todo.currentGate > index ? "var(--bar-color-red)" : "", // pub
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
    </>
  );
};

export default TodoWeekRaid;
