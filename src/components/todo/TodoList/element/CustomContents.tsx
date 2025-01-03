import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import styled, { css, useTheme } from "styled-components";

import {
  useAddCustomTodo,
  useCheckCustomTodo,
  useRemoveCustomTodo,
  useUpdateCustomTodo,
} from "@core/hooks/mutations/todo";
import { useCustomTodos } from "@core/hooks/queries/todo";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import type { CustomTodoFrequency } from "@core/types/todo";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import Check from "@components/todo/TodoList/element/Check";
import MultilineInput from "@components/todo/TodoList/element/MultilineInput";

import RemoveIcon from "@assets/svg/RemoveIcon";
import SaveIcon from "@assets/svg/SaveIcon";
import SettingIcon from "@assets/svg/SettingIcon";

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
                inputCss={inputCss}
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

              <RightButtonBox>
                <Button
                  css={rightButtonCss}
                  type="button"
                  variant="icon"
                  size={18}
                  onClick={() => {
                    handleRemoveCustomTodo(item.customTodoId);
                  }}
                >
                  <RemoveIcon />
                </Button>
                <Button
                  css={rightButtonCss}
                  type="button"
                  variant="icon"
                  size={18}
                  onClick={() => {
                    handleUpdateCustomTodo({
                      customTodoId: item.customTodoId,
                      contentName: inputRef.current?.value || "",
                    });
                  }}
                >
                  <SaveIcon />
                </Button>
              </RightButtonBox>
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
                  ariaLabel: "커스텀 숙제 수정하기",
                  icon: <SettingIcon />,
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
            inputCss={inputCss}
            placeholder={`${frequencyText} 숙제 이름을 입력해주세요.`}
            maxLength={20}
            onEnterPress={handleAddCustomTodo}
          />

          <RightButtonBox>
            <Button
              css={rightButtonCss}
              type="button"
              variant="icon"
              size={18}
              onClick={() => {
                handleAddCustomTodo(inputRef.current?.value || "");
              }}
            >
              <SaveIcon />
            </Button>
          </RightButtonBox>
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
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;

const inputCss = css`
  padding: 5px 0 5px 5px;
`;

const addCustomTodoInputWrapperCss = css`
  flex: 1;
`;

const RightButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
`;

const rightButtonCss = css`
  flex: 1;
  padding: 8px 6px;
  border-radius: 0;
`;
