import styled from "styled-components";
import DefaultLayout from "@layouts/DefaultLayout";
import CommunityForm from "./components/CommunityForm";
import FollowSection from "./components/FollowSection";
import TagSection from "./components/TagSection";
import CommunityList from "./components/CommunityList";

const CommunityIndex = () => {
    return (
      <DefaultLayout>
        <Container>
          <TopSection>
            <FollowSection />
            <TagSection />
          </TopSection>
          <CommunityForm />
          <CommunityList />
        </Container>
      </DefaultLayout>
    );
  };
  
  const Container = styled.div`
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
  `;
  
  const TopSection = styled.div`
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: ${({ theme }) => theme.app.bg.white};
    padding: 20px;
    border-radius: 8px;
  `;

export default CommunityIndex;