import styled from "@emotion/styled";
import { MdArrowBack } from "@react-icons/all-files/md/MdArrowBack";
import { MdArrowForward } from "@react-icons/all-files/md/MdArrowForward";
import { useState } from "react";

import useCubeReward from "@core/hooks/queries/character/useCubeReward";
import type { CharacterType } from "@core/types/character";

import Modal from "@components/Modal";

interface Props {
  character: CharacterType;
  isOpen: boolean;
  onClose(): void;
}

const CUBE_NAME_LIST = ["1금제", "2금제", "3금제", "4금제", "5금제"] as const;

const getCubeName = (character: CharacterType) => {
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

const CubeRewardsModal = ({ character, isOpen, onClose }: Props) => {
  const [currentCubeName, setCurrentCubeName] = useState<
    ReturnType<typeof getCubeName>
  >(getCubeName(character));
  const { getCubeReward } = useCubeReward(currentCubeName, {
    enabled: isOpen,
  });

  if (!getCubeReward.data) {
    return null;
  }

  const { data } = getCubeReward;

  return (
    <Modal title="에브니 큐브 평균 데이터" isOpen={isOpen} onClose={onClose}>
      <Wrapper>
        <TitleRow>
          <button
            type="button"
            onClick={() => {
              const currentIndex = CUBE_NAME_LIST.indexOf(data.name);
              const previousIndex =
                currentIndex === 0
                  ? CUBE_NAME_LIST.length - 1
                  : currentIndex - 1;
              const preName = CUBE_NAME_LIST[previousIndex];

              setCurrentCubeName(preName);
            }}
          >
            <MdArrowBack />
          </button>
          <ContentName>에브니 큐브 {data.name}</ContentName>
          <button
            type="button"
            onClick={() => {
              const currentIndex = CUBE_NAME_LIST.indexOf(data.name);
              const nextIndex =
                currentIndex === CUBE_NAME_LIST.length - 1
                  ? 0
                  : currentIndex + 1;
              const nextName = CUBE_NAME_LIST[nextIndex];

              setCurrentCubeName(nextName);
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
                1레벨보석 <strong>{data.jewelry}개</strong>
              </dd>
              <dd>
                가격 <strong>개당 {data.jewelryPrice} G</strong>
              </dd>
              <dd>
                총 가격
                <strong>{data.jewelry * data.jewelryPrice} G</strong>
              </dd>
            </Profit>
          </li>
          <li>
            <Profit>
              <dt>거래 불가 재화</dt>
              <dd>
                돌파석 <strong>{data.leapStone}개</strong>
              </dd>
              <dd>
                실링 <strong>{data.shilling}</strong>
              </dd>
              <dd>
                은총 <strong>{data.solarGrace}개</strong>
              </dd>
              <dd>
                축복 <strong>{data.solarBlessing}개</strong>
              </dd>
              <dd>
                가호 <strong>{data.solarProtection}개</strong>
              </dd>
              <dd>
                카경 <strong>{data.cardExp}</strong>
              </dd>
            </Profit>
          </li>
        </ProfitList>
      </Wrapper>
    </Modal>
  );
};

export default CubeRewardsModal;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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

  ${({ theme }) => theme.medias.max500} {
    flex-direction: column;
  }

  li {
    width: 160px;

    &:not(:last-of-type) {
      padding-right: 20px;

      ${({ theme }) => theme.medias.max500} {
        padding-right: 0;
        padding-bottom: 20px;
      }
    }
  }

  li + li {
    padding-left: 20px;
    border-left: 1px solid ${({ theme }) => theme.app.border};

    ${({ theme }) => theme.medias.max500} {
      padding-left: 0;
      padding-top: 20px;
      border-left: none;
      border-top: 1px solid ${({ theme }) => theme.app.border};
    }
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
