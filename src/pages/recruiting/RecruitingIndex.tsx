import useRecruitings from "@core/hooks/queries/recruiting/useRecruitings";

const RecruitingIndex = () => {
  const getRecruitings = useRecruitings({
    limit: 25,
    page: 1,
    recruitingCategory: "FRIENDS",
  });

  console.log(getRecruitings.data);

  return <>sdf</>;
};

export default RecruitingIndex;
