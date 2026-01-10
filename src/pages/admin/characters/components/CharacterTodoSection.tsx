import type { FC } from "react";

import { AdminBadge } from "@components/admin";
import type { AdminCharacterDayTodo, AdminCharacterWeekTodo } from "@core/types/admin";

import {
  ContentSection,
  ContentGrid,
  ContentColumn,
  ContentSubtitle,
  ContentItem,
  ContentName,
  ContentProgress,
  Divider,
  FormTitle,
} from "./CharacterDetailModal.styles";

interface Props {
  dayTodo: AdminCharacterDayTodo;
  weekTodo?: AdminCharacterWeekTodo;
}

const CharacterTodoSection: FC<Props> = ({ dayTodo, weekTodo }) => {
  return (
    <>
      <Divider />
      <ContentSection>
        <FormTitle>숙제 진행 현황</FormTitle>
        <ContentGrid>
          <ContentColumn>
            <ContentSubtitle>일일 콘텐츠</ContentSubtitle>
            <ContentItem>
              <ContentName>카오스던전</ContentName>
              <ContentProgress>{dayTodo.chaosCheck}/2</ContentProgress>
            </ContentItem>
            <ContentItem>
              <ContentName>가디언토벌</ContentName>
              <ContentProgress>{dayTodo.guardianCheck}/2</ContentProgress>
            </ContentItem>
            <ContentItem>
              <ContentName>에포나의뢰</ContentName>
              <ContentProgress>{dayTodo.eponaCheck}/3</ContentProgress>
            </ContentItem>
          </ContentColumn>
          {weekTodo && (
            <ContentColumn>
              <ContentSubtitle>주간 현황</ContentSubtitle>
              <ContentItem>
                <ContentName>주간 에포나</ContentName>
                <ContentProgress>{weekTodo.weekEpona}/3</ContentProgress>
              </ContentItem>
              <ContentItem>
                <ContentName>실마엘 혈석</ContentName>
                <AdminBadge variant={weekTodo.silmaelChange ? "success" : "gray"}>
                  {weekTodo.silmaelChange ? "교환" : "미교환"}
                </AdminBadge>
              </ContentItem>
              <ContentItem>
                <ContentName>큐브 티켓</ContentName>
                <ContentProgress>{weekTodo.cubeTicket}장</ContentProgress>
              </ContentItem>
            </ContentColumn>
          )}
        </ContentGrid>
      </ContentSection>
    </>
  );
};

export default CharacterTodoSection;
