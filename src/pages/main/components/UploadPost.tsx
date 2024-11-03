import { FormControlLabel, Switch } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import styled from "styled-components";

import { COMMUNITY_CATEGORY } from "@core/constants";
import { useUploadCommunityPost } from "@core/hooks/mutations/community";
import type { UploadCommunityPostRequest } from "@core/types/community";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";

const categoryOptions = Object.entries(COMMUNITY_CATEGORY).map(
  ([value, label]) => ({
    value,
    label,
  })
);

const UploadPost = () => {
  const queryClient = useQueryClient();
  const uploadCommunity = useUploadCommunityPost({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCommunityList(),
      });
    },
  });

  const formik = useFormik<
    Pick<
      UploadCommunityPostRequest,
      "body" | "category" | "imageList" | "showName"
    >
  >({
    initialValues: {
      body: "",
      category: "LIFE",
      imageList: [],
      showName: false,
    },
    onSubmit: (values) => {
      uploadCommunity.mutate(values);
      formik.resetForm();
    },
  });

  return (
    <Wrapper>
      <Description>
        <TextArea
          {...formik.getFieldProps("body")}
          placeholder="아크라시아에서 무슨 일이 있었나요?"
        />

        <Options>
          <FormControlLabel
            label="닉네임 공개"
            labelPlacement="start"
            control={<Switch {...formik.getFieldProps("showName")} />}
          />

          <Button
            size="large"
            onClick={formik.submitForm}
            disabled={uploadCommunity.isPending}
          >
            게시하기
          </Button>
        </Options>
      </Description>

      <Categories>
        <dt>카테고리</dt>
        <dd>
          <ul>
            {categoryOptions.map((item) => (
              <li key={item.value}>
                <Button
                  size="medium"
                  variant={
                    formik.values.category === item.value
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => {
                    formik.setFieldValue("category", item.value);
                  }}
                >
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </dd>
      </Categories>
    </Wrapper>
  );
};

export default UploadPost;

const Wrapper = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  border-radius: 8px;
`;

const Description = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  padding: 24px 24px 20px 24px;
`;

const TextArea = styled.textarea`
  flex: 1;

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light1};
  }
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;

  .MuiFormControlLabel-root {
    margin-left: 0;
  }
`;

const Categories = styled.dl`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 24px;
  width: 100%;
  gap: 44px;
  border-top: 1px solid ${({ theme }) => theme.app.border};

  dt {
    font-size: 15px;
    color: ${({ theme }) => theme.app.text.light1};
  }

  dd {
    flex: 1;

    ul {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }
  }
`;
