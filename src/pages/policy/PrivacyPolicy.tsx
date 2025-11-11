import styled from "styled-components";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

const PrivacyPolicy = () => {
  return (
    <WideDefaultLayout pageTitle="개인정보지침" description="로아투두(LOATODO)의 개인정보 처리 방침입니다.">
      <PolicyCard>
        <Section>
          <h2>로아투두(LOATODO) 개인정보처리방침</h2>
          <p>
            ‘로아투두(LOATODO)’는 이용자의 개인정보를 소중히 여기며, 개인정보 유출로 인한 피해가 발생하지 않도록 최선을 다하고 있습니다. 회사는 관련 법령을 준수하며, 본 방침을 통해 개인정보 이용 목적과 보호 조치를 안내합니다.
          </p>
          <p>
            본 방침은 법령 또는 정책 변경에 따라 수시로 개정될 수 있으며, 변경 시 홈페이지 공지사항을 통해 안내합니다.
          </p>
        </Section>

        <Section>
          <h3>1. 개인정보 수집에 대한 동의</h3>
          <p>회원가입 또는 서비스 이용 시 개인정보처리방침과 이용약관에 동의하면 개인정보 수집에 동의한 것으로 간주합니다.</p>
        </Section>

        <Section>
          <h3>2. 수집하는 개인정보 항목 및 이용 목적</h3>
          <Subsection>
            <h4>(1) 수집하는 개인정보 항목</h4>
            <strong>[필수 항목]</strong>
            <ul>
              <li>이메일(아이디), 비밀번호</li>
            </ul>
            <strong>[선택 항목]</strong>
            <ul>
              <li>IP Address, 인증값(로그인/보안용)</li>
              <li>서비스 이용 기록, 접속 로그, 쿠키, 기기 정보</li>
            </ul>
          </Subsection>
          <Subsection>
            <h4>(2) 개인정보 이용 목적</h4>
            <ul>
              <li>회원가입 및 본인확인, 서비스 제공 및 유지관리</li>
              <li>이용자 식별, 부정 이용 방지, 고객 문의 및 불만 처리</li>
              <li>서비스 관련 공지 및 알림, 통계·분석을 통한 품질 개선</li>
            </ul>
          </Subsection>
        </Section>

        <Section>
          <h3>3. 개인정보 수집 방법</h3>
          <ul>
            <li>회원가입 및 서비스 이용 시 이용자의 직접 입력</li>
            <li>서비스 이용 과정에서 자동 생성되는 정보(쿠키, 접속 로그 등)</li>
            <li>이벤트, 설문조사, 고객문의 등을 통한 수집</li>
          </ul>
          <p>※ 민감정보는 원칙적으로 수집하지 않으며, 불가피한 경우 사전 동의를 받습니다.</p>
        </Section>

        <Section>
          <h3>4. 개인정보 보유 및 이용기간</h3>
          <ul>
            <li>회원 탈퇴 시 즉시 파기합니다.</li>
            <li>법령에 따른 거래내역 보존, 부정 이용 방지 목적 등은 예외적으로 보관합니다.</li>
          </ul>
        </Section>

        <Section>
          <h3>5. 개인정보 파기 절차 및 방법</h3>
          <p>수집 목적 달성 후 별도 보관 기간이 끝나면 즉시 삭제합니다.</p>
          <ul>
            <li>종이 문서: 분쇄 또는 소각</li>
            <li>전자 파일: 복구 불가능한 기술적 방법으로 삭제</li>
          </ul>
        </Section>

        <Section>
          <h3>6. 개인정보의 처리 위탁</h3>
          <p>서비스 운영을 위해 일부 업무를 외부 업체에 위탁할 수 있으며, 위탁 시 개인정보가 안전하게 처리되도록 관리·감독합니다.</p>
        </Section>

        <Section>
          <h3>7. 개인정보의 제3자 제공</h3>
          <p>이용자의 개인정보를 수집 목적 외 용도로 사용하거나 제3자에게 제공하지 않습니다. 단, 법령 요구, 이용자 동의, 서비스 이행 등에 필요한 경우 예외로 합니다.</p>
        </Section>

        <Section>
          <h3>8. 이용자의 권리</h3>
          <ul>
            <li>언제든지 개인정보를 조회·수정할 수 있습니다.</li>
            <li>동의 철회 및 회원탈퇴는 이메일(repeat2487@gmail.com)을 통해 요청 가능합니다.</li>
          </ul>
        </Section>

        <Section>
          <h3>9. 쿠키(Cookie) 운영 및 거부</h3>
          <p>개인 맞춤형 서비스를 위해 쿠키를 사용하며, 브라우저 설정을 통해 저장을 거부하거나 삭제할 수 있습니다.</p>
        </Section>

        <Section>
          <h3>10. 개인정보 관련 의견 및 불만처리</h3>
          <p>고객센터를 운영하고 있으며, 개인정보보호책임자에게 문의할 수 있습니다.</p>
        </Section>

        <Section>
          <h3>11. 아동의 개인정보 보호</h3>
          <p>만 14세 미만 아동은 법정대리인의 동의 후 가입이 가능하며, 확인 목적 외에는 정보를 사용하지 않습니다.</p>
        </Section>

        <Section>
          <h3>12. 이용자의 책임</h3>
          <p>정확한 정보 입력과 계정 보안 관리는 이용자 책임이며, 허위 정보나 계정 노출로 발생한 문제는 회사가 책임지지 않습니다.</p>
        </Section>

        <Section>
          <h3>13. 개인정보보호 책임자 및 담당자</h3>
          <ul>
            <li>이름: 이민혁</li>
            <li>직위: 대표</li>
            <li>이메일: repeat2487@gmail.com</li>
          </ul>
        </Section>

        <Section>
          <h3>14. 고지의 의무</h3>
          <p>방침 변경 시 최소 7일 전에 홈페이지 공지사항을 통해 고지합니다.</p>
        </Section>

        <Section>
          <h3>15. 개인정보 침해 관련 신고 기관</h3>
          <ul>
            <li>개인정보침해신고센터(118) · <a href="https://privacy.kisa.or.kr" target="_blank" rel="noreferrer">privacy.kisa.or.kr</a></li>
            <li>개인정보분쟁조정위원회(02-2100-2499) · <a href="https://www.kopico.go.kr" target="_blank" rel="noreferrer">www.kopico.go.kr</a></li>
            <li>대검찰청 사이버수사과 · <a href="http://www.spo.go.kr" target="_blank" rel="noreferrer">www.spo.go.kr</a></li>
            <li>경찰청 사이버안전국(182) · <a href="http://cyberbureau.police.go.kr" target="_blank" rel="noreferrer">cyberbureau.police.go.kr</a></li>
          </ul>
        </Section>
      </PolicyCard>
    </WideDefaultLayout>
  );
};

export default PrivacyPolicy;

const PolicyCard = styled.article`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 18px;
  background: ${({ theme }) => theme.app.bg.white};
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 28px;

  ${({ theme }) => theme.medias.max600} {
    padding: 20px;
  }

  h2 {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  h3 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 6px;
  }

  ul {
    margin-left: 16px;
    list-style: disc;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  p {
    line-height: 1.6;
    color: ${({ theme }) => theme.app.text.light1};
  }

  strong {
    display: block;
    margin: 8px 0 4px;
  }

  a {
    color: ${({ theme }) => theme.app.palette.blue[350]};
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Subsection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
`;
