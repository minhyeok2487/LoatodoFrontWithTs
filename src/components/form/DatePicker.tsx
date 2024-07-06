import styled from "@emotion/styled";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";

import CalendarIcon from "@assets/CalendarIcon";

interface Props {
  onChange: (newDate: Dayjs) => void;
  value: Dayjs;
  disablePast: boolean;
}

const DatePicker = ({ onChange, value, disablePast }: Props) => {
  return (
    <StyledDatePicker
      slots={{
        openPickerIcon: CalendarIcon,
      }}
      disablePast={disablePast}
      format="YYYY-MM-DD"
      value={value}
      onChange={(newDate) => {
        if (newDate) {
          onChange(newDate);
        }
      }}
    />
  );
};

export default DatePicker;

const StyledDatePicker = styled(MuiDatePicker)`
  && {
    width: 160px;
    height: 36px;
    font-size: 15px;
    border: 1px solid ${({ theme }) => theme.app.border};
    border-radius: 6px;

    .MuiInputBase-root {
      height: 100%;

      input {
        flex: 1;
        padding: 0 0 0 12px;
        height: 100%;
        color: ${({ theme }) => theme.app.text.dark1};
      }

      button {
        color: ${({ theme }) => theme.app.text.dark1};
        width: 30px;
        height: 30px;
      }

      fieldset {
        height: 100%;
        border: none;
      }
    }
  }
`;
