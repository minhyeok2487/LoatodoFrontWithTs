import { useState } from "react";
import styled from "styled-components";

type Props = {
  imageList: string[];
  onImageClick: (image: string) => void;
};

const ImageList: React.FC<Props> = ({ imageList, onImageClick }) => {
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태 추가

  return (
    <ImageScrollContainer
      onClick={(e) => {
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        const startX = e.pageX - target.offsetLeft;
        const { scrollLeft } = target;

        const handleMouseMove = (e: MouseEvent) => {
          setIsDragging(true); // 드래그 시작
          const x = e.pageX - target.offsetLeft;
          const walk = (x - startX) * 1;
          target.scrollLeft = scrollLeft - walk;
        };

        const handleMouseUp = () => {
          setTimeout(() => {
            setIsDragging(false); // 드래그 종료
          }, 0); // 약간의 지연 후 상태 업데이트
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }}
    >
      <ImageContainer>
        {imageList.map((image) => (
          <Wrapper
            key={image}
            onClick={() => {
              if (!isDragging) {
                onImageClick(image); // 드래그 중이 아닐 때만 호출
              }
            }}
          >
            <Image src={image} />
          </Wrapper>
        ))}
      </ImageContainer>
    </ImageScrollContainer>
  );
};

export default ImageList;

const ImageScrollContainer = styled.div`
  overflow-x: auto; /* Enable horizontal scrolling */
  white-space: nowrap; /* Prevent line breaks */
  scrollbar-width: none; /* Hide scrollbar for Firefox */

  &::-webkit-scrollbar {
    display: none; /* Hide scrollbar for Chrome, Safari, and Edge */
  }
`;

const ImageContainer = styled.div`
  display: inline-flex; /* Use inline-flex to allow horizontal alignment */
  flex-direction: row;
  margin-top: 5px;
  gap: 5px; /* Space between images */
  padding-right: 10px; /* Optional: space to ensure the last image is partially visible */
`;

const Wrapper = styled.div<{ onClick?: () => void }>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
`;

const Image = styled.img`
  width: auto; // 너비를 자동으로 설정하여 비율 유지
  height: 100%; // 높이를 100%로 설정하여 최대 높이에 맞춤
  max-height: 300px; // 최대 높이를 설정하여 크기 조정
  object-fit: cover; // 비율이 맞지 않을 경우 크롭
  border-radius: 10px;
  overflow: hidden; // 넘치는 부분 숨김
`;
