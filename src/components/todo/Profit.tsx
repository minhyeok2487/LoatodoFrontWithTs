import { Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import type { FC } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { todoServerAtom } from "@core/atoms/todo.atom";
import { useUpdateDayTodoAllCharacters } from "@core/hooks/mutations/todo";
import type { Character } from "@core/types/character";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import GoldIcon from "@assets/images/ico_gold.png";

interface Props {
  characters: Character[];
  onSummaryClick: () => void;
}

const Profit: FC<Props> = ({ characters, onSummaryClick }) => {
  const queryClient = useQueryClient();
  const todoServer = useAtomValue(todoServerAtom);
  // 1. 예상 일일 수익
  const totalDayGold = characters.reduce((acc, character) => {
    let newAcc = acc;

    if (
      character.settings.showGuardian &&
      character.beforeGuardianGauge >= character.settings.thresholdGuardian
    ) {
      newAcc += character.guardianGold;
    }

    return newAcc;
  }, 0);

  // 2. 일일 수익
  const getDayGold = characters.reduce((acc, character) => {
    let newAcc = acc;

    if (character.guardianCheck === 1) {
      newAcc += character.guardianGold;
    }

    return newAcc;
  }, 0);

  // 3. 예상 주간 수익
  const totalWeekGold = characters.reduce((acc, character) => {
    let newAcc = acc;

    character.todoList.forEach((todo) => {
      newAcc += todo.realGold;
    });

    return newAcc;
  }, 0);

  // 4. 주간 수익
  let getWeekGold = characters.reduce((acc, character) => {
    let newAcc = acc;
    newAcc += character.weekRaidGold;
    return newAcc;
  }, 0);

  let percentage = Number(((getWeekGold / totalWeekGold) * 100).toFixed(1));
  if (Number.isNaN(percentage)) {
    percentage = 0.0;
    getWeekGold = 0.0;
  }

  const updateDayTodoAllCharacters = useUpdateDayTodoAllCharacters({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });

      if (data && !data.done) {
        toast.success(
          `🎉 ${data.serverName} 서버 - 오늘 일일 숙제 완료! 수고 많으셨어요 🙌`,
          {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeButton: false,
          }
        );
      }
    },
  });

  return (
    <Wrapper>
      {totalDayGold > 0 && (
        <Box>
          <dt>
            <Tooltip
              title={<>{todoServer} 서버의 출력된 일일 숙제가 전체 체크됩니다.</>}
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -10],
                    },
                  },
                ],
              }}
            >
              <ResetButton
                onClick={() =>
                  updateDayTodoAllCharacters.mutate({
                    serverName: todoServer,
                    friendUsername: undefined,
                  })
                }
              >
                <p>👍 오.일.완</p>
              </ResetButton>
            </Tooltip>
            일일 수익
          </dt>
          <dd>
            <Gauge $process={(getDayGold / totalDayGold) * 100} $type="daily">
              <span>
                <em>{((getDayGold / totalDayGold) * 100).toFixed(1)} %</em>
              </span>
            </Gauge>
          </dd>
          <Gold>
            {getDayGold.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}{" "}
            /{" "}
            {totalDayGold.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}{" "}
            G
          </Gold>
        </Box>
      )}
      <Box>
        <dt>
          <ResetButton onClick={onSummaryClick}>
            <p>요약</p>
          </ResetButton>
          주간 수익
        </dt>
        <dd>
          <Gauge $process={percentage} $type="weekly">
            <span>
              <em>{percentage} %</em>
            </span>
          </Gauge>
        </dd>
        <Gold>
          {getWeekGold.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}{" "}
          /{" "}
          {totalWeekGold.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}{" "}
          G
        </Gold>
      </Box>
    </Wrapper>
  );
};

export default Profit;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const Box = styled.dl`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  min-width: 0; /* flex 아이템이 줄어들 수 있도록 허용 */
  overflow: hidden; /* 넘치는 내용 숨기기 */

  ${({ theme }) => theme.medias.max600} {
    flex-direction: column;
    gap: 8px;
    padding: 8px;
  }

  dt {
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.app.text.dark2};
    line-height: 1;
    margin-right: 10px;
    margin-left: 10px;
    white-space: nowrap; /* 텍스트 줄바꿈 방지 */
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    ${({ theme }) => theme.medias.max600} {
      margin: 0;
      font-size: 14px;
    }
  }

  dd {
    display: flex;
    flex-direction: column;
    margin-bottom: 2px;
    gap: 6px;
    margin-right: 10px;
    min-width: 0; /* flex 아이템이 줄어들 수 있도록 허용 */

    ${({ theme }) => theme.medias.max600} {
      margin: 0;
      width: 100%;
    }
  }
`;

const Gauge = styled.div<{ $process: number; $type: "daily" | "weekly" }>`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 5px auto;
  width: 250px;
  height: 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.main};
  flex-shrink: 0; /* 게이지가 줄어들지 않도록 */

  ${({ theme }) => theme.medias.max600} {
    width: 100%;
    max-width: 200px; /* 최대 너비 제한 */
    min-width: 120px; /* 최소 너비 보장 */
    margin: 0 auto;
  }

  span {
    width: ${({ $process }) => $process}%;
    height: 100%;
    background: ${({ $type, theme }) => {
      switch ($type) {
        case "daily":
          return theme.app.gauge.blue;
        case "weekly":
          return theme.app.gauge.red;
        default:
          return theme.app.palette.gray[0];
      }
    }};
    border-radius: 8px;

    em {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: ${({ theme }) => theme.app.text.dark2};
      font-size: 12px;
      line-height: 1;
      white-space: nowrap; /* 퍼센트 텍스트 줄바꿈 방지 */

      ${({ theme }) => theme.medias.max600} {
        font-size: 11px;
      }
    }
  }
`;

const Gold = styled.span`
  padding-left: 26px;
  line-height: 19px;
  background: url(${GoldIcon}) no-repeat;
  background-position: 0 0;
  font-size: 14px;
  white-space: nowrap; /* 골드 텍스트 줄바꿈 방지 */
  overflow: hidden; /* 넘치는 내용 숨기기 */
  text-overflow: ellipsis; /* 넘치는 텍스트에 ... 표시 */

  ${({ theme }) => theme.medias.max600} {
    font-size: 12px;
    padding-left: 22px;
    background-size: 18px;
  }
`;

const ResetButton = styled.button`
  padding: 6px 6px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.app.text.dark2};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  z-index: 1;
  flex-shrink: 0;
  margin-bottom: 2px;
  margin-right: 10px;

  ${({ theme }) => theme.medias.max600} {
    font-size: 12px;
    padding: 4px 4px;
  }

  &:hover {
    background: ${({ theme }) => theme.app.bg.main};
  }
`;
