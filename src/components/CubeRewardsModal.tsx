import { useEffect, useState } from "react";
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
      <div className="chaosVisual">
        <p>
          <button
            className="prev"
            type="button"
            style={{ cursor: "pointer", marginRight: 5 }}
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
            ←
          </button>
          에브니 큐브 <strong>{cubeContent.name}</strong>
          <button
            className="next"
            type="button"
            style={{ cursor: "pointer", marginLeft: 5 }}
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
            →
          </button>
        </p>
        <div className="flex" style={{ alignItems: "flex-start" }}>
          <ul>
            <strong>거래 가능 재화</strong>
            <li>
              1레벨보석 <em>{cubeContent.jewelry}개</em>
            </li>
            <li>
              가격 <em>개당 {cubeContent.jewelryPrice} G</em>
            </li>
            <li>
              총 가격{" "}
              <em>{cubeContent.jewelry * cubeContent.jewelryPrice} G</em>
            </li>
          </ul>
          <ul>
            <strong>거래 불가 재화</strong>
            <li>
              돌파석 <em>{cubeContent.leapStone}개</em>
            </li>
            <li>
              실링 <em>{cubeContent.shilling}</em>
            </li>
            <li>
              은총 <em>{cubeContent.solarGrace}개</em>
            </li>
            <li>
              축복 <em>{cubeContent.solarBlessing}개</em>
            </li>
            <li>
              가호 <em>{cubeContent.solarProtection}개</em>
            </li>
            <li>
              카경 <em>{cubeContent.cardExp}</em>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default CubeRewardsModal;
