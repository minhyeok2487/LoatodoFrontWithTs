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

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const { items } = e.clipboardData;

    // 첫 번째 파일 항목만 처리
    const fileItem = Array.from(items).find((item) => item.kind === "file");
    if (fileItem) {
      e.preventDefault(); // 기본 붙여넣기 동작 방지
      const file = fileItem.getAsFile();
      if (file) {
        uploadCommunityImage.mutate(file); // 이미지 업로드
      }
    }
    // 파일이 아닐 경우, 기본 붙여넣기 동작을 허용
  };

  return (
    <Wrapper>
      <Description>
        <Inputs>
          <TextArea
            {...formik.getFieldProps("body")}
            placeholder="아크라시아에서 무슨 일이 있었나요?"
            onPaste={handlePaste}
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
            {formik.values.imageList.map((item, index) => (
              <li key={item.fileName}>
                <img src={item.url} alt="" />
                <DeleteButton
                  type="button"
                  onClick={() => {
                    // 이미지 삭제 로직 추가
                    formik.setFieldValue(
                      "imageList",
                      formik.values.imageList.filter((_, i) => i !== index)
                    );
                  }}
                >
                  X
                </DeleteButton>
              </li>
            ))}
          </ul>
        </Inputs>

        <Options>
          <FormControlLabel
            label={
              formik.getFieldProps("showName").value
                ? "닉네임 공개"
                : "닉네임 비공개"
            }
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
  padding: 24px 24px 20px 35px;
`;

const Inputs = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 10px;
  max-width: 80%;

  input[type="file"] {
    display: none;
  }

  ul {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-top: 10px;
    overflow-x: auto; /* 수평 스크롤 활성화 */
    padding: 10px 0; /* 패딩 추가 */
    white-space: nowrap; /* 줄 바꿈 방지 */
    max-width: 100%;

    li {
      position: relative;
      width: 150px;
      height: 150px;
      img {
        width: 100%;
        height: 100%;
        aspect-ratio: 1/1;
        border-radius: 4px;
        object-fit: cover;
      }
    }
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 40px;
  background: ${({ theme }) => theme.app.bg.white};

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

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: black;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  line-height: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background: darkgray;
  }
`;
