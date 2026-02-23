import styled, { css } from "styled-components";

export const RaidCategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
`;

export const Wrapper = styled.div`
  width: 100%;
  max-width: 520px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark2};
`;

export const CloseButton = styled.button`
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

export const Form = styled.form`
  table {
    width: 100%;
    border-top: 1px solid ${({ theme }) => theme.app.palette.gray[800]};

    tbody {
      tr {
        border-bottom: 1px solid ${({ theme }) => theme.app.border};

        th {
          padding: 8px 12px;
          background: ${({ theme }) => theme.app.palette.gray[800]};
          color: ${({ theme }) => theme.app.palette.gray[0]};
          text-align: left;
        }
        td {
          padding: 8px;
        }
      }
    }
  }
`;

export const Groups = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;

  ${({ theme }) => theme.medias.max500} {
    flex-direction: column;
    align-items: flex-start;
  }

  * + & {
    margin-top: 12px;
  }
`;

export const Group = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;

  ${Groups} + & {
    margin-top: 12px;
  }
`;

export const Input = styled.input`
  padding: 4px 8px;
  width: 100%;
  height: 36px;
  border-radius: 6px;
  font-size: 15px;
  line-height: 1.5;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
`;

export const Textarea = styled.textarea`
  display: block;
  padding: 4px 8px;
  width: 100%;
  height: 200px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
`;

export const BottomButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 12px;
  width: 100%;
  margin-top: 16px;
`;

export const bottomButtonCss = css`
  padding: 12px 32px;
`;

export const OnlyText = styled.div`
  padding: 0 4px;
`;

export const Message = styled.p`
  margin: 10px 0;
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 14px;
`;

export const ReadOnlyFriendCharacter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
`;
