import { MdClose } from "@react-icons/all-files/md/MdClose";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import useCreateSchedule from "@core/hooks/mutations/schedule/useCreateSchedule";
import useUpdateSchedule from "@core/hooks/mutations/schedule/useUpdateSchedule";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useWeekRaidCategories from "@core/hooks/queries/content/useWeekRaidCategories";
import useMyInformation from "@core/hooks/queries/member/useMyInformation";
import useSchedule from "@core/hooks/queries/schedule/useSchedule";
import type { FormOptions } from "@core/types/app";
import type {
  ScheduleCategory,
  ScheduleRaidCategory,
  Weekday,
} from "@core/types/schedule";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Modal from "@components/Modal";
import Checkbox from "@components/form/Checkbox";
import DatePicker from "@components/form/DatePicker";
import FriendsSelector from "@components/form/FriendsSelector";
import Select from "@components/form/Select";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  scheduleId?: number;
}

const scheduleRaidCategoryOptions: FormOptions<ScheduleRaidCategory> = [
  { value: "GUARDIAN", label: "가디언 토벌" },
  { value: "RAID", label: "레이드" },
  { value: "ETC", label: "기타" },
];

const scheduleCategoryOptions: FormOptions<ScheduleCategory> = [
  { value: "ALONE", label: "내 일정" },
  { value: "PARTY", label: "깐부 일정" },
];

const weekdayOptions: FormOptions<Weekday> = [
  { value: "MONDAY", label: "월" },
  { value: "TUESDAY", label: "화" },
  { value: "WEDNESDAY", label: "수" },
  { value: "THURSDAY", label: "목" },
  { value: "FRIDAY", label: "금" },
  { value: "SATURDAY", label: "토" },
  { value: "SUNDAY", label: "일" },
];

const hourOptions: FormOptions<number> = [
  { value: 0, label: "AM 12" },
  { value: 1, label: "AM 01" },
  { value: 2, label: "AM 02" },
  { value: 3, label: "AM 03" },
  { value: 4, label: "AM 04" },
  { value: 5, label: "AM 05" },
  { value: 6, label: "AM 06" },
  { value: 7, label: "AM 07" },
  { value: 8, label: "AM 08" },
  { value: 9, label: "AM 09" },
  { value: 10, label: "AM 10" },
  { value: 11, label: "AM 11" },
  { value: 12, label: "PM 12" },
  { value: 13, label: "PM 01" },
  { value: 14, label: "PM 02" },
  { value: 15, label: "PM 03" },
  { value: 16, label: "PM 04" },
  { value: 17, label: "PM 05" },
  { value: 18, label: "PM 06" },
  { value: 19, label: "PM 07" },
  { value: 20, label: "PM 08" },
  { value: 21, label: "PM 09" },
  { value: 22, label: "PM 10" },
  { value: 23, label: "PM 11" },
];

const minuteOptions: FormOptions<number> = [
  { value: 0, label: "00" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 30, label: "30" },
  { value: 40, label: "40" },
  { value: 50, label: "50" },
];

const getWeekdayString = (weekday: number): Weekday => {
  switch (weekday) {
    case 1:
      return "MONDAY";
    case 2:
      return "TUESDAY";
    case 3:
      return "WEDNESDAY";
    case 4:
      return "THURSDAY";
    case 5:
      return "FRIDAY";
    case 6:
      return "SATURDAY";
    default:
      return "SUNDAY";
  }
};

const FormModal = ({ isOpen, onClose, scheduleId }: Props) => {
  const queryClient = useQueryClient();

  const [leaderCharacterId, setLeaderCharacterId] = useState<number | "">("");
  const [scheduleRaidCategory, setScheduleRaidCategory] = useState<
    ScheduleRaidCategory | ""
  >("");
  const [targetRaidCategoryId, setTargetRaidCategoryId] = useState<number | "">(
    ""
  );
  const [raidNameInput, setRaidNameInput] = useState("");
  const [scheduleCategory, setScheduleCategory] =
    useState<ScheduleCategory>("ALONE");
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [weekday, setWeekday] = useState<Weekday>("MONDAY");
  const [repeatWeek, setRepeatWeek] = useState(false);
  const [friendsId, setFriendsId] = useState<number[]>([]);
  const [memo, setMemo] = useState("");

  const getSchedule = useSchedule(scheduleId as number, {
    enabled: !!scheduleId,
  });
  const getWeekRaidCategories = useWeekRaidCategories();
  const getCharacters = useCharacters();
  const createSchedule = useCreateSchedule({
    onSuccess: () => {
      toast("일정 등록이 완료되었습니다.");
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getSchedules(),
      });
      onClose();
    },
  });

  useEffect(() => {
    // 팝업 닫을 시 초기화
    if (!isOpen) {
      setLeaderCharacterId("");
      setScheduleRaidCategory("");
      setTargetRaidCategoryId("");
      setScheduleCategory("ALONE");
      setRaidNameInput("");
      setHour(0);
      setMinute(0);
      setWeekday("MONDAY");
      setRepeatWeek(false);
      setFriendsId([]);
      setMemo("");
    }
  }, [isOpen]);

  if (!getCharacters.data || !getWeekRaidCategories.data) {
    return null;
  }

  const targetLeaderCharacter = getCharacters.data.find(
    (item) => item.characterId === leaderCharacterId
  );
  const targetRaidCategory = getWeekRaidCategories.data.find(
    (item) => item.categoryId === targetRaidCategoryId
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Header>
        <Title>일정 추가</Title>
        <CloseButton onClick={onClose}>
          <MdClose />
        </CloseButton>
      </Header>

      <Form
        onSubmit={(e) => {
          e.preventDefault();

          if (!scheduleRaidCategory) {
            toast.error("레이드를 선택해주세요.");
            return;
          }
          if (scheduleRaidCategory === "RAID" && !targetRaidCategoryId) {
            toast.error("레이드 명을 선택해주세요.");
            return;
          }
          if (scheduleRaidCategory === "ETC" && !raidNameInput) {
            toast.error("레이드 명을 입력해주세요.");
            return;
          }

          if (scheduleId === undefined) {
            createSchedule.mutate({
              scheduleRaidCategory,
              raidName: (() => {
                switch (scheduleRaidCategory) {
                  case "GUARDIAN":
                    return "가디언 토벌";
                  case "RAID":
                    return `${targetRaidCategory?.name} ${targetRaidCategory?.weekContentCategory}`;
                  default:
                    return raidNameInput;
                }
              })(),
              raidLevel:
                scheduleRaidCategory === "RAID"
                  ? (targetRaidCategory?.level as number)
                  : undefined,
              scheduleCategory,
              dayOfWeek: weekday,
              time: dayjs()
                .set("hour", hour)
                .set("minute", minute)
                .format("HH:mm"),
              repeatWeek,
              leaderCharacterId: getCharacters.data.find(
                (item) => item.characterId === leaderCharacterId
              )?.characterId as number,
              friendCharacterIdList: friendsId,
              memo,
            });
          }
        }}
      >
        <table>
          <colgroup>
            <col width="100px" />
            <col width="auto" />
          </colgroup>
          <tbody>
            <tr>
              <th>캐릭터</th>
              <td>
                <Select
                  fullWidth
                  options={getCharacters.data.map((item) => ({
                    value: item.characterId,
                    label: `[${item.itemLevel} ${item.characterClassName}] ${item.characterName}`,
                  }))}
                  value={leaderCharacterId}
                  onChange={setLeaderCharacterId}
                  placeholder="대상 캐릭터"
                />
              </td>
            </tr>
            <tr>
              <th>일정 종류</th>
              <td>
                <Select
                  fullWidth
                  disabled={!targetLeaderCharacter}
                  options={scheduleRaidCategoryOptions}
                  value={scheduleRaidCategory}
                  onChange={setScheduleRaidCategory}
                  placeholder="일정 종류"
                />
              </td>
            </tr>
            {scheduleRaidCategory === "RAID" && (
              <tr>
                <th>레이드 명</th>
                <td>
                  <Select
                    fullWidth
                    options={getWeekRaidCategories.data
                      .filter(
                        (item) =>
                          item.level <=
                          (targetLeaderCharacter?.itemLevel as number)
                      )
                      .map((item) => ({
                        value: item.categoryId,
                        label: `${item.name} ${item.weekContentCategory}`,
                      }))}
                    value={targetRaidCategoryId}
                    onChange={setTargetRaidCategoryId}
                    placeholder="레이드 명"
                  />
                </td>
              </tr>
            )}
            {scheduleRaidCategory === "ETC" && (
              <tr>
                <th>레이드 명</th>
                <td>
                  <Input
                    onChange={(e) => setRaidNameInput(e.target.value)}
                    value={raidNameInput}
                    placeholder="레이드 명을 입력해주세요."
                  />
                </td>
              </tr>
            )}
            <tr>
              <th>종류</th>
              <td>
                <Group>
                  {scheduleCategoryOptions.map((item) => {
                    return (
                      <Button
                        key={item.value}
                        type="button"
                        isActive={item.value === scheduleCategory}
                        onClick={() => {
                          setScheduleCategory(item.value);
                        }}
                      >
                        {item.label}
                      </Button>
                    );
                  })}
                </Group>
              </td>
            </tr>
            <tr>
              <th>시간</th>
              <td>
                <Groups>
                  <Select
                    options={weekdayOptions}
                    value={weekday}
                    onChange={setWeekday}
                  />
                  요일
                  <Select
                    options={hourOptions}
                    value={hour}
                    onChange={setHour}
                  />
                  :
                  <Select
                    options={minuteOptions}
                    value={minute}
                    onChange={setMinute}
                  />
                </Groups>

                <Groups>
                  <Checkbox onChange={setRepeatWeek} checked={repeatWeek}>
                    매주 반복
                  </Checkbox>
                </Groups>

                {scheduleCategory === "PARTY" && (
                  <Groups>
                    <FriendsSelector
                      selectedId={friendsId}
                      setSelectedId={setFriendsId}
                    />
                  </Groups>
                )}
              </td>
            </tr>
            <tr>
              <th>메모</th>
              <td>
                <Textarea
                  placeholder="메모를 입력해주세요"
                  onChange={(e) => setMemo(e.target.value)}
                  value={memo}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <BottomButtons>
          <button type="button" onClick={onClose}>
            취소
          </button>
          <button type="submit">저장</button>
        </BottomButtons>
      </Form>
    </Modal>
  );
};

export default FormModal;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark2};
`;

const CloseButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 14px;
  background: ${({ theme }) => theme.app.bg.gray1};
  color: ${({ theme }) => theme.app.text.light2};
`;

const Form = styled.form`
  table {
    width: 100%;
    border-top: 1px solid ${({ theme }) => theme.app.semiBlack1};

    tbody {
      tr {
        border-bottom: 1px solid ${({ theme }) => theme.app.border};

        th {
          padding: 8px 12px;
          background: ${({ theme }) => theme.app.semiBlack1};
          color: ${({ theme }) => theme.app.white};
          text-align: left;
        }
        td {
          padding: 8px;
        }
      }
    }
  }
`;

const Groups = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;

  & + & {
    margin-top: 12px;
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const Button = styled.button<{ isActive: boolean }>`
  padding: 0 12px;
  line-height: 30px;
  border-radius: 6px;
  font-size: 15px;
  background: ${({ isActive, theme }) =>
    isActive ? theme.app.semiBlack1 : theme.app.bg.light};
  border: 1px solid
    ${({ isActive, theme }) =>
      isActive ? theme.app.semiBlack1 : theme.app.border};
  color: ${({ isActive, theme }) =>
    isActive ? theme.app.white : theme.app.text.dark1};
`;

const Input = styled.input`
  padding: 4px 8px;
  width: 100%;
  height: 36px;
  border-radius: 6px;
  font-size: 15px;
  line-height: 1.5;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.light};
`;

const Textarea = styled.textarea`
  display: block;
  padding: 4px 8px;
  width: 100%;
  height: 115px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.light};
`;

const BottomButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 12px;
  width: 100%;
  margin-top: 16px;

  button {
    padding: 0 32px;
    line-height: 48px;
    border: 1px solid ${({ theme }) => theme.app.border};
    border-radius: 12px;
    color: ${({ theme }) => theme.app.text.dark2};

    &[type="submit"] {
      background: ${({ theme }) => theme.app.semiBlack1};
      color: ${({ theme }) => theme.app.white};
    }
  }
`;
