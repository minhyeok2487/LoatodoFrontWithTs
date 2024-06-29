import styled from "@emotion/styled";
import { Viewer } from "@toast-ui/react-editor";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import DefaultLayout from "@layouts/DefaultLayout";

import { themeAtom } from "@core/atoms/theme.atom";
import useNotice from "@core/hooks/queries/notice/useNotice";
import useToastUiDarkMode from "@core/hooks/useToastUiDarkMode";

const Board = () => {
  const { no } = useParams();
  const getNotice = useNotice(parseInt(no || "1", 10), { enabled: !!no });
  const theme = useRecoilValue(themeAtom);

  useToastUiDarkMode();

  if (!getNotice.data) {
    return null;
  }

  return (
    <DefaultLayout>
      <Wrapper>
        <TitleBox>
          <Title>공지 | {getNotice.data.title}</Title>
          <CreatedAt>
            {dayjs(getNotice.data.regDate).format("YYYY. M. D A HH:mm:ss")}
          </CreatedAt>
        </TitleBox>
        <DescriptionBox>
          {getNotice.data.content && (
            <Viewer
              initialValue={getNotice.data.content}
              // toastui 컴포넌트 theme값은 최초 렌더링 시에만 반영 되는 이슈가 있어 useToastUiDarkMode 커스텀 훅 사용
              theme={theme === "dark" ? "dark" : "default"}
            />
          )}
        </DescriptionBox>
      </Wrapper>
    </DefaultLayout>
  );
};

export default Board;

const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
  background: ${({ theme }) => theme.app.bg.light};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  margin-bottom: 10px;
  padding: 10px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 5px;
`;

const Title = styled.span`
  color: ${({ theme }) => theme.app.text.black};
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
`;

const CreatedAt = styled.span`
  color: ${({ theme }) => theme.app.text.light2};
  font-size: 14px;
  line-height: 1;
`;

const DescriptionBox = styled.div`
  line-height: 1.6;
  color: ${({ theme }) => theme.app.text.black};

  & * {
    color: inherit;
  }

  img {
    max-width: 100%;
  }
`;
