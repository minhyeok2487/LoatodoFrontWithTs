import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import { showBackGroundAtom } from "@core/atoms/Blossom.atom";

// 밝고 화사한 낙엽 색감
const leafSvgs = [
  {
    // 우아한 단풍잎
    path: "M30,5 C28,8 26,12 26,16 L20,14 C18,18 20,22 22,24 L16,26 C16,30 20,32 24,32 L22,38 C24,42 28,44 30,45 C32,44 36,42 38,38 L36,32 C40,32 44,30 44,26 L38,24 C40,22 42,18 40,14 L34,16 C34,12 32,8 30,5 Z",
    viewBox: "0 0 60 60",
    fill: "#FFB5B5",
    accent: "#FFD4D4",
  },
  {
    // 부드러운 타원 잎
    path: "M30,8 C22,10 16,16 15,25 C14,34 18,42 26,47 C28,48 30,48 32,48 C34,48 36,47 38,46 C46,41 50,33 49,24 C48,15 42,10 34,8 C32,7.5 31,7.5 30,8 Z",
    viewBox: "0 0 60 60",
    fill: "#FFD4A3",
    accent: "#FFF0C9",
  },
  {
    // 섬세한 버드나무 잎
    path: "M28,6 C26,8 25,11 25,15 C25,20 26,25 27,30 C28,35 29,40 29,45 C29,48 29,50 30,52 C31,50 31,48 31,45 C31,40 32,35 33,30 C34,25 35,20 35,15 C35,11 34,8 32,6 C31,5.5 29,5.5 28,6 Z",
    viewBox: "0 0 60 60",
    fill: "#FFFACD",
    accent: "#FFFFDB",
  },
  {
    // 하트형 낙엽
    path: "M30,12 C26,8 20,8 17,12 C14,16 14,22 17,26 L30,42 L43,26 C46,22 46,16 43,12 C40,8 34,8 30,12 Z",
    viewBox: "0 0 60 60",
    fill: "#FFCBA4",
    accent: "#FFE4CC",
  },
  {
    // 은행잎
    path: "M30,8 C24,9 20,13 18,18 C16,23 17,28 19,33 C21,38 24,42 28,45 L30,47 L32,45 C36,42 39,38 41,33 C43,28 44,23 42,18 C40,13 36,9 30,8 Z M30,10 L30,45",
    viewBox: "0 0 60 60",
    fill: "#FFF9B0",
    accent: "#FFFFD6",
  },
  {
    // 참나무 잎
    path: "M30,6 C29,7 28,9 28,11 L24,10 C23,12 24,14 25,15 L22,16 C22,18 24,19 26,19 L25,22 C26,24 28,25 30,26 C32,25 34,24 35,22 L34,19 C36,19 38,18 38,16 L35,15 C36,14 37,12 36,10 L32,11 C32,9 31,7 30,6 Z M30,26 C32,27 34,28 35,30 L34,33 C36,33 38,32 38,30 L35,29 C36,28 37,26 36,24 L32,25 C32,27 31,29 30,30 C29,29 28,27 28,25 L24,24 C23,26 24,28 25,29 L22,30 C22,32 24,33 26,33 L25,30 C26,28 28,27 30,26 Z M30,30 L30,46",
    viewBox: "0 0 60 60",
    fill: "#FFE4B5",
    accent: "#FFF5E1",
  },
  {
    // 작고 귀여운 잎
    path: "M30,10 C26,11 23,14 22,18 C21,22 22,26 25,29 C27,31 29,32 30,32 C31,32 33,31 35,29 C38,26 39,22 38,18 C37,14 34,11 30,10 Z",
    viewBox: "0 0 60 60",
    fill: "#FFDAB9",
    accent: "#FFEFD5",
  },
  {
    // 길쭉한 버즘나무 잎
    path: "M25,8 C23,10 22,13 22,17 C22,23 24,29 26,35 C27,38 28,41 29,44 L30,48 L31,44 C32,41 33,38 34,35 C36,29 38,23 38,17 C38,13 37,10 35,8 C33,7 32,7 30,7 C28,7 27,7 25,8 Z M28,16 C29,20 30,24 30,28 C30,24 31,20 32,16 C31,14 30,13 30,13 C30,13 29,14 28,16 Z",
    viewBox: "0 0 60 60",
    fill: "#FFC8A2",
    accent: "#FFDFC4",
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

const FallingLeavesEffect: React.FC = () => {
  const [showBackGround] = useAtom(showBackGroundAtom);
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLeaf: Leaf = {
        id: Date.now(),
        startX: `${Math.random() * 100}%`,
        offsetX: Math.random() * 200 - 100,
        delay: `${Math.random() * 8}s`,
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
    }, 800);

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
            <defs>
              <linearGradient
                id={`grad-${leaf.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={leaf.svgData.fill}
                  stopOpacity="0.95"
                />
                <stop
                  offset="100%"
                  stopColor={leaf.svgData.accent}
                  stopOpacity="0.85"
                />
              </linearGradient>
              <filter id={`shadow-${leaf.id}`}>
                <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
                <feOffset dx="0" dy="1" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d={leaf.svgData.path}
              fill={`url(#grad-${leaf.id})`}
              filter={`url(#shadow-${leaf.id})`}
            />
          </svg>
        </LeafWrapper>
      ))}
    </>
  ) : null;
};

export default FallingLeavesEffect;

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
    ${({ duration }) => duration} linear forwards;
  animation-delay: ${({ delay }) => delay};
  pointer-events: none;
  z-index: 10;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
  transition: filter 0.3s ease;
`;
