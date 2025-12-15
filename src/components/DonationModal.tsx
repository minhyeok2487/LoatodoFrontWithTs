import styled, { css } from "styled-components";

import Button from "./Button";

const DonationModal = () => {
  return (
    <>
      <StyledAnnouncementSection>
        <EmojiTitle>🎉 구독 서비스 준비중입니다</EmojiTitle>
        <AnnouncementText>
          로아투두가 더 나은 서비스로 돌아옵니다!
          <br />
          현재 일회성 후원에서 <strong>정기 구독 서비스</strong>로 업그레이드 중입니다.
        </AnnouncementText>
      </StyledAnnouncementSection>

      <StyledBenefitSection>
        <h2>✅ 기존 후원자 분들</h2>
        <ul>
          <li>광고 제거 혜택은 계속 유지됩니다</li>
          <li>남은 기간도 그대로 적용됩니다</li>
          <li>추가 조치는 필요하지 않습니다</li>
        </ul>
      </StyledBenefitSection>

      <StyledUpcomingSection>
        <h2>📅 예정 서비스</h2>
        <ul>
          <li>월 정기 구독으로 편리하게 이용</li>
          <li>자동 결제로 번거로움 없이</li>
          <li>더 다양한 프리미엄 기능 제공 예정</li>
        </ul>
      </StyledUpcomingSection>

      <StyledNote>
        <p>준비되는 대로 다시 공지드리겠습니다!</p>
        <p>문의사항이 있으시면 언제든지 연락주세요.</p>
        <Button
          css={kakaoButtonCss}
          href="https://open.kakao.com/o/snL05upf"
          target="_blank"
          rel="noreferrer"
        >
          개발자에게 카톡하기
        </Button>
      </StyledNote>
    </>
  );
};

export default DonationModal;

const StyledAnnouncementSection = styled.div`
  margin-bottom: 20px;
  padding: 24px;
  border: 2px solid ${({ theme }) => theme.app.palette.blue[350]};
  border-radius: 16px;
  background: linear-gradient(135deg, ${({ theme }) => theme.app.bg.gray2} 0%, ${({ theme }) => theme.app.bg.main} 100%);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const EmojiTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.main};
  margin-bottom: 16px;
`;

const AnnouncementText = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: ${({ theme }) => theme.app.text.dark2};

  strong {
    color: ${({ theme }) => theme.app.palette.blue[350]};
    font-weight: 700;
  }
`;

const StyledBenefitSection = styled.div`
  margin-bottom: 16px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
  background-color: ${({ theme }) => theme.app.bg.gray2};
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);

  h2 {
    font-weight: 700;
    font-size: 20px;
    color: ${({ theme }) => theme.app.text.main};
    margin-bottom: 12px;
  }

  ul {
    margin: 0;
    padding-left: 20px;
    list-style-type: disc;
    color: ${({ theme }) => theme.app.text.dark2};
  }

  li {
    margin-bottom: 8px;
    line-height: 1.6;
    font-size: 15px;
  }
`;

const StyledUpcomingSection = styled.div`
  margin-bottom: 16px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
  background-color: ${({ theme }) => theme.app.bg.gray2};
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);

  h2 {
    font-weight: 700;
    font-size: 20px;
    color: ${({ theme }) => theme.app.text.main};
    margin-bottom: 12px;
  }

  ul {
    margin: 0;
    padding-left: 20px;
    list-style-type: disc;
    color: ${({ theme }) => theme.app.text.dark2};
  }

  li {
    margin-bottom: 8px;
    line-height: 1.6;
    font-size: 15px;
  }
`;

const StyledNote = styled.div`
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
  background-color: ${({ theme }) => theme.app.bg.gray2};
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-align: center;

  p {
    font-size: 15px;
    color: ${({ theme }) => theme.app.text.dark2};
    line-height: 1.6;
    margin-bottom: 8px;

    &:last-of-type {
      margin-bottom: 16px;
    }
  }
`;

const kakaoButtonCss = css`
  margin-top: 10px;
  background: #fee500;
  color: #3c1e1e;
  font-weight: 700;
`;
