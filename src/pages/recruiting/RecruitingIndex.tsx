import DefaultLayout from "@layouts/DefaultLayout";

import List from "@components/recruiting/List";

const RecruitingIndex = () => {
  return (
    <DefaultLayout pageTitle="모집 게시판">
      <List category="FRIENDS" />
      <List category="LOOKING_PARTY" />
      <List category="LOOKING_GUILD" />
      <List category="ETC" />
    </DefaultLayout>
  );
};

export default RecruitingIndex;
