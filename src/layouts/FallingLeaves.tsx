import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import { showBackGroundAtom } from "@core/atoms/Blossom.atom";

// 더 자연스러운 낙엽 모양 (곡선 중심)
const leafSvgs = [
  {
    path: "M25,5 C10,10 5,25 15,40 C25,55 35,55 45,40 C55,25 40,10 25,5 Z",
    viewBox: "0 0 60 60",
    fill: "#FFCBA4", // 부드러운 복숭아
  },
  {
    path: "M30,5 C20,15 10,30 20,45 C30,60 40,60 50,45 C60,30 50,15 40,5 Z",
    viewBox: "0 0 60 60",
    fill: "#D8AFAF", // 톤 다운된 장미
  },
  {
    path: "M25,10 C5,30 10,50 30,55 C50,50 55,30 35,10 Z",
    viewBox: "0 0 60 60",
    fill: "#FDFD96", // 크림 노랑
  },
  {
    path: "M20,10 C5,25 5,45 20,55 C35,65 50,45 45,25 C40,5 30,5 20,10 Z",
    viewBox: "0 0 60 60",
    fill: "#B2AC88", // 세이지 그린
  },
];

interface Leaf {
  id: number;
  startX: string;
  offsetX: number;
  delay: string;
  duration: string;
  size: number;
  rotate: number;
  svgData: (typeof leafSvgs)[0];
}

const FallingLeaves: React.FC = () => {
  const [showBackGround] = useAtom(showBackGroundAtom);
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLeaf: Leaf = {
        id: Date.now(),
        startX: `${Math.random() * 100}%`,
        offsetX: Math.random() * 200 - 100,
        delay: `${Math.random() * 8}s`, // 시작 딜레이를 늘려 분산
        duration: `${7 + Math.random() * 4}s`,
        size: parseFloat((20 + Math.random() * 15).toFixed(2)),
        rotate: Math.random() * 360,
        svgData: leafSvgs[Math.floor(Math.random() * leafSvgs.length)],
      };

      setLeaves((prev) => {
        if (prev.length >= 60) {
          return [...prev.slice(1), newLeaf];
        }
        return [...prev, newLeaf];
      });
    }, 800); // 생성 간격을 늘림

    return () => clearInterval(interval);
  }, []);

  return showBackGround ? (
    <>
      {leaves.map((leaf) => (
        <LeafWrapper
          key={leaf.id}
          delay={leaf.delay}
          duration={leaf.duration}
          $startX={leaf.startX}
          $offsetX={leaf.offsetX}
          $size={leaf.size}
          $rotate={leaf.rotate}
        >
          <svg
            width={leaf.size}
            height={leaf.size}
            viewBox={leaf.svgData.viewBox}
            preserveAspectRatio="xMidYMid meet"
          >
            <path d={leaf.svgData.path} fill={leaf.svgData.fill} />
          </svg>
        </LeafWrapper>
      ))}
    </>
  ) : null;
};

export default FallingLeaves;

// 부드러운 흔들림 + 회전 애니메이션
const flutter = (offsetX: number, rotate: number) => keyframes`
  0% {
    transform: translateY(-100px) translateX(0) rotate(${rotate}deg);
    opacity: 1;
  }
  25% {
    transform: translateY(25vh) translateX(${offsetX * 0.3}px) rotate(${rotate + 90}deg);
    opacity: 0.9;
  }
  50% {
    transform: translateY(50vh) translateX(${offsetX * 0.6}px) rotate(${rotate + 180}deg);
    opacity: 0.8;
  }
  75% {
    transform: translateY(75vh) translateX(${offsetX * 0.8}px) rotate(${rotate + 270}deg);
    opacity: 0.7;
  }
  100% {
    transform: translateY(100vh) translateX(${offsetX}px) rotate(${rotate + 360}deg);
    opacity: 0;
  }
`;

const LeafWrapper = styled.div.attrs<{ $startX: string }>((props) => ({
  style: { left: props.$startX },
}))<{
  delay: string;
  duration: string;
  $offsetX: number;
  $size: number;
  $rotate: number;
}>`
  position: absolute;
  top: -40px;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  animation: ${({ $offsetX, $rotate }) => flutter($offsetX, $rotate)}
    ${({ duration }) => duration} linear forwards; /* linear로 변경 */
  animation-delay: ${({ delay }) => delay};
  pointer-events: none;
  z-index: 10;
`;
