import { useAtom } from "jotai";
import { useEffect } from "react";
import styled, { keyframes } from "styled-components";

import { blossomsAtom, showBackGroundAtom } from "@core/atoms/Blossom.atom";

const CherryBlossom: React.FC = () => {
  const [showBackGround] = useAtom(showBackGroundAtom);
  const [blossoms, setBlossoms] = useAtom(blossomsAtom);

  useEffect(() => {
    // 0.5초마다 벚꽃 추가
    const interval = setInterval(() => {
      const newBlossom = {
        id: Date.now(),
        startX: `${Math.random() * 100}%`,
        offsetX: Math.random() * 100 - Math.random() * 600,
        delay: "0s",
        duration: `${5 + Math.random() * 4}s`,
      };

      setBlossoms((prev) => {
        if (prev.length >= 15) {
          return [...prev.slice(1), newBlossom];
        }
        return [...prev, newBlossom];
      });
    }, 500);

    // 컴포넌트 언마운트 시 interval 정리
    return () => clearInterval(interval);
  }, [setBlossoms]); // setBlossoms를 의존성 배열에 추가

  // 벚꽃 렌더링
  const cherryBlossoms = blossoms.map((blossom) => (
    <CherryBlossomWrapper
      key={blossom.id}
      delay={blossom.delay}
      duration={blossom.duration}
      $startX={blossom.startX}
      $offsetX={blossom.offsetX}
    >
      <svg width="20" height="20" viewBox="0 0 20 20">
        <path
          d="M10 2 Q12 0, 14 2 Q16 4, 17 6 Q18 8, 16 10 Q14 12, 11 13 Q8 12, 6 10 Q4 8, 3 6 Q2 4, 4 2 Q6 0, 10 2"
          fill="pink"
          stroke="none"
        />
      </svg>
    </CherryBlossomWrapper>
  ));

  return showBackGround ? <>{cherryBlossoms}</> : null;
};

export default CherryBlossom;

// offsetX를 기반으로 애니메이션 정의
const flutter = (offsetX: number) => keyframes`
  0% {
    transform: translateY(-100px) translateX(0) rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: translateY(25vh) translateX(${offsetX * 0.4}px) rotate(90deg);
    opacity: 0.9;
  }
  50% {
    transform: translateY(50vh) translateX(${offsetX * 0.6}px) rotate(180deg);
    opacity: 0.8;
  }
  75% {
    transform: translateY(75vh) translateX(${offsetX * 0.8}px) rotate(270deg);
    opacity: 0.6;
  }
  100% {
    transform: translateY(100vh) translateX(${offsetX}px) rotate(360deg);
    opacity: 0;
  }
`;

const CherryBlossomWrapper = styled.div.attrs<{ $startX: string }>((props) => ({
  style: {
    left: props.$startX,
  },
}))<{ delay: string; duration: string; $offsetX: number }>`
  position: absolute;
  top: -20px;
  width: 20px;
  height: 20px;
  animation: ${({ $offsetX }) => flutter($offsetX)}
    ${({ duration }) => duration} linear infinite;
  animation-delay: ${({ delay }) => delay};
  pointer-events: none;
  z-index: 10;
`;
