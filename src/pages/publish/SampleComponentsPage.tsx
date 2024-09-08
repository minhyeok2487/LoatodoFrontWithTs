import { MdGroupAdd } from "@react-icons/all-files/md/MdGroupAdd";
import dayjs from "dayjs";
import { useState } from "react";
import styled, { useTheme } from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import Button from "@components/Button";
import Checkbox from "@components/form/Checkbox";
import DatePicker from "@components/form/DatePicker";
import Divider from "@components/form/Divider";
import Select from "@components/form/Select";

import PiSword from "@assets/svg/PiSword";

const SampleComponentsPage = () => {
  const theme = useTheme();
  const [ta, setTa] = useState("");

  return (
    <DefaultLayout>
      <Wrapper>
        <Col>
          <Textarea
            placeholder="메모를 입력해주세요"
            onChange={(e) => setTa(e.target.value)}
            value={ta}
          />

          <Input
            placeholder="메모를 입력해주세요"
            onChange={(e) => setTa(e.target.value)}
            value={ta}
          />

          <DatePicker onChange={() => {}} value={dayjs()} />

          <Divider>디바이더</Divider>

          <Select
            fullWidth
            options={[
              {
                label: "옵션1",
                value: 1,
              },
              {
                label: "옵션2",
                value: 2,
              },
            ]}
            onChange={() => {}}
            value={1}
          />

          <Divider>디바이더</Divider>

          <Checkbox checked onChange={() => {}}>
            레이블레이블레이블레이블
          </Checkbox>
        </Col>

        <Row>
          <Col>
            <Button variant="contained" size="large" onClick={() => {}}>
              로아투두
            </Button>
            <Button variant="outlined" size="large" onClick={() => {}}>
              로아투두
            </Button>
            <Button variant="text" size="large" onClick={() => {}}>
              로아투두
            </Button>
            <Button variant="contained" onClick={() => {}}>
              로아투두
            </Button>
            <Button variant="outlined" onClick={() => {}}>
              로아투두
            </Button>
            <Button variant="text" onClick={() => {}}>
              로아투두
            </Button>
            <Button variant="contained" size="small" onClick={() => {}}>
              로아투두
            </Button>
            <Button variant="outlined" size="small" onClick={() => {}}>
              로아투두
            </Button>
            <Button variant="text" size="small" onClick={() => {}}>
              로아투두
            </Button>
          </Col>
          <Col>
            <Button
              variant="contained"
              size="large"
              color={theme.app.palette.red[650]}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="outlined"
              size="large"
              color={theme.app.palette.red[650]}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="text"
              size="large"
              color={theme.app.palette.red[650]}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="contained"
              color={theme.app.palette.red[650]}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="outlined"
              color={theme.app.palette.red[650]}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="text"
              color={theme.app.palette.red[650]}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="contained"
              size="small"
              color={theme.app.palette.red[650]}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="outlined"
              size="small"
              color={theme.app.palette.red[650]}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="text"
              size="small"
              color={theme.app.palette.red[650]}
              onClick={() => {}}
            >
              로아투두
            </Button>
          </Col>
          <Col>
            <Button
              variant="contained"
              size="large"
              startIcon={<MdGroupAdd />}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<MdGroupAdd />}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="text"
              size="large"
              startIcon={<MdGroupAdd />}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="contained"
              startIcon={<MdGroupAdd />}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="outlined"
              startIcon={<MdGroupAdd />}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="text"
              startIcon={<MdGroupAdd />}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<MdGroupAdd />}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<MdGroupAdd />}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="text"
              size="small"
              startIcon={<MdGroupAdd />}
              onClick={() => {}}
            >
              로아투두
            </Button>
            <Button
              variant="text"
              size="small"
              startIcon={<MdGroupAdd />}
              onClick={() => {}}
            >
              로아투두
            </Button>
          </Col>
          <Col>
            <Button
              variant="icon"
              size={25}
              color={theme.app.palette.green[350]}
              onClick={() => {}}
            >
              <MdGroupAdd />
            </Button>
            <Button
              variant="icon"
              size={20}
              color={theme.app.palette.green[350]}
              onClick={() => {}}
            >
              <MdGroupAdd />
            </Button>
            <Button
              variant="icon"
              size={25}
              color={theme.app.palette.green[350]}
              onClick={() => {}}
            >
              <PiSword />
            </Button>
            <Button
              variant="icon"
              size={20}
              color={theme.app.palette.green[350]}
              onClick={() => {}}
            >
              <PiSword />
            </Button>
            <Button variant="icon" size={25} onClick={() => {}}>
              <MdGroupAdd />
            </Button>
            <Button variant="icon" size={20} onClick={() => {}}>
              <MdGroupAdd />
            </Button>
            <Button variant="icon" size={25} onClick={() => {}}>
              <PiSword />
            </Button>
            <Button variant="icon" size={20} onClick={() => {}}>
              <PiSword />
            </Button>
          </Col>
        </Row>
      </Wrapper>
    </DefaultLayout>
  );
};

export default SampleComponentsPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: ${({ theme }) => theme.app.bg.white};
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Textarea = styled.textarea`
  display: block;
  padding: 4px 8px;
  width: 100%;
  height: 115px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
`;

const Input = styled.input`
  padding: 19px 16px;
  width: 100%;
  font-size: 16px;
  line-height: 1;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  color: ${({ theme }) => theme.app.text.dark1};
  background: ${({ theme }) => theme.app.bg.white};

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light1};
  }
`;
