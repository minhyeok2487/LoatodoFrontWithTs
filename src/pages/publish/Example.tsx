import styled from "@emotion/styled";

import DefaultLayout from "@layouts/DefaultLayout";

export default () => {
  return (
    <DefaultLayout>
      <Wrapper>
        <div className="hi">퍼블리싱 양식</div>
        <div className="row">
          <div className="label">라벨</div>
          <div className="description">
            내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용
          </div>
        </div>
      </Wrapper>
    </DefaultLayout>
  );
};

const Wrapper = styled.div`
  .hi {
    color: red;
  }

  .row {
    display: flex;
    flex-direcion: row;
    align-items: center;
    gap: 10px;
  }
`;
