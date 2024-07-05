import styled from "@emotion/styled";

import DefaultLayout from "@layouts/DefaultLayout";

import useSchedules from "@core/hooks/queries/schedule/useSchedules";
import useModalState from "@core/hooks/useModalState";

import FormModal from "./components/FormModal";

const ScheduleIndex = () => {
  const getSchedules = useSchedules();
  console.log(getSchedules.data);

  const [createModal, setCreateModal] = useModalState<boolean>();

  return (
    <DefaultLayout pageTitle="일정">
      <Wrapper>
        <Buttons>
          <CreateButton onClick={() => setCreateModal(true)}>
            일정추가
          </CreateButton>
        </Buttons>
      </Wrapper>

      {createModal && <FormModal onClose={() => setCreateModal()} />}
    </DefaultLayout>
  );
};

export default ScheduleIndex;

const Wrapper = styled.div`
  padding: 24px;
  width: 100%;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.light};
  overflow: hidden;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const CreateButton = styled.button`
  padding: 0 32px;
  line-height: 48px;
  border-radius: 12px;
  background: ${({ theme }) => theme.app.semiBlack1};
  color: ${({ theme }) => theme.app.white};
  font-weight: 600;
`;
