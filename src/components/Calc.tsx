import { FaCopy } from "@react-icons/all-files/fa/FaCopy";
import { useState } from "react";
import styled from "styled-components";

import { handleCopy } from "@core/utils/GlobalMethods";

const Calc = () => {
  const [itemPrice, setItemPrice] = useState<number | string>("");
  const [partySize, setPartySize] = useState<number>(8);

  const calculateResults = () => {
    const price =
      typeof itemPrice === "string" ? parseInt(itemPrice, 10) : itemPrice;
    if (!price || price <= 0)
      return {
        directUseMyShare: 0,
        myShare: 0,
      };

    const feeRate = 0.05; // 거래소 수수료 5%

    // 판매 목적일 경우
    const saleNet = Math.floor(price * (1 - feeRate)); // 수수료 5% 차감
    const myShare = Math.floor((saleNet * (partySize - 1)) / partySize); // 내가 가져가는 금액 (수수료만 차감)

    // 직접 사용할 경우
    const directUseMyShare = Math.floor((price * (partySize - 1)) / partySize);

    return {
      directUseMyShare,
      myShare,
    };
  };

  const { directUseMyShare, myShare } = calculateResults();

  const resetInput = () => {
    setItemPrice("");
  };

  return (
    <Container>
      <Section>
        <Title>파티 인원 선택하기</Title>
        <PartySizeSelector>
          {[4, 8, 16].map((size) => (
            <PartySizeButton
              key={size}
              $isActive={partySize === size}
              onClick={() => setPartySize(size)}
            >
              {size}인 파티
            </PartySizeButton>
          ))}
        </PartySizeSelector>
      </Section>

      <Section>
        <Title>아이템 가격 입력</Title>
        <InputContainer>
          <PriceInput
            type="text"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            placeholder="아이템 가격 입력"
          />
          <ResetButton onClick={resetInput}>초기화</ResetButton>
        </InputContainer>
        <InfoText>아이템 가격은 숫자만 입력할 수 있어요</InfoText>
      </Section>

      <Section>
        <Title>계산 결과</Title>
        <Results>
          <ResultItem>
            <p>판매 목적일 경우</p>
            <Highlight>
              <span>{myShare.toLocaleString()} 골드</span> 아래까지 입찰
              <span>
                <FaCopy
                  onClick={() =>
                    handleCopy(
                      myShare.toLocaleString(),
                      `${myShare.toLocaleString()} 골드가 복사 되었습니다.`
                    )
                  }
                  style={{ cursor: "pointer", marginLeft: "8px" }}
                  tabIndex={0}
                />
              </span>
            </Highlight>
            <SubInfo>수수료 5% 포함 손익분기점</SubInfo>
          </ResultItem>
          <ResultItem>
            <p>직접 사용할 경우</p>
            <Highlight>
              <span>{directUseMyShare.toLocaleString()} 골드</span> 아래까지
              입찰
              <span>
                <FaCopy
                  onClick={() =>
                    handleCopy(
                      directUseMyShare.toLocaleString(),
                      `${directUseMyShare.toLocaleString()} 골드가 복사 되었습니다.`
                    )
                  }
                  style={{ cursor: "pointer", marginLeft: "8px" }}
                  tabIndex={0}
                />
              </span>
            </Highlight>
          </ResultItem>
        </Results>
      </Section>
    </Container>
  );
};

export default Calc;

const Container = styled.div`
  color: ${({ theme }) => theme.app.text.black};
  font-family: Arial, sans-serif;
  border-radius: 8px;
`;

const Section = styled.div`
  margin-bottom: 12px;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const PartySizeSelector = styled.div`
  display: flex;
  gap: 12px;
`;

const PartySizeButton = styled.button<{ $isActive: boolean }>`
  padding: 12px 20px;
  font-size: 16px;
  color: ${({ $isActive, theme }) =>
    $isActive ? "#00ff99" : theme.app.text.black};
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.app.palette.gray[800] : theme.app.bg.gray1};
  border: 1px solid
    ${({ $isActive, theme }) => ($isActive ? "#00ff99" : theme.app.border)};
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.app.palette.gray[800]};
    color: #ffffff;
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PriceInput = styled.input`
  padding: 12px;
  font-size: 18px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.app.text.black};
  background-color: ${({ theme }) => theme.app.bg.gray1};
  width: 200px;

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light2};
  }
`;

const ResetButton = styled.button`
  padding: 12px 18px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.app.bg.gray2};
  color: ${({ theme }) => theme.app.text.black};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.app.palette.gray[800]};
    color: #ffffff;
  }
`;

const InfoText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light1};
  margin-top: 6px;
`;

const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #fff;
`;

const ResultItem = styled.div`
  background: #1e1e1e;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #333;
`;

const Highlight = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #00ff99;
  margin: 5px 0;

  span {
    color: rgb(245, 158, 11);
    font-weight: bold;
    display: inline;
  }
`;

const SubInfo = styled.p`
  font-size: 16px;
  color: #ccc;

  strong {
    color: #fff;
  }
`;
