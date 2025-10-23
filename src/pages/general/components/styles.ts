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
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid
    ${({ theme, $isActive }) =>
      $isActive ? theme.app.border : theme.app.bg.gray2};
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.app.bg.gray1 : theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-start;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
    transform: translateY(-1px);
    box-shadow: 0 12px 18px rgba(15, 23, 42, 0.08);
  }

  svg {
    flex-shrink: 0;
  }
`;
