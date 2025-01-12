import { useEffect, useState } from "react";
import styled from "styled-components";

import { saveAds } from "@core/apis/member.api";
import useMyInformation from "@core/hooks/queries/member/useMyInformation";

import Button from "./Button";

const DonationModal = () => {
  const getMyInformation = useMyInformation();
  const [donationPrice, setDonationPrice] = useState<number>(0);
  const [donationDate, setDonationDate] = useState<number>(0);
  const [email, setEmail] = useState<string>();
  const [name, setName] = useState<string>();

  const calculatePrice = () => {
    const daysPerUnitPrice = 30 / 200;
    setDonationDate(Math.floor(donationPrice * daysPerUnitPrice));
  };

  useEffect(() => {
    calculatePrice();

    if (getMyInformation.data?.memberId !== 365) {
      setEmail(getMyInformation.data?.username || "");
    }
  }, [donationPrice]);

  const handleSubmit = async () => {
    if (name == null) {
      alert("입금자를 입력해주세요.");
      return;
    }

    if (email == null) {
      alert("후원 이메일을 입력해주세요.");
      return;
    }
    try {
      await saveAds({ mail: email, name });
      alert("후원 신청이 완료되었습니다.");
    } catch (error) {
      console.log(error);
      alert("후원 신청에 실패했습니다.");
    }
  };

  return (
    <>
      <StyledDonationSection>
        <h2>광고제거</h2>
        <ul>
          <li>후원을 통해 광고를 제거할 수 있습니다.</li>
          <li>모든 구글 광고가 제거됩니다.</li>
          <li>계좌: 카카오뱅크 3333-32-7731770</li>
          <li>예금주: 이민혁</li>
        </ul>
      </StyledDonationSection>
      <StyledDonationAmount>
        <h2>가격 계산</h2>
        <p>30일: 200원 / 300일: 2000원</p>
        <input
          type="text"
          placeholder="금액을 입력해주세요."
          value={`${donationPrice.toLocaleString()} 원`}
          onChange={(e) => {
            const value = e.target.value.replace(/,/g, "").replace(/ 원/g, "");
            if (!Number.isNaN(Number(value)) && Number(value) >= 0) {
              setDonationPrice(Number(value));
            }
          }}
          onWheel={(e) => e.preventDefault()}
        />
        <span>{donationDate} 일</span>
      </StyledDonationAmount>
      <StyledInputSection>
        <p>이체 후 아래 입력폼 입력 후 후원 신청 버튼을 클릭해주세요.</p>
        <input
          type="text"
          placeholder="신청 이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="예금주"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          type="button"
          variant="contained"
          size="large"
          onClick={handleSubmit}
        >
          후원하기
        </Button>
      </StyledInputSection>
      <StyledNote>
        광고 제거는 관리자가 확인 후 처리하고 있어 다소 시간이 소요될 수
        있습니다.
      </StyledNote>
    </>
  );
};

export default DonationModal;

const StyledDonationSection = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
  background-color: ${({ theme }) => theme.app.bg.gray2};
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);

  h2 {
    font-weight: 700;
    font-size: 24px;
    color: ${({ theme }) => theme.app.text.main};
    margin-bottom: 8px;
  }

  ul {
    margin: 0;
    padding-left: 20px;
    list-style-type: disc;
    color: ${({ theme }) => theme.app.text.dark2};
  }

  li {
    margin-bottom: 8px;
    line-height: 1.5;
  }
`;

const StyledDonationAmount = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
  background-color: ${({ theme }) => theme.app.bg.gray2};
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);

  h2 {
    font-weight: 700;
    font-size: 24px;
    color: ${({ theme }) => theme.app.text.main};
    margin-bottom: 12px;
  }

  p {
    font-size: 16px;
    margin-bottom: 16px;
    color: ${({ theme }) => theme.app.text.dark2};
  }

  input {
    width: 50%;
    padding: 12px;
    border: 1px solid ${({ theme }) => theme.app.border};
    border-radius: 8px;
    font-size: 16px;
    margin-bottom: 8px;
    background-color: ${({ theme }) => theme.app.bg.main};
  }

  span {
    display: block;
    margin-top: 8px;
    font-size: 16px;
    font-weight: bold;
    color: ${({ theme }) => theme.app.text.main};
  }
`;

const StyledInputSection = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
  background-color: ${({ theme }) => theme.app.bg.gray2};
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);

  input {
    width: 45%;
    padding: 12px;
    border: 1px solid ${({ theme }) => theme.app.border};
    border-radius: 8px;
    font-size: 16px;
    margin-bottom: 12px;
    margin-right: 10px;
    background-color: ${({ theme }) => theme.app.bg.main};
  }
`;

const StyledNote = styled.div`
  font-size: 14px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 16px;
  background-color: ${({ theme }) => theme.app.bg.gray2};
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.app.text.dark2};
  line-height: 1.6;
  font-weight: bold;
`;
