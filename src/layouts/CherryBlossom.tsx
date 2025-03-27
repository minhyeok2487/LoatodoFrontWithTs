import { useAtom } from "jotai";
import { useEffect } from "react";
import styled, { keyframes } from "styled-components";

import { blossomsAtom, showBackGroundAtom } from "@core/atoms/Blossom.atom";

const CherryBlossom: React.FC = () => {
  const [showBackGround] = useAtom(showBackGroundAtom);
  const [blossoms, setBlossoms] = useAtom(blossomsAtom);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBlossom = {
        id: Date.now(),
        startX: `${Math.random() * 100}%`,
        offsetX: Math.random() * 100 - Math.random() * 600,
        delay: `${Math.random() * 2}s`,
        duration: `${5 + Math.random() * 4}s`,
        size: parseFloat((15 + Math.random() * 10).toFixed(2)),
      };

      setBlossoms((prev) => {
        if (prev.length >= 20) {
          return [...prev.slice(1), newBlossom];
        }
        return [...prev, newBlossom];
      });
    }, 400);

    return () => clearInterval(interval);
  }, [setBlossoms]);

  const cherryBlossoms = blossoms.map((blossom) => (
    <CherryBlossomWrapper
      key={blossom.id}
      delay={blossom.delay}
      duration={blossom.duration}
      $startX={blossom.startX}
      $offsetX={blossom.offsetX}
      $size={blossom.size}
    >
      <svg width={blossom.size} height={blossom.size} viewBox="0 0 20 20">
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

const flutter = (offsetX: number) => keyframes`
  0% {
    transform: translateY(-100px) translateX(0) rotate(0deg) scale(1);
    opacity: 1;
  }
  25% {
    transform: translateY(25vh) translateX(${offsetX * 0.3}px) rotate(60deg) scale(1.1);
    opacity: 0.9;
  }
  50% {
    transform: translateY(50vh) translateX(${offsetX * 0.5}px) rotate(120deg) scale(0.9);
    opacity: 0.8;
  }
  75% {
    transform: translateY(75vh) translateX(${offsetX * 0.7}px) rotate(180deg) scale(1.05);
    opacity: 0.6;
  }
  100% {
    transform: translateY(100vh) translateX(${offsetX}px) rotate(240deg) scale(1);
    opacity: 0;
  }
`;

const CherryBlossomWrapper = styled.div.attrs<{ $startX: string }>((props) => ({
  style: {
    left: props.$startX,
  },
}))<{ delay: string; duration: string; $offsetX: number; $size: number }>`
  position: absolute;
  top: -20px;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  animation: ${({ $offsetX }) => flutter($offsetX)}
    ${({ duration }) => duration} linear infinite;
  animation-delay: ${({ delay }) => delay};
  pointer-events: none;
  z-index: 10;
`;
