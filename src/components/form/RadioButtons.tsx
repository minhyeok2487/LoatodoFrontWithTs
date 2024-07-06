import styled from "@emotion/styled";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

interface Props<V> {
  options: { value: V; label: string }[];
  onChange: (value: V) => void;
  value: V;
}

const RadioButtons = <V extends string | number>({
  options,
  onChange,
  value,
}: Props<V>) => {
  return (
    <Wrapper
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
          <FormControlLabel
            key={item.value}
            value={item.value}
            control={<Radio />}
            label={item.label}
          />
        );
      })}
    </Wrapper>
  );
};

export default RadioButtons;

export const Wrapper = styled(RadioGroup)``;
