import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import useRefreshInspectionCharacter from "@core/hooks/mutations/inspection/useRefreshInspectionCharacter";
import useInspectionCharacters from "@core/hooks/queries/inspection/useInspectionCharacters";
import useModalState from "@core/hooks/useModalState";
import type { InspectionCharacter } from "@core/types/inspection";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";

import DefaultLayout from "@layouts/DefaultLayout";

import AddCharacterModal from "./components/AddCharacterModal";
import CombatPowerChart from "./components/CombatPowerChart";
import ArkgridEffectsTable from "./components/ArkgridEffectsTable";
import EquipmentCompareTable from "./components/EquipmentCompareTable";
import InspectionCharacterCard from "./components/InspectionCharacterCard";
import InspectionSettingsModal from "./components/InspectionSettingsModal";
import ScheduleSettingsModal from "./components/ScheduleSettingsModal";

const InspectionIndex = () => {
  const queryClient = useQueryClient();
  const getCharacters = useInspectionCharacters();

  const [addModal, toggleAddModal] = useModalState<boolean>();
  const [settingsTarget, setSettingsTarget] =
    useModalState<InspectionCharacter>();
  const [scheduleModal, toggleScheduleModal] = useModalState<boolean>();
  const [selectedCharacter, setSelectedCharacter] =
    useState<InspectionCharacter | null>(null);
  const [refreshingId, setRefreshingId] = useState<number | null>(null);

  const refreshCharacter = useRefreshInspectionCharacter({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getInspectionCharacters(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getInspectionDetail({
          id: data.character.id,
        }),
      });
      toast.success(
        `${data.character.characterName} 데이터가 갱신되었습니다.`
      );
      setRefreshingId(null);
    },
    onError: () => {
      setRefreshingId(null);
    },
  });

  const handleRefresh = (id: number) => {
    setRefreshingId(id);
    refreshCharacter.mutate(id);
  };

  const handleInvalidate = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeyGenerator.getInspectionCharacters(),
    });
  };

  const characters = getCharacters.data ?? [];

  return (
    <DefaultLayout pageTitle="군장검사">
      <TopActions>
        <Button variant="contained" onClick={() => toggleAddModal(true)}>
          캐릭터 등록
        </Button>
        <Button variant="outlined" onClick={() => toggleScheduleModal(true)}>
          수집 시간 설정
        </Button>
      </TopActions>

      {characters.length === 0 && !getCharacters.isLoading && (
        <EmptyMessage>
          등록된 캐릭터가 없습니다. 캐릭터를 등록해 주세요.
        </EmptyMessage>
      )}

      <CharacterGrid>
        {characters.map((character, index) => (
          <InspectionCharacterCard
            key={character.id}
            character={character}
            onRefresh={handleRefresh}
            onOpenSettings={setSettingsTarget}
            onSelect={setSelectedCharacter}
            isRefreshing={refreshingId === character.id}
            isSelected={selectedCharacter?.id === character.id}
            colorIndex={index}
          />
        ))}
      </CharacterGrid>

      {characters.length > 0 && (
        <ChartSection>
          <CombatPowerChart characters={characters} />
        </ChartSection>
      )}

      {selectedCharacter && (
        <DetailSection>
          <DetailHeader>
            <DetailTitle>
              {selectedCharacter.characterName} 상세
            </DetailTitle>
            <Button
              variant="outlined"
              onClick={() => setSelectedCharacter(null)}
            >
              닫기
            </Button>
          </DetailHeader>

          <EquipmentCompareTable
            inspectionCharacterId={selectedCharacter.id}
          />

          <ArkgridEffectsTable
            inspectionCharacterId={selectedCharacter.id}
          />
        </DetailSection>
      )}

      <AddCharacterModal
        isOpen={!!addModal}
        onClose={() => toggleAddModal()}
        onSuccess={handleInvalidate}
      />

      {settingsTarget && (
        <InspectionSettingsModal
          isOpen={!!settingsTarget}
          character={settingsTarget}
          onClose={() => setSettingsTarget()}
          onSuccess={handleInvalidate}
        />
      )}

      <ScheduleSettingsModal
        isOpen={!!scheduleModal}
        onClose={() => toggleScheduleModal()}
      />
    </DefaultLayout>
  );
};

export default InspectionIndex;

const TopActions = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const EmptyMessage = styled.p`
  padding: 40px 0;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;

  ${({ theme }) => theme.medias.max600} {
    grid-template-columns: 1fr;
  }
`;

const ChartSection = styled.section`
  margin-top: 24px;
`;

const DetailSection = styled.section`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DetailTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.main};
`;
