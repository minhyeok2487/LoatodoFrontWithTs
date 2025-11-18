import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import { showBackGroundAtom } from "@core/atoms/Blossom.atom";

interface RaindropMeta {
  id: number;
  left: number;
  delay: number;
  duration: number;
  length: number;
  opacity: number;
}

const RainEffect: React.FC = () => {
  const showBackground = useAtomValue(showBackGroundAtom);
  const [drops, setDrops] = useState<RaindropMeta[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newDrop: RaindropMeta = {
        id: Date.now(),
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 1.4 + Math.random() * 0.8,
        length: 40 + Math.random() * 40,
        opacity: 0.25 + Math.random() * 0.35,
      };

      setDrops((previous) => {
        const next = [...previous, newDrop];
        if (next.length > 80) {
          next.shift();
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  if (!showBackground) {
    return null;
  }

  return (
    <>
      {drops.map((drop) => (
        <RaindropItem
          key={drop.id}
          style={{
            left: `${drop.left}%`,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
            height: `${drop.length}px`,
            opacity: drop.opacity,
          }}
        />
      ))}
      <RainMist />
    </>
  );
};

export default RainEffect;

const rainFall = keyframes`
  0% {
    transform: translateY(-120px);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  100% {
    transform: translateY(110vh);
    opacity: 0;
  }
`;

const RaindropItem = styled.span`
  position: absolute;
  top: -50px;
  width: 2px;
  background: ${({ theme }) =>
    theme.currentTheme === "dark"
      ? "rgba(240, 244, 255, 0.6)"
      : "rgba(82, 125, 255, 0.4)"};
  border-radius: 999px;
  animation-name: ${rainFall};
  animation-timing-function: linear;
  will-change: transform, opacity;
  pointer-events: none;
  z-index: 9;
`;

const RainMist = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(180, 200, 255, 0.05) 35%,
    rgba(130, 150, 220, 0.08) 100%
  );
  mix-blend-mode: screen;
  z-index: 8;
`;
