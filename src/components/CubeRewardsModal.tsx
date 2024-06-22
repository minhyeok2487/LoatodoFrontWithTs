import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { useSetRecoilState } from "recoil";

import * as characterApi from "@core/apis/Character.api";
import { loading } from "@core/atoms/Loading.atom";
import type { CharacterType, CubeRewards } from "@core/types/Character.type";

import Modal from "@components/Modal";

interface Props {
  character: CharacterType;
  isOpen: boolean;
  onClose(): void;
}

const cubeContentList = ["1금제", "2금제", "3금제", "4금제", "5금제"];

const CubeRewardsModal = ({ character, isOpen, onClose }: Props) => {
  const setLoadingState = useSetRecoilState(loading);

  const [cubeContent, setCubeContent] = useState<CubeRewards>();

  const getCubeContentName = () => {
    if (character.itemLevel < 1490.0) {
      return "1금제";
    }

    if (character.itemLevel >= 1490.0 && character.itemLevel < 1540.0) {
      return "2금제";
    }

    if (character.itemLevel >= 1540.0 && character.itemLevel < 1580.0) {
      return "3금제";
    }

    if (character.itemLevel >= 1580.0 && character.itemLevel < 1610.0) {
      return "4금제";
    }

    return "5금제";
  };

  const fetchCubeContent = async (name: string) => {
    setLoadingState(true);
    const cubeContent = await characterApi.getCubeContent(name);
    setLoadingState(false);

    setCubeContent(cubeContent);
  };

  useEffect(() => {
    fetchCubeContent(getCubeContentName());
  }, [character]);

  if (!cubeContent) {
    return null;
  }
  return (
    <Modal title="에브니 큐브 평균 데이터" isOpen={isOpen} onClose={onClose}>
      <TitleRow>
        <button
          type="button"
          onClick={() => {
            const currentIndex = cubeContentList.indexOf(cubeContent.name);
            const previousIndex =
              currentIndex === 0
                ? cubeContentList.length - 1
                : currentIndex - 1;
            const preName = cubeContentList[previousIndex];

            fetchCubeContent(preName);
          }}
        >
          <MdArrowBack />
        </button>
        <ContentName>에브니 큐브 {cubeContent.name}</ContentName>
        <button
          type="button"
          onClick={() => {
            const currentIndex = cubeContentList.indexOf(cubeContent.name);
            const nextIndex =
              currentIndex === cubeContentList.length - 1
                ? 0
                : currentIndex + 1;
            const nextName = cubeContentList[nextIndex];

            fetchCubeContent(nextName);
          }}
        >
          <MdArrowForward />
        </button>
      </TitleRow>

      <ProfitList>
        <li>
          <Profit>
            <dt>거래 가능 재화</dt>
            <dd>
              1레벨보석 <strong>{cubeContent.jewelry}개</strong>
            </dd>
            <dd>
              가격 <strong>개당 {cubeContent.jewelryPrice} G</strong>
            </dd>
            <dd>
              총 가격
              <strong>
                {cubeContent.jewelry * cubeContent.jewelryPrice} G
              </strong>
            </dd>
          </Profit>
        </li>
        <li>
          <Profit>
            <dt>거래 불가 재화</dt>
            <dd>
              돌파석 <strong>{cubeContent.leapStone}개</strong>
            </dd>
            <dd>
              실링 <strong>{cubeContent.shilling}</strong>
            </dd>
            <dd>
              은총 <strong>{cubeContent.solarGrace}개</strong>
            </dd>
            <dd>
              축복 <strong>{cubeContent.solarBlessing}개</strong>
            </dd>
            <dd>
              가호 <strong>{cubeContent.solarProtection}개</strong>
            </dd>
            <dd>
              카경 <strong>{cubeContent.cardExp}</strong>
            </dd>
          </Profit>
        </li>
      </ProfitList>
    </Modal>
  );
};

export default CubeRewardsModal;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const ContentName = styled.p`
  color: ${({ theme }) => theme.app.blue2};
  font-size: 16px;
`;

const ProfitList = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 10px;

  li {
    width: 160px;

    &:not(:last-of-type) {
      padding-right: 20px;
    }
  }

  li + li {
    padding-left: 20px;
    border-left: 1px solid ${({ theme }) => theme.app.border};
  }
`;

const Profit = styled.dl`
  dt {
    text-align: center;
  }

  dd {
    color: ${({ theme }) => theme.app.text.light1};

    strong {
      margin-left: 5px;
      color: ${({ theme }) => theme.app.text.black};
      font-weight: 700;
    }
  }
`;
