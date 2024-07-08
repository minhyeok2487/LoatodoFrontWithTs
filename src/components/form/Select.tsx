import { NativeSelect } from "@mui/material";
import { RiArrowDropDownLine } from "@react-icons/all-files/ri/RiArrowDropDownLine";
import styled from "styled-components";

interface Props<V> {
  disabled?: boolean;
  fullWidth?: boolean;
  options: { value: V; label: string }[];
  onChange: (value: V) => void;
  value: V;
  placeholder?: string;
}

const Select = <V extends number | string>({
  disabled,
  fullWidth,
  options,
  onChange,
  value,
  placeholder,
}: Props<V>) => {
  if (options.length === 0) {
    return null;
  }
  return (
    <Wrapper
      disabled={disabled}
      fullWidth={fullWidth}
      IconComponent={RiArrowDropDownLine}
      value={value}
      $isPlaceholder={!!placeholder && !value}
      onChange={(e) => {
        if (typeof options[0].value === "string") {
          onChange(e.target.value as V);
        } else {
          onChange(Number(e.target.value) as V);
        }
      }}
    >
      {placeholder && (
        <option disabled value="">
          {placeholder}
        </option>
      )}
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

const Wrapper = styled(NativeSelect)<{ $isPlaceholder: boolean }>`
  && {
    font-size: 15px;
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
      color: ${({ theme }) => theme.app.text.dark1};

      &:disabled {
        -webkit-text-fill-color: unset;
        color: ${({ theme }) => theme.app.text.light1};
        cursor: not-allowed;

        & + svg {
          color: ${({ theme }) => theme.app.text.light1};
        }
      }

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
