import styled from "@emotion/styled";
import { NativeSelect } from "@mui/material";
import { RiArrowDropDownLine } from "@react-icons/all-files/ri/RiArrowDropDownLine";

interface Props<V> {
  fullWidth?: boolean;
  options: { value: V; label: string }[];
  onChange: (value: V) => void;
  value: V;
}

const Select = <V extends number | string>({
  fullWidth,
  options,
  onChange,
  value,
}: Props<V>) => {
  return (
    <Wrapper
      fullWidth={fullWidth}
      IconComponent={RiArrowDropDownLine}
      value={value}
      onChange={(e) => {
        if (typeof e.target.value === "string") {
          onChange(e.target.value as V);
        } else {
          onChange(Number(e.target.value) as V);
        }
      }}
    >
      {options.map((item) => {
        return (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        );
      })}
    </Wrapper>
  );
};

export default Select;

const Wrapper = styled(NativeSelect)`
  && {
    font-size: 15px;
    color: ${({ theme }) => theme.app.text.dark1};
    padding: 0;
    border-bottom: none;

    &::before,
    &::after {
      display: none;
    }

    select {
      padding: 0 30px 0 12px !important;
      width: 100%;
      height: 36px;
      border: 1px solid ${({ theme }) => theme.app.border};
      border-radius: 6px;
      box-sizing: border-box;

      &:focus {
        background: transparent;
        outline-color: ${({ theme }) => theme.app.text.light1};
        outline-width: 1px;
        outline-style: solid;
      }

      option {
        background: ${({ theme }) => theme.app.bg.light};
      }
    }

    svg {
      color: ${({ theme }) => theme.app.text.dark1};
      font-size: 30px;
      margin-right: 4px;
    }
  }
`;
