import type React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '@components/Modal'; // Assuming a generic Modal component exists
import useCharacters from '@core/hooks/queries/character/useCharacters';
import { toast } from 'react-toastify';
import queryClient from '@core/lib/queryClient';
import queryKeyGenerator from '@core/utils/queryKeyGenerator';
import { useSaveEtcLog } from '@core/hooks/mutations/logs.mutations';

interface EtcLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EtcLogModal: React.FC<EtcLogModalProps> = ({ isOpen, onClose }) => {
  const [characterId, setCharacterId] = useState<number | undefined>(undefined);
  const [localDate, setLocalDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');
  const [profit, setProfit] = useState(0);

  const { data: characters } = useCharacters();
  const saveEtcLogMutation = useSaveEtcLog();

  const handleSubmit = (isExpenditure: boolean) => {
    if (!characterId) {
      toast.error('캐릭터를 선택해주세요.');
      return;
    }
    if (!message) {
      toast.error('메시지를 입력해주세요.');
      return;
    }

    const finalProfit = isExpenditure ? -Math.abs(profit) : Math.abs(profit);

    saveEtcLogMutation.mutate(
      {
        characterId,
        localDate,
        message,
        profit: finalProfit,
      },
      {
        onSuccess: () => {
          toast.success('로그가 성공적으로 저장되었습니다.');
          queryClient.invalidateQueries({ queryKey: queryKeyGenerator.getLogs() });
          onClose();
        },
        onError: () => {
          toast.error('로그 저장에 실패했습니다.');
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="기타 수익/지출 남기기">
      <Form>
        <FormGroup>
          <Label>캐릭터 선택</Label>
          <Select onChange={(e) => setCharacterId(Number(e.target.value))}>
            <option value="">캐릭터 선택</option>
            {characters?.map((char) => (
              <option key={char.characterId} value={char.characterId}>
                {char.serverName} | {char.characterName} | {char.itemLevel} | {char.characterClassName}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>날짜</Label>
          <Input type="date" value={localDate} onChange={(e) => setLocalDate(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>메시지</Label>
          <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="예: 생기 녹이기" />
        </FormGroup>
        <FormGroup>
          <Label>수익/지출</Label>
          <Input type="number" value={profit} onChange={(e) => setProfit(Number(e.target.value))} />
        </FormGroup>
        <ButtonWrapper>
          <Button onClick={() => handleSubmit(false)}>획득했습니다.</Button>
          <Button onClick={() => handleSubmit(true)} isExpenditure>
            소모했습니다.
          </Button>
        </ButtonWrapper>
      </Form>
    </Modal>
  );
};

export default EtcLogModal;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.black};
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.black};
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.black};
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

const Button = styled.button<{
  isExpenditure?: boolean;
}>`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ isExpenditure }) => (isExpenditure ? '#ef4444' : '#3b82f6')};
  color: white;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;
