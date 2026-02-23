import styled from "styled-components";

export const FormLayout = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormFieldLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

export const FormTextInput = styled.input`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.dark1};
  background: ${({ theme }) => theme.app.bg.white};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FormFieldMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light1};
`;

export const FormActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
