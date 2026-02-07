import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import styled from "styled-components";

import useUpdateInspectionSchedule from "@core/hooks/mutations/inspection/useUpdateInspectionSchedule";
import useInspectionSchedule from "@core/hooks/queries/inspection/useInspectionSchedule";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import Modal from "@components/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleSettingsModal = ({ isOpen, onClose }: Props) => {
  const queryClient = useQueryClient();
  const { data } = useInspectionSchedule();
  const [scheduleHour, setScheduleHour] = useState(7);

  useEffect(() => {
    if (data) {
      setScheduleHour(data.scheduleHour);
    }
  }, [data]);

  const updateSchedule = useUpdateInspectionSchedule({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getInspectionSchedule(),
      });
      toast.success("수집 시간이 변경되었습니다.");
      onClose();
    },
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Modal title="수집 시간 설정" isOpen={isOpen} onClose={onClose}>
      <Form>
        <Description>
          매일 설정한 시간에 등록된 캐릭터의 데이터를 자동으로 수집합니다.
        </Description>

        <FieldGroup>
          <Label>수집 시간 (KST)</Label>
          <Select
            value={scheduleHour}
            onChange={(e) => setScheduleHour(Number(e.target.value))}
          >
            {hours.map((h) => (
              <option key={h} value={h}>
                {h.toString().padStart(2, "0")}:00
              </option>
            ))}
          </Select>
        </FieldGroup>

        <ButtonGroup>
          <Button
            variant="contained"
            onClick={() => updateSchedule.mutate({ scheduleHour })}
            disabled={updateSchedule.isPending}
          >
            저장
          </Button>
          <Button variant="outlined" onClick={onClose}>
            취소
          </Button>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};

export default ScheduleSettingsModal;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 300px;

  ${({ theme }) => theme.medias.max500} {
    min-width: unset;
  }
`;

const Description = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};
  line-height: 1.5;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark2};
`;

const Select = styled.select`
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  appearance: none;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.app.text.light1};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;
