import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import type { Character } from "@core/types/character";

import Button from "@components/Button";
import Modal from "@components/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
}

const UncheckedSummaryModal = ({ isOpen, onClose, characters }: Props) => {
  const uncheckedText = useMemo(() => {
    let text = "";
    characters.forEach((character) => {
      const uncheckedItems: string[] = [];
      const { settings } = character;

      if (settings.showChaos && character.chaosCheck === 0) {
        uncheckedItems.push("- 카오스 던전");
      }
      if (settings.showGuardian && character.guardianCheck === 0) {
        uncheckedItems.push("- 가디언 토벌");
      }
      if (settings.showWeekEpona && character.weekEpona < 3) {
        uncheckedItems.push("- 주간 에포나");
      }
      if (settings.showSilmaelChange && !character.silmaelChange) {
        uncheckedItems.push("- 실마엘 혈석 교환");
      }
      if (settings.showWeekTodo) {
        character.todoList.forEach((raid) => {
          if (!raid.check) {
            uncheckedItems.push(`- ${raid.name.replace(/<br \/>/g, " ")}`);
          }
        });
      }

      if (uncheckedItems.length > 0) {
        text += `[${character.characterName} Lv.${character.itemLevel}]\n`;
        text += uncheckedItems.join("\n");
        text += "\n\n";
      }
    });
    return text;
  }, [characters]);

  const [editableSummary, setEditableSummary] = useState(uncheckedText);

  useEffect(() => {
    setEditableSummary(uncheckedText);
  }, [uncheckedText]);

  const allDone = uncheckedText.length === 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(editableSummary);
    toast.success("복사되었습니다.");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="미완료 숙제 요약">
      <Wrapper>
        {allDone ? (
          <AllDoneMessage>🎉 모든 숙제를 완료했습니다! 🎉</AllDoneMessage>
        ) : (
          <>
            <SummaryTextArea
              value={editableSummary}
              onChange={(e) => setEditableSummary(e.target.value)}
            />
            <Button onClick={handleCopy}>복사하기</Button>
          </>
        )}
      </Wrapper>
    </Modal>
  );
};

export default UncheckedSummaryModal;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 350px;
  max-height: 500px;
  overflow-y: auto;
  padding: 8px;
`;

const SummaryTextArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.gray1};
  color: ${({ theme }) => theme.app.text.main};
  font-size: 16px;
  resize: none;
  line-height: 1.6;
`;

const AllDoneMessage = styled.div`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  padding: 40px 20px;
  color: ${({ theme }) => theme.app.text.main};
`;
