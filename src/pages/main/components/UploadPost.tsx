import { Switch } from "@mui/material";
import { useFormik } from "formik";
import styled from "styled-components";

const UploadPost = () => {
  const formik = useFormik({
    initialValues: {
      body: "",
      category: "",
      imageList: [],
      showName: false,
    },
    onSubmit: () => {},
  });

  return (
    <Wrapper>
      <Description>
        <TextArea {...formik.getFieldProps("body")} />
      </Description>
    </Wrapper>
  );
};

export default UploadPost;

const Wrapper = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
`;

const Description = styled.div`
  padding: 24px 24px 20px 24px;
  background: ${({ theme }) => theme.app.bg.white};
`;

const TextArea = styled.textarea`
  &::placeholder {
    color: ${({ theme }) => theme.app.text.light1};
  }
`;
