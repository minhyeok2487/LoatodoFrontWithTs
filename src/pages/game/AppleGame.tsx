import type React from "react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

const generateNumbers = (): number[] => {
  return Array.from(
    { length: 17 * 8 },
    () => Math.floor(Math.random() * 9) + 1
  );
};

const AppleGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    new Set()
  );
  const [score, setScore] = useState<number>(0);
  const [dragging, setDragging] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [endPos, setEndPos] = useState<{ x: number; y: number } | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(120); // 120 seconds
  const [gameOver, setGameOver] = useState<boolean>(false);

  const cellSize = 40;
  const gap = 15;
  const gridWidth = 17;
  const gridHeight = 8;
  const totalWidth = gridWidth * (cellSize + gap) - gap;
  const totalHeight = gridHeight * (cellSize + gap) - gap;
  const padding = 20;
  const canvasWidth = totalWidth + 2 * padding;
  const canvasHeight = totalHeight + 2 * padding;

  // Timer logic
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameOver(true);
            setGameStarted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [gameStarted, gameOver]);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = "bold 30px Arial";

    // Draw apples
    numbers.forEach((num, index) => {
      const row = Math.floor(index / gridWidth);
      const col = index % gridWidth;
      const x = padding + col * (cellSize + gap);
      const y = padding + row * (cellSize + gap);

      if (num > 0) {
        ctx.beginPath();
        ctx.arc(
          x + cellSize / 2,
          y + cellSize / 2,
          cellSize / 2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = selectedIndices.has(index) ? "#e74c3c" : "#ff5733";
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "bold 25px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(num.toString(), x + cellSize / 2, y + cellSize / 2 + 2);
      }
    });

    // Draw selection rectangle if dragging
    if (dragging && startPos && endPos) {
      const adjustedStartX = startPos.x + padding;
      const adjustedStartY = startPos.y + padding;
      const adjustedEndX = endPos.x + padding;
      const adjustedEndY = endPos.y + padding;
      const minX = Math.min(adjustedStartX, adjustedEndX);
      const minY = Math.min(adjustedStartY, adjustedEndY);
      const maxX = Math.max(adjustedStartX, adjustedEndX);
      const maxY = Math.max(adjustedStartY, adjustedEndY);

      ctx.strokeStyle = "#3498db";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
      ctx.setLineDash([]);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        draw(ctx);
      }
    }
  }, [numbers, selectedIndices, dragging, startPos, endPos]);

  const getIndexFromPosition = (x: number, y: number): number | null => {
    const adjustedX = x - padding;
    const adjustedY = y - padding;
    const col = Math.floor(adjustedX / (cellSize + gap));
    const row = Math.floor(adjustedY / (cellSize + gap));
    if (col >= 0 && col < gridWidth && row >= 0 && row < gridHeight) {
      return row * gridWidth + col;
    }
    return null;
  };

  const getIndicesInRect = (
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): Set<number> => {
    const indices = new Set<number>();
    const adjustedStartX = startX - padding;
    const adjustedStartY = startY - padding;
    const adjustedEndX = endX - padding;
    const adjustedEndY = endY - padding;
    const minX = Math.min(adjustedStartX, adjustedEndX);
    const minY = Math.min(adjustedStartY, adjustedEndY);
    const maxX = Math.max(adjustedStartX, adjustedEndX);
    const maxY = Math.max(adjustedStartY, adjustedEndY);

    for (let row = 0; row < gridHeight; row += 1) {
      for (let col = 0; col < gridWidth; col += 1) {
        const x = col * (cellSize + gap);
        const y = row * (cellSize + gap);
        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
          const index = row * gridWidth + col;
          indices.add(index);
        }
      }
    }
    return indices;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!gameStarted || gameOver) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - padding;
      const y = e.clientY - rect.top - padding;

      setStartPos({ x, y });
      setEndPos({ x, y });
      setDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && startPos) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - padding;
        const y = e.clientY - rect.top - padding;

        setEndPos({ x, y });
        if (startPos) {
          setSelectedIndices(getIndicesInRect(startPos.x, startPos.y, x, y));
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (dragging && startPos && endPos) {
      const selectedNumbers = Array.from(selectedIndices)
        .map((idx) => numbers[idx] || 0)
        .filter((num) => num > 0);
      const sum = selectedNumbers.reduce((acc, num) => acc + num, 0);
      if (sum === 10) {
        setScore((prev) => prev + 10);
        setNumbers((prev) =>
          prev.map((num, idx) =>
            selectedIndices.has(idx) && num > 0 ? 0 : num
          )
        );
      }
      setSelectedIndices(new Set());
    }
    setDragging(false);
    setStartPos(null);
    setEndPos(null);
  };

  const startGame = () => {
    setNumbers(generateNumbers());
    setScore(0);
    setTimeLeft(120);
    setGameStarted(true);
    setGameOver(false);
  };

  const retryGame = () => {
    startGame();
  };

  return (
    <DefaultLayout>
      <Container>
        <Title>🍎 사과 게임 🍎</Title>
        <Score>점수: {score}</Score>
        {!gameStarted && !gameOver ? (
          <StartButton onClick={startGame}>게임 시작</StartButton>
        ) : gameOver ? (
          <GameOverContainer>
            <GameOverText>게임 종료!</GameOverText>
            <GameOverScore>최종 점수: {score}</GameOverScore>
            <RetryButton onClick={retryGame}>재도전</RetryButton>
          </GameOverContainer>
        ) : (
          <>
            <Canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseOut={handleMouseUp}
            />
            <ProgressBarContainer canvasWidth={canvasWidth}>
              <ProgressBar progress={(timeLeft / 120) * 100} />
            </ProgressBarContainer>
          </>
        )}
      </Container>
    </DefaultLayout>
  );
};

export default AppleGame;

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #2ecc71;
  border: 10px solid #27ae60;
  border-radius: 12px;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: white;
`;

const Score = styled.p`
  font-size: 18px;
  color: white;
`;

const Canvas = styled.canvas`
  border: 3px solid #2c3e50;
  background-color: #d1f2eb;
  border-radius: 10px;
  font-weight: bold;
`;

const StartButton = styled.button`
  background: #3b82f6;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  transition: background 0.2s ease-in-out;
  &:hover {
    background: #2563eb;
  }
`;

const GameOverContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const GameOverText = styled.h2`
  font-size: 24px;
  color: white;
  font-weight: bold;
`;

const GameOverScore = styled.p`
  font-size: 20px;
  color: white;
`;

const RetryButton = styled.button`
  background: #e74c3c;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: background 0.2s ease-in-out;
  &:hover {
    background: #c0392b;
  }
`;

const ProgressBarContainer = styled.div<{ canvasWidth: number }>`
  width: ${(props) => props.canvasWidth}px;
  height: 20px;
  background: #ecf0f1;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 16px;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background: #3498db;
  transition: width 1s linear;
`;
