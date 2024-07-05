import styled from "@emotion/styled";
import { MdClose } from "@react-icons/all-files/md/MdClose";

import useCreateSchedule from "@core/hooks/mutations/schedule/useCreateSchedule";
import useUpdateSchedule from "@core/hooks/mutations/schedule/useUpdateSchedule";
import useSchedule from "@core/hooks/queries/schedule/useSchedule";

import Modal from "@components/Modal";

interface Props {
  onClose: () => void;
  scheduleId?: number;
}

const FormModal = ({ onClose, scheduleId }: Props) => {
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
              <td />
            </tr>
            <tr>
              <th>종류</th>
              <td />
            </tr>
            <tr>
              <th>시간</th>
              <td />
            </tr>
            <tr>
              <th>메모</th>
              <td />
            </tr>
          </tbody>
        </table>

        <Buttons>
          <button type="button" onClick={onClose}>
            취소
          </button>
          <button type="submit">저장</button>
        </Buttons>
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
          width: 478px;
        }
      }
    }
  }
`;

const Buttons = styled.div`
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
