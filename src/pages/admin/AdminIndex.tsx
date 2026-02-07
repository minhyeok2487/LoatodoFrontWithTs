import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { getAdsList, updateAdsDate } from "@core/apis/admin.ads.api";
import useMyInformation from "@core/hooks/queries/member/useMyInformation";
import type { AdsList } from "@core/types/admin.ads";

import Button from "@components/Button";

const AdminIndex = () => {
  const user = useMyInformation();
  const navigate = useNavigate();
  const [adsList, setAdsList] = useState<AdsList>({
    content: [],
    hasNext: true,
  });
  const [isFetching, setIsFetching] = useState(false);

  const fetchAdsList = async (adsId?: number) => {
    if (isFetching || !adsList.hasNext) return; // Prevent multiple fetches and if no more ads
    setIsFetching(true);
    try {
      const adsResponse = await getAdsList({ adsId }); // Fetch ads
      setAdsList((prev) => ({
        content: [...prev.content, ...adsResponse.content], // Append new ads
        hasNext: adsResponse.hasNext, // Update hasNext based on response
      }));
    } catch (error) {
      toast.error("광고 목록을 가져오는 데 실패했습니다.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!user.data) {
      return;
    }

    if (user.data.role !== "ADMIN") {
      toast.warn("권한이 없습니다.");
      navigate("/");
      return;
    }

    // Initial fetch
    fetchAdsList();
  }, [user.data, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (
        documentHeight - (scrollTop + windowHeight) < 50 &&
        adsList.hasNext && // Only fetch if there are more ads
        !isFetching // Only fetch if not currently fetching
      ) {
        const lastAdId =
          adsList.content.length > 0
            ? adsList.content[adsList.content.length - 1].adsId
            : undefined; // Get the last adsId
        fetchAdsList(lastAdId); // Fetch more ads using the last adsId
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [adsList, isFetching]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const price = formData.get("price");
    const proposerEmail = formData.get("proposerEmail");

    if (price === null) {
      toast.error("가격과 이메일을 입력해 주세요."); // Error message for null values
      return;
    }

    try {
      await updateAdsDate({
        proposerEmail: proposerEmail as string,
        price: Number(price),
      });
      toast.success("후원 처리가 안료 되었습니다."); // Success message

      setAdsList((prev) => ({
        ...prev,
        content: prev.content.map((ad) =>
          ad.proposerEmail === proposerEmail ? { ...ad, checked: true } : ad
        ),
      }));
    } catch (error) {
      toast.error("후원 처리를 실패하였습니다.");
    }
  };

  return (
    <DefaultLayout>
      <Container>
        <Title>후원 목록</Title>
        <AdList>
          {adsList.content.map((ad) => (
            <AdItem key={ad.adsId}>
              <AdId>광고 ID: {ad.adsId}</AdId>
              <AdDetail>
                신청일:{" "}
                {new Date(ad.createdDate).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </AdDetail>
              <AdDetail>입급자: {ad.name}</AdDetail>
              <AdDetail>후원 이메일: {ad.proposerEmail}</AdDetail>
              <AdDetail>
                {ad.checked ? (
                  "처리 완료"
                ) : (
                  <div>
                    <form onSubmit={handleSubmit}>
                      <input
                        type="hidden"
                        name="proposerEmail"
                        value={ad.proposerEmail}
                      />
                      <input
                        type="number"
                        placeholder="금액 입력"
                        name="price"
                        required
                      />
                      <Button type="submit">처리</Button>
                    </form>
                  </div>
                )}
              </AdDetail>
            </AdItem>
          ))}
        </AdList>
      </Container>
    </DefaultLayout>
  );
};

export default AdminIndex;

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
`;

const AdList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px; // Space between ad items
`;

const AdItem = styled.div`
  padding: 15px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AdId = styled.p`
  font-weight: bold;
`;

const AdDetail = styled.p`
  margin: 5px 0;
`;
