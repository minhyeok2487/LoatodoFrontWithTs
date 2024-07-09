import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import useSchedules from "@core/hooks/queries/schedule/useSchedules";
import useModalState from "@core/hooks/useModalState";
import { Weekday } from "@core/types/schedule";

import FormModal from "./components/FormModal";

const ScheduleIndex = () => {
  const getSchedules = useSchedules();

  const [createModal, setCreateModal] = useModalState<boolean>();

  return (
    <DefaultLayout pageTitle="일정">
      <Wrapper>
        <DateWrapper>
          <DateItem $weekday="WEDNESDAY">
            <strong>26일(수)</strong>
          </DateItem>
        </DateWrapper>

        <Buttons>
          <CreateButton onClick={() => setCreateModal(true)}>
            일정추가
          </CreateButton>
        </Buttons>
      </Wrapper>

      <FormModal isOpen={!!createModal} onClose={() => setCreateModal()} />
    </DefaultLayout>
  );
};

export default ScheduleIndex;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  width: 100%;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.light};
  overflow: hidden;
`;

const DateWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const DateItem = styled.div<{ $weekday: Weekday }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 500px;
  border: 1px solid ${({ theme }) => theme.app.border};

  strong {
    padding: 4px 0;
    width: 100%;
    font-size: 16px;
    text-align: center;
    border-bottom: 1px solid ${({ theme }) => theme.app.border};
    background: ${({ theme }) => theme.app.bg.main};
    color: ${({ $weekday, theme }) => {
      switch ($weekday) {
        case "SATURDAY":
          return theme.app.red;
        case "SUNDAY":
          return theme.app.blue1;
        default:
          return theme.app.text.black;
      }
    }};
  }

  ul {
    display: flex;
    flex-direction: column;
  }
`;

const ScheduleItem = styled.li`
  display: flex;
  flex-direction: column;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 16px;
`;

const CreateButton = styled.button`
  padding: 0 32px;
  line-height: 48px;
  border-radius: 12px;
  background: ${({ theme }) => theme.app.semiBlack1};
  color: ${({ theme }) => theme.app.white};
  font-weight: 600;
`;
