import { Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
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
}

const Profit: FC<Props> = ({ characters }) => {
  const queryClient = useQueryClient();
  const [todoServer, setTodoServer] = useAtom(todoServerAtom);
  // 1. 예상 일일 수익
  const totalDayGold = characters.reduce((acc, character) => {
    let newAcc = acc;

    if (
      character.settings.showChaos &&
      character.beforeChaosGauge >= character.settings.thresholdChaos
    ) {
      newAcc += character.chaosGold;
    }

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

    if (character.chaosCheck >= 1) {
      for (let i = 0; i < character.chaosCheck; i += 1) {
        newAcc += character.chaosGold / 2;
      }
    }

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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              lineHeight: 1.5,
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: 600,
                marginBottom: "4px",
                marginLeft: "-22px",
              }}
            >
              🎉 {data.serverName} 서버
            </div>
            <div style={{ fontSize: "14px" }}>
              오늘 일일 숙제 완료! 수고 많으셨어요 🙌
            </div>
          </div>,
          {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeButton: false,
            style: {
              background: "#2E7D32",
              color: "#fff",
              borderRadius: "10px",
              padding: "14px 20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          }
        );
      }
    },
  });

  return (
    <Wrapper>
      <Box>
        {/* <Tooltip
          title={<>출력된 일일 숙제가 전체 체크됩니다.</>}
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
            <p>{todoServer} 서버</p>
            <p>👍 오.일.완</p>
          </ResetButton>
        </Tooltip> */}
        <dt>일일 수익</dt>
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
      <Box>
        <dt>주간 수익</dt>
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
  flex-direction: row;
  gap: 8px;
  width: 100%;

  ${({ theme }) => theme.medias.max900} {
    flex-direction: column;
  }
`;

const Box = styled.dl`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;

  dt {
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.app.text.dark2};
    line-height: 1;
  }

  dd {
    display: flex;
    flex-direction: column;
    margin-bottom: 2px;
    gap: 8px;
    width: 100%;
  }
`;

const Gauge = styled.div<{ $process: number; $type: "daily" | "weekly" }>`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 5px auto 0;
  width: 350px;
  height: 18px;
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.main};

  ${({ theme }) => theme.medias.max600} {
    width: 90%;
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
      font-size: 13px;
      line-height: 1;
    }
  }
`;

const Gold = styled.span`
  padding-left: 26px;
  line-height: 19px;
  background: url(${GoldIcon}) no-repeat;
  background-position: 0 0;
  font-size: 14px;
`;

const ResetButton = styled.button`
  position: absolute;
  top: 6px;
  right: 16px;
  padding: 8px 16px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.app.text.dark2};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  &:hover {
    background: ${({ theme }) => theme.app.bg.main};
  }
`;
