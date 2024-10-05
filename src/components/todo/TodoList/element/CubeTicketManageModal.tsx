import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useState } from "react";
import styled from "styled-components";

import useUpdateCubeCharacter from "@core/hooks/mutations/cube/useUpdateCubeCharacter";
import type { CubeCharacter, CubeTicket } from "@core/types/cube";
import { getCubeTicketKeys, getCubeTicketNameByKey } from "@core/utils";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";

interface Position {
  x: number;
  y: number;
}

interface Props {
  cubeCharacter: CubeCharacter;
  position: Position;
}

const CubeTicketManageModal = ({ cubeCharacter, position }: Props) => {
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getCubeTicketKeys(cubeCharacter).reduce<CubeTicket>(
      (acc, key) => ({ ...acc, [key]: cubeCharacter[key] || 0 }),
      {}
    ),
    onSubmit: () => {},
  });

  const updateCubeCharacter = useUpdateCubeCharacter({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCubeCharacters(),
      });

      setIsEditing(false);
    },
  });

  const cubeTicketKeys = getCubeTicketKeys(cubeCharacter);

  return (
    <Wrapper $position={position}>
      <CubeStages>
        {cubeTicketKeys
          .map((key) => ({
            label: getCubeTicketNameByKey(key),
            name: key,
          }))
          .map((item) => (
            <StageRow key={item.name}>
              <StageLabel>{item.label}</StageLabel>
              <StageInput
                type="number"
                disabled={!isEditing}
                {...formik.getFieldProps(item.name)}
              />
            </StageRow>
          ))}
      </CubeStages>

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={() => {
          if (isEditing) {
            updateCubeCharacter.mutate({
              cubeId: cubeCharacter.cubeId,
              characterId: cubeCharacter.characterId,
              ...formik.values,
            });
          } else {
            setIsEditing(true);
          }
        }}
      >
        {isEditing ? "저장" : "수정"}
      </Button>
    </Wrapper>
  );
};

export default CubeTicketManageModal;

const Wrapper = styled.div<{ $position: Position }>`
  z-index: 1;
  position: absolute;
  top: ${({ $position }) => ($position ? `${$position.y}px` : "unset")};
  left: ${({ $position }) => ($position ? `${$position.x}px` : "unset")};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 16px;
  padding: 18px;
  color: ${({ theme }) => theme.app.text.dark1};
  border: 1px solid ${({ theme }) => theme.app.border};
  background-color: ${({ theme }) => theme.app.bg.white};
`;

const CubeStages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
`;

const StageRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
`;

const StageLabel = styled.span`
  font-size: 16px;
`;

const StageInput = styled.input<{ disabled: boolean }>`
  width: 50px;
  height: 30px;
  padding: 0 5px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.dark1};
  background-color: ${(props) =>
    props.disabled ? "" : props.theme.app.bg.white};
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;
