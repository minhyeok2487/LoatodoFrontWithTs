import { FormControlLabel, Switch } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useRef } from "react";
import styled, { css } from "styled-components";

import { COMMUNITY_CATEGORY } from "@core/constants";
import {
  useUploadCommunityImage,
  useUploadCommunityPost,
} from "@core/hooks/mutations/community";
import type {
  UploadCommunityPostRequest,
  UploadedCommunityImage,
} from "@core/types/community";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";

import ImageIcon from "@assets/svg/ImageIcon";

const categoryOptions = Object.entries(COMMUNITY_CATEGORY).map(
  ([value, label]) => ({
    value,
    label,
  })
);

const UploadPost = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const uploadCommunity = useUploadCommunityPost({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCommunityList(),
      });
    },
  });
  const uploadCommunityImage = useUploadCommunityImage({
    onSuccess: ({ imageId, fileName, url }) => {
      formik.setFieldValue(
        "imageList",
        formik.values.imageList.concat({ imageId, fileName, url })
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
  });

  const formik = useFormik<
    Pick<UploadCommunityPostRequest, "body" | "category" | "showName"> & {
      imageList: UploadedCommunityImage[];
    }
  >({
    initialValues: {
      body: "",
      category: "LIFE",
      imageList: [],
      showName: false,
    },
    onSubmit: (values) => {
      uploadCommunity.mutate({
        ...values,
        imageList: values.imageList.map((image) => image.imageId),
      });
      formik.resetForm();
    },
  });

  return (
    <Wrapper>
      <Description>
        <Inputs>
          <TextArea
            {...formik.getFieldProps("body")}
            placeholder="아크라시아에서 무슨 일이 있었나요?"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                uploadCommunityImage.mutate(file);
              }
            }}
          />

          <Button
            css={imageUploadButton}
            size={24}
            variant="icon"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <ImageIcon />
          </Button>

          <ul>
            {formik.values.imageList.map((item) => (
              <li key={item.fileName}>
                <img src={item.url} alt="" />
              </li>
            ))}
          </ul>
        </Inputs>

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

const Inputs = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  input[type="file"] {
    display: none;
  }

  ul {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-top: 10px;

    li {
      position: relative;
      width: 120px;

      img {
        width: 100%;
        aspect-ratio: 1/1;
        border-radius: 4px;
        object-fit: cover;
      }
    }
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 84px;

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light1};
  }
`;

const imageUploadButton = css`
  padding: 0;
  border-radius: 4px;
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
