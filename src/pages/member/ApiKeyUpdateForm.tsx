import React, { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button, Grid, TextField, Typography } from "@mui/material";
import * as memberApi from "../../core/apis/Member.api";
import DefaultLayout from "../../layouts/DefaultLayout";

const ApiKeyUpdateForm: React.FC = () => {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const response = await memberApi.editApikey(data.get("apiKey") as string);
      if (response) {
        alert("API KEY 변경이 완료되었습니다.");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error saveSort:", error);
    }
  };

  return (
    <>
      <DefaultLayout>
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                component="h1"
                variant="h5"
                textAlign={"center"}
                style={{ color: "var(--text-color)" }}
              >
                API KEY 업데이트
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="apiKey"
                variant="outlined"
                required
                fullWidth
                id="apiKey"
                label="로스트아크 API KEY"
              />
              <Link
                to="https://canfactory.tistory.com/1081"
                target="_blank"
                style={{ color: "var(--text-color)" }}
              >
                API KEY 발급하는 방법이 궁금해요!
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                API KEY 업데이트
              </Button>
            </Grid>
          </Grid>
        </form>
      </DefaultLayout>
    </>
  );
};

export default ApiKeyUpdateForm;
