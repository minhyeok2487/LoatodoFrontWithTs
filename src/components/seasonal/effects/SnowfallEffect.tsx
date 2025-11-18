import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import { showBackGroundAtom } from "@core/atoms/Blossom.atom";

interface Snowflake {
  id: number;
  size: number;
  left: number;
  drift: number;
  duration: number;
  delay: number;
}

const SnowfallEffect: React.FC = () => {
  const showBackground = useAtomValue(showBackGroundAtom);
  const [flakes, setFlakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const flake: Snowflake = {
        id: Date.now(),
        size: 6 + Math.random() * 8,
        left: Math.random() * 100,
        drift: Math.random() * 80 - 40,
        duration: 9 + Math.random() * 6,
        delay: Math.random() * 4,
      };

      setFlakes((prev) => {
        const next = [...prev, flake];
        if (next.length > 70) {
          next.shift();
        }
        return next;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  if (!showBackground) {
    return null;
  }

  return (
    <>
      {flakes.map((flake) => (
        <SnowflakeDot
          key={flake.id}
          $size={flake.size}
          $drift={flake.drift}
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
          }}
        />
      ))}
    </>
  );
};

export default SnowfallEffect;

const fall = (drift: number) => keyframes`
  0% {
    transform: translate3d(0, -10vh, 0);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  50% {
    transform: translate3d(${drift * 0.6}px, 50vh, 0) rotate(120deg);
  }
  100% {
    transform: translate3d(${drift}px, 110vh, 0) rotate(360deg);
    opacity: 0;
  }
`;

const SnowflakeDot = styled.span<{ $size: number; $drift: number }>`
  position: absolute;
  top: -20px;
  display: block;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  border-radius: 50%;
  background: ${({ theme }) =>
    theme.currentTheme === "dark"
      ? "rgba(255, 255, 255, 0.8)"
      : "rgba(209, 229, 255, 0.9)"};
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
  animation: ${({ $drift }) => fall($drift)} linear infinite;
  animation-duration: 10s;
  pointer-events: none;
  z-index: 9;
`;
