import { MdSettings } from "@react-icons/all-files/md/MdSettings";
import { useRef } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";

import useModalState from "@core/hooks/useModalState";
import {
  DEFAULT_GRID_CONFIG,
  type GridConfig,
} from "@core/hooks/usePersistedGridConfig";

import Button from "@components/Button";
import Modal from "@components/Modal";

interface Props {
  gridConfig: GridConfig;
  showWide: boolean;
  onConfigChange: (config: GridConfig) => void;
}

const GridConfigPanel = ({ gridConfig, showWide, onConfigChange }: Props) => {
  const [configModal, setConfigModal] = useModalState<boolean>();

  const normalColumnsRef = useRef<HTMLInputElement>(null);
  const wideColumnsRef = useRef<HTMLInputElement>(null);

  const saveGridConfig = () => {
    const normalColumns =
      Number(normalColumnsRef.current?.value) ||
      DEFAULT_GRID_CONFIG.normalColumns;
    const wideColumns =
      Number(wideColumnsRef.current?.value) || DEFAULT_GRID_CONFIG.wideColumns;

    // 유효성 검사
    if (normalColumns < 2 || normalColumns > 8) {
      toast.error("일반 모드 컬럼 수는 2 ~ 8개 사이여야 합니다.");
      return;
    }

    if (wideColumns < 2 || wideColumns > 12) {
      toast.error("와이드 모드 컬럼 수는 2 ~ 12개 사이여야 합니다.");
      return;
    }

    if (normalColumns > wideColumns) {
      toast.error("와이드 모드 컬럼 수는 일반 모드보다 같거나 많아야 합니다.");
      return;
    }

    // 설정 저장
    onConfigChange({ normalColumns, wideColumns });
    setConfigModal(false);
    toast.success("그리드 설정이 저장되었습니다.");
  };

  const resetGridConfig = () => {
    onConfigChange(DEFAULT_GRID_CONFIG);
    toast.success("그리드 설정이 초기화되었습니다.");
  };

  return (
    <>
      <ControlsWrapper>
        <Button onClick={() => setConfigModal(true)} css={configButtonCss}>
          <MdSettings size="16" />
          그리드 설정
        </Button>
        <ConfigInfo>
          컬럼: {showWide ? gridConfig.wideColumns : gridConfig.normalColumns}개
          {showWide ? " (와이드 모드)" : " (일반 모드)"}
        </ConfigInfo>
      </ControlsWrapper>

      {/* 그리드 설정 모달 */}
      <Modal
        title="그리드 설정"
        isOpen={!!configModal}
        onClose={() => setConfigModal(false)}
      >
        <ConfigForm
          onSubmit={(e) => {
            e.preventDefault();
            saveGridConfig();
          }}
        >
          <ConfigRow>
            <ConfigField>
              <Label>일반 모드 컬럼 수</Label>
              <Input
                type="number"
                defaultValue={gridConfig.normalColumns}
                min="2"
                max="8"
                ref={normalColumnsRef}
                placeholder="2 ~ 8"
              />
              <HelperText>기본 화면에서의 컬럼 수 (2 ~ 8개)</HelperText>
            </ConfigField>

            <ConfigField>
              <Label>와이드 모드 컬럼 수</Label>
              <Input
                type="number"
                defaultValue={gridConfig.wideColumns}
                min="2"
                max="12"
                ref={wideColumnsRef}
                placeholder="2 ~ 12"
              />
              <HelperText>와이드 화면에서의 컬럼 수 (2 ~ 12개)</HelperText>
            </ConfigField>
          </ConfigRow>

          <PreviewSection>
            <PreviewTitle>현재 설정</PreviewTitle>
            <PreviewGrid>
              <PreviewItem>
                일반 모드: <strong>{gridConfig.normalColumns}개</strong>
              </PreviewItem>
              <PreviewItem>
                와이드 모드: <strong>{gridConfig.wideColumns}개</strong>
              </PreviewItem>
              <PreviewItem>
                현재 활성:{" "}
                <strong>{showWide ? "와이드 모드" : "일반 모드"}</strong>
              </PreviewItem>
            </PreviewGrid>

            <PreviewNote>
              💡 컬럼 너비는 화면 크기에 맞춰 자동으로 조절됩니다. 모바일에서는
              최소 2개 컬럼이 보장됩니다.
            </PreviewNote>
          </PreviewSection>

          <ConfigButtons>
            <Button type="button" onClick={resetGridConfig}>
              초기화
            </Button>
            <Button type="submit">저장</Button>
          </ConfigButtons>
        </ConfigForm>
      </Modal>
    </>
  );
};

export default GridConfigPanel;

// 스타일 컴포넌트들은 대부분 동일하므로 주요 변경사항만 표시
const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const ConfigInfo = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.gray1};
`;

const configButtonCss = css`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  padding: 8px 12px;
`;

const ConfigForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const ConfigRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ConfigField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.main};
`;

const Input = styled.input`
  padding: 10px 12px;
  font-size: 14px;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 6px;
  height: 40px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.app.border};
  }
`;

const HelperText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.gray1};
`;

const PreviewSection = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const PreviewTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.main};
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PreviewItem = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.gray1};

  strong {
    color: ${({ theme }) => theme.app.text.main};
    font-weight: 600;
  }
`;

const PreviewNote = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.dark2};
  line-height: 1.4;
  padding: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  border-radius: 4px;
  border-left: 3px solid #3498db;
`;

const ConfigButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;
