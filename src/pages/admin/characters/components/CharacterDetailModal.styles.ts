import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(2px);
`;

export const Modal = styled.div`
  background: ${({ theme }) => theme.app.bg.white};
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: ${({ theme }) => theme.app.text.light1};
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.app.border};
`;

export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 0;
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.app.text.light1};
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.app.bg.gray1};
    color: ${({ theme }) => theme.app.text.main};
  }
`;

export const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.gray1};
`;

export const DeleteActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  margin: 20px 0;
`;

// Character Header
export const CharacterHeader = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const CharacterAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: white;
`;

export const CharacterMainInfo = styled.div`
  flex: 1;
`;

export const CharacterNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const CharacterName = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

export const CharacterSubInfo = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light1};
  margin: 0 0 4px 0;
`;

export const ItemLevel = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.main};
  margin: 0;
`;

// Info Section
export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
`;

export const InfoLabel = styled.span`
  width: 100px;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  flex-shrink: 0;
`;

export const InfoValue = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.main};
`;

// Form Section
export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const FormTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 0 0 4px 0;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 24px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.light1};
`;

export const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

export const ToggleWrapper = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  overflow: hidden;
`;

export const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active }) =>
    $active ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? "white" : theme.app.text.main};

  &:hover {
    background: ${({ $active, theme }) =>
      $active
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        : theme.app.bg.gray1};
  }
`;

export const NumberInput = styled.input`
  width: 80px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

// Content Section
export const ContentSection = styled.div``;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 12px;
`;

export const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ContentSubtitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light1};
  margin: 0 0 4px 0;
`;

export const ContentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 8px;
`;

export const ContentName = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.main};
`;

export const ContentProgress = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.main};
`;
