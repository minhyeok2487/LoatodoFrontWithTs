import { AiOutlineSetting } from "@react-icons/all-files/ai/AiOutlineSetting";
import { IoTrashOutline } from "@react-icons/all-files/io5/IoTrashOutline";
import { MdSave } from "@react-icons/all-files/md/MdSave";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import styled, { css, useTheme } from "styled-components";

import useAddCustomTodo from "@core/hooks/mutations/customTodo/useAddCustomTodo";
import useCheckCustomTodo from "@core/hooks/mutations/customTodo/useCheckCustomTodo";
import useRemoveCustomTodo from "@core/hooks/mutations/customTodo/useRemoveCustomTodo";
import useUpdateCustomTodo from "@core/hooks/mutations/customTodo/useUpdateCustomTodo";
import useCustomTodos from "@core/hooks/queries/customTodo/useCustomTodos";
import type { Character } from "@core/types/character";
import type { CustomTodoFrequency } from "@core/types/customTodo";
import type { Friend } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import Check from "@components/todo/TodoList/button/Check";
import MultilineInput from "@components/todo/TodoList/element/MultilineInput";

interface Props {
  setAddMode: Dispatch<SetStateAction<boolean>>;
  addMode: boolean;
  character: Character;
  friend?: Friend;
  frequency: CustomTodoFrequency;
}

const CustomContents = ({
  setAddMode,
  addMode,
  character,
  friend,
  frequency,
}: Props) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [editTargetId, setEditTargetId] = useState<null | number>(null);

  const indicatorColor =
    frequency === "DAILY"
      ? theme.app.palette.blue[350]
      : theme.app.palette.yellow[300];
  const frequencyText = frequency === "DAILY" ? "일일" : "주간";

  useEffect(() => {
    if ((addMode || editTargetId) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [addMode, editTargetId]);

  const customTodos = useCustomTodos(friend?.friendUsername);

  const checkCustomTodo = useCheckCustomTodo({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCustomTodos(friend?.friendUsername),
      });
    },
  });
  const removeCustomTodo = useRemoveCustomTodo({
    onSuccess: () => {
      toast.success(`커스텀 ${frequencyText} 숙제가 삭제되었습니다.`);

      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCustomTodos(friend?.friendUsername),
      });
    },
  });
  const updateCustomTodo = useUpdateCustomTodo({
    onSuccess: () => {
      toast.success(`커스텀 ${frequencyText} 숙제가 수정되었습니다.`);

      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCustomTodos(friend?.friendUsername),
      });

      setEditTargetId(null);
    },
  });
  const addCustomTodo = useAddCustomTodo({
    onSuccess: () => {
      toast.success(`커스텀 ${frequencyText} 숙제가 추가되었습니다.`);

      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCustomTodos(friend?.friendUsername),
      });

      setAddMode(false);
    },
  });

  const handleAddCustomTodo = (contentName: string) => {
    addCustomTodo.mutate({
      friendUsername: friend?.friendUsername,
      characterId: character.characterId,
      contentName,
      frequency,
    });
  };

  const handleUpdateCustomTodo = ({
    customTodoId,
    contentName,
  }: {
    customTodoId: number;
    contentName: string;
  }) => {
    updateCustomTodo.mutate({
      friendUsername: friend?.friendUsername,
      customTodoId,
      characterId: character.characterId,
      contentName,
    });
  };

  const handleCheckCustomTodo = (customTodoId: number) => {
    checkCustomTodo.mutate({
      friendUsername: friend?.friendUsername,
      characterId: character.characterId,
      customTodoId,
    });
  };

  const handleRemoveCustomTodo = (customTodoId: number) => {
    if (window.confirm("커스텀 숙제를 삭제하시겠어요?")) {
      removeCustomTodo.mutate({
        friendUsername: friend?.friendUsername,
        customTodoId,
      });
    }
  };

  return (
    <>
      {customTodos.data
        ?.filter(
          (item) =>
            item.frequency === frequency &&
            item.characterId === character.characterId
        )
        .map((item) => {
          return editTargetId === item.customTodoId ? (
            <CustomTodoForm>
              <MultilineInput
                ref={inputRef}
                wrapperCss={addCustomTodoInputWrapperCss}
                defaultValue={item.contentName}
                placeholder={`${frequencyText} 숙제 이름을 입력해주세요.`}
                maxLength={20}
                onEnterPress={(value) =>
                  handleUpdateCustomTodo({
                    customTodoId: item.customTodoId,
                    contentName: value,
                  })
                }
              />
              <button
                type="button"
                onClick={() => {
                  handleUpdateCustomTodo({
                    customTodoId: item.customTodoId,
                    contentName: inputRef.current?.value || "",
                  });
                }}
              >
                <MdSave size="18" />
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRemoveCustomTodo(item.customTodoId);
                }}
              >
                <IoTrashOutline size="18" />
              </button>
            </CustomTodoForm>
          ) : (
            <Check
              key={item.customTodoId}
              indicatorColor={indicatorColor}
              currentCount={item.checked ? 1 : 0}
              totalCount={1}
              onClick={() => handleCheckCustomTodo(item.customTodoId)}
              onRightClick={() => handleCheckCustomTodo(item.customTodoId)}
              rightButtons={[
                {
                  icon: <AiOutlineSetting />,
                  onClick: () => {
                    setEditTargetId(item.customTodoId);
                  },
                },
              ]}
            >
              {item.contentName}
            </Check>
          );
        })}
      {addMode && (
        <CustomTodoForm>
          <MultilineInput
            ref={inputRef}
            wrapperCss={addCustomTodoInputWrapperCss}
            placeholder={`${frequencyText} 숙제 이름을 입력해주세요.`}
            maxLength={20}
            onEnterPress={handleAddCustomTodo}
          />
          <button
            type="button"
            onClick={() => {
              handleAddCustomTodo(inputRef.current?.value || "");
            }}
          >
            <MdSave size="18" />
          </button>
        </CustomTodoForm>
      )}
    </>
  );
};

export default CustomContents;

const CustomTodoForm = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 5px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;

const addCustomTodoInputWrapperCss = css`
  flex: 1;
`;
