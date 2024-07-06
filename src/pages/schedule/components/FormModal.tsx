import styled from "@emotion/styled";
import { Checkbox, FormControlLabel } from "@mui/material";
import { MdClose } from "@react-icons/all-files/md/MdClose";
import dayjs from "dayjs";
import { useState } from "react";
import type { ChangeEvent } from "react";

import useCreateSchedule from "@core/hooks/mutations/schedule/useCreateSchedule";
import useUpdateSchedule from "@core/hooks/mutations/schedule/useUpdateSchedule";
import useSchedule from "@core/hooks/queries/schedule/useSchedule";
import type { FormOptions, ScheduleRaidNames } from "@core/types/app";
import type { ScheduleCategory } from "@core/types/schedule";

import Modal from "@components/Modal";
import DatePicker from "@components/form/DatePicker";
import FriendsSelector from "@components/form/FriendsSelector";
import RadioButtons from "@components/form/RadioButtons";
import Select from "@components/form/Select";

interface Props {
  onClose: () => void;
  scheduleId?: number;
}

const raidOptions: FormOptions<ScheduleRaidNames> = [
  { value: "가디언 토벌", label: "가디언 토벌" },
  { value: "베히모스 노말", label: "베히모스 노말" },
  { value: "에키드나 하드", label: "에키드나 하드" },
  { value: "에키드나 노말", label: "에키드나 노말" },
  { value: "카멘 하드", label: "카멘 하드" },
  { value: "카멘 노말", label: "카멘 노말" },
  { value: "상아탑 하드", label: "상아탑 하드" },
  { value: "상아탑 노말", label: "상아탑 노말" },
  { value: "일리아칸 하드", label: "일리아칸 하드" },
  { value: "일리아칸 노말", label: "일리아칸 노말" },
  { value: "카양겔 노말", label: "카양겔 노말" },
  { value: "카양겔 하드", label: "카양겔 하드" },
  { value: "아브렐슈드 노말", label: "아브렐슈드 노말" },
  { value: "아브렐슈드 하드", label: "아브렐슈드 하드" },
  { value: "아브렐슈드 헬", label: "아브렐슈드 헬" },
  { value: "쿠크세이튼 노말", label: "쿠크세이튼 노말" },
  { value: "쿠크세이튼 헬", label: "쿠크세이튼 헬" },
  { value: "비아키스 노말", label: "비아키스 노말" },
  { value: "비아키스 하드", label: "비아키스 하드" },
  { value: "비아키스 헬", label: "비아키스 헬" },
  { value: "발탄 노말", label: "발탄 노말" },
  { value: "발탄 하드", label: "발탄 하드" },
  { value: "발탄 헬", label: "발탄 헬" },
  { value: "도전 가디언 토벌", label: "도전 가디언 토벌" },
  { value: "도전 어비스 던전", label: "도전 어비스 던전" },
  { value: "길드 토벌전", label: "길드 토벌전" },
  { value: "큐브", label: "큐브" },
  { value: "트라이", label: "트라이" },
  { value: "트라이 선생님", label: "트라이 선생님" },
  { value: "기타(메모작성)", label: "기타(메모작성)" },
];

const scheduleCategoryOptions: FormOptions<ScheduleCategory> = [
  { value: "ALONE", label: "내 일정" },
  { value: "PARTY", label: "깐부 일정" },
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

const FormModal = ({ onClose, scheduleId }: Props) => {
  const [name, setName] = useState<ScheduleRaidNames>("가디언 토벌");
  const [category, setCategory] = useState<ScheduleCategory>("PARTY");
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [date, setDate] = useState(dayjs());
  const [repeatWeek, setRepeatWeek] = useState(false);
  const [memo, setMemo] = useState("");

  return (
    <Modal isOpen onClose={onClose}>
      <Header>
        <Title>일정 추가</Title>
        <CloseButton onClick={onClose}>
          <MdClose />
        </CloseButton>
      </Header>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <table>
          <colgroup>
            <col width="100px" />
            <col width="auto" />
          </colgroup>
          <tbody>
            <tr>
              <th>레이드</th>
              <td>
                <Select
                  fullWidth
                  options={raidOptions}
                  value={name}
                  onChange={setName}
                />
              </td>
            </tr>
            <tr>
              <th>종류</th>
              <td>
                <Group>
                  {scheduleCategoryOptions.map((item) => {
                    return (
                      <Button
                        key={item.value}
                        isActive={item.value === category}
                        onClick={() => {
                          setCategory(item.value);
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
                {category === "ALONE" ? (
                  <Groups>
                    <DatePicker
                      disablePast
                      value={date}
                      onChange={(newDate) => {
                        const diff = dayjs(newDate).diff(date, "days");

                        if (newDate && !Number.isNaN(diff)) {
                          if (diff < 0) {
                            setDate(dayjs());
                          } else {
                            setDate(newDate);
                          }
                        } else {
                          setDate(dayjs());
                        }
                      }}
                    />
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
                ) : (
                  <>
                    <Groups>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) => setRepeatWeek(e.target.checked)}
                          />
                        }
                        checked={repeatWeek}
                        label="매주 반복"
                      />
                    </Groups>

                    <Groups>
                      <DatePicker
                        disablePast
                        value={date}
                        onChange={(newDate) => {
                          const diff = dayjs(newDate).diff(date, "days");

                          if (newDate && !Number.isNaN(diff)) {
                            if (diff < 0) {
                              setDate(dayjs());
                            } else {
                              setDate(newDate);
                            }
                          } else {
                            setDate(dayjs());
                          }
                        }}
                      />
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
                      <FriendsSelector
                        selectedId={[]}
                        setSelectedId={() => {}}
                      />
                    </Groups>
                  </>
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
