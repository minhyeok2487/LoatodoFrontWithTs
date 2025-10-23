import styled from "styled-components";

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.main};
  margin: 0;
`;

export const PlaceholderMessage = styled.p`
  margin: 0;
  padding: 12px;
  border-radius: 6px;
  background: ${({ theme }) => theme.app.bg.gray1};
  color: ${({ theme }) => theme.app.text.light1};
  text-align: center;
`;

export const SelectionButton = styled.button<{ $isActive: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid
    ${({ theme, $isActive }) =>
      $isActive ? theme.app.border : theme.app.bg.gray2};
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.app.bg.gray1 : theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  text-align: left;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
  }
`;
