import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import { addContent } from "@core/apis/admin.content.api";
import type { AddContentRequest } from "@core/types/admin.content";
import { Category, WeekContentCategory } from "@core/types/admin.content";

import Button from "@components/Button";

const initialContent: AddContentRequest = {
  contentType: "day",
  name: "",
  level: 0,
  category: Category.카오스던전,
};

const ContentCreate = () => {
  const [contents, setContents] = useState<AddContentRequest[]>([
    initialContent,
  ]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const newContents = [...contents];
    newContents[index] = {
      ...newContents[index],
      [name]:
        name === "level" ||
        name === "gate" ||
        name === "gold" ||
        name === "characterGold" ||
        name === "coolTime" ||
        name === "moreRewardGold" ||
        name === "shilling" ||
        name === "honorShard" ||
        name === "leapStone" ||
        name === "destructionStone" ||
        name === "guardianStone" ||
        name === "jewelry" ||
        name === "solarGrace" ||
        name === "solarBlessing" ||
        name === "solarProtection" ||
        name === "cardExp" ||
        name === "lavasBreath" ||
        name === "glaciersBreath"
          ? Number(value)
          : value,
    };
    setContents(newContents);
  };

  const handleAddContent = () => {
    setContents([...contents, initialContent]);
  };

  const handleRemoveContent = (index: number) => {
    const newContents = [...contents];
    newContents.splice(index, 1);
    setContents(newContents);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await Promise.all(contents.map((content) => addContent(content)));
      toast.success("컨텐츠가 성공적으로 추가되었습니다.");
      setContents([initialContent]);
    } catch (error) {
      toast.error("컨텐츠 추가에 실패했습니다.");
    }
  };

  return (
    <DefaultLayout>
      <Container>
        <Title>새 컨텐츠 추가</Title>
        <Form onSubmit={handleSubmit}>
          {contents.map((content, index) => (
            <ContentForm key={index}>
              <FormGroup>
                <Label htmlFor={`contentType-${index}`}>컨텐츠 타입</Label>
                <Select
                  name="contentType"
                  id={`contentType-${index}`}
                  value={content.contentType}
                  onChange={(e) => handleChange(index, e)}
                >
                  <option value="day">일일 숙제</option>
                  <option value="week">주간 숙제</option>
                  <option value="cube">큐브</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor={`name-${index}`}>이름</Label>
                <Input
                  type="text"
                  id={`name-${index}`}
                  name="name"
                  value={content.name}
                  onChange={(e) => handleChange(index, e)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor={`level-${index}`}>아이템 레벨</Label>
                <Input
                  type="number"
                  id={`level-${index}`}
                  name="level"
                  value={content.level}
                  onChange={(e) => handleChange(index, e)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor={`category-${index}`}>카테고리</Label>
                <Select
                  name="category"
                  id={`category-${index}`}
                  value={content.category}
                  onChange={(e) => handleChange(index, e)}
                  required
                >
                  {Object.values(Category).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              {content.contentType === "day" && (
                <StyledSection>
                  <FormGroup>
                    <Label htmlFor={`shilling-${index}`}>실링</Label>
                    <Input
                      type="number"
                      id={`shilling-${index}`}
                      name="shilling"
                      value={content.shilling || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={`honorShard-${index}`}>파편</Label>
                    <Input
                      type="number"
                      id={`honorShard-${index}`}
                      name="honorShard"
                      value={content.honorShard || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={`leapStone-${index}`}>돌파석</Label>
                    <Input
                      type="number"
                      id={`leapStone-${index}`}
                      name="leapStone"
                      value={content.leapStone || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={`destructionStone-${index}`}>파괴석</Label>
                    <Input
                      type="number"
                      id={`destructionStone-${index}`}
                      name="destructionStone"
                      value={content.destructionStone || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={`guardianStone-${index}`}>수호석</Label>
                    <Input
                      type="number"
                      id={`guardianStone-${index}`}
                      name="guardianStone"
                      value={content.guardianStone || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={`jewelry-${index}`}>보석</Label>
                    <Input
                      type="number"
                      id={`jewelry-${index}`}
                      name="jewelry"
                      value={content.jewelry || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                </StyledSection>
              )}

              {content.contentType === "week" && (
                <StyledSection>
                  <FormGroup>
                    <Label htmlFor={`weekCategory-${index}`}>
                      주간 카테고리 (컨텐츠 이름과 동일)
                    </Label>
                    <Input
                      type="text"
                      id={`weekCategory-${index}`}
                      name="weekCategory"
                      value={content.weekCategory || ""}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={`weekContentCategory-${index}`}>
                      난이도
                    </Label>
                    <Select
                      name="weekContentCategory"
                      id={`weekContentCategory-${index}`}
                      value={content.weekContentCategory || ""}
                      onChange={(e) => handleChange(index, e)}
                    >
                      {Object.values(WeekContentCategory).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={`gate-${index}`}>관문</Label>
                    <Input
                      type="number"
                      id={`gate-${index}`}
                      name="gate"
                      value={content.gate || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={`gold-${index}`}>수익</Label>
                    <Input
                      type="number"
                      id={`gold-${index}`}
                      name="gold"
                      value={content.gold || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={`characterGold-${index}`}>
                      캐릭터 귀속 골드
                    </Label>
                    <Input
                      type="number"
                      id={`characterGold-${index}`}
                      name="characterGold"
                      value={content.characterGold || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={`coolTime-${index}`}>주기</Label>
                    <Input
                      type="number"
                      id={`coolTime-${index}`}
                      name="coolTime"
                      value={content.coolTime || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={`moreRewardGold-${index}`}>
                      더보기 비용
                    </Label>
                    <Input
                      type="number"
                      id={`moreRewardGold-${index}`}
                      name="moreRewardGold"
                      value={content.moreRewardGold || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                </StyledSection>
              )}

              {content.contentType === "cube" && (
                <StyledSection>
                  <FormGroup>
                    <Label htmlFor={`solarGrace-${index}`}>태양의 은총</Label>
                    <Input
                      type="number"
                      id={`solarGrace-${index}`}
                      name="solarGrace"
                      value={content.solarGrace || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={`solarBlessing-${index}`}>
                      태양의 축복
                    </Label>
                    <Input
                      type="number"
                      id={`solarBlessing-${index}`}
                      name="solarBlessing"
                      value={content.solarBlessing || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={`solarProtection-${index}`}>
                      태양의 가호
                    </Label>
                    <Input
                      type="number"
                      id={`solarProtection-${index}`}
                      name="solarProtection"
                      value={content.solarProtection || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={`cardExp-${index}`}>카드 경험치</Label>
                    <Input
                      type="number"
                      id={`cardExp-${index}`}
                      name="cardExp"
                      value={content.cardExp || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={`lavasBreath-${index}`}>용암의 숨결</Label>
                    <Input
                      type="number"
                      id={`lavasBreath-${index}`}
                      name="lavasBreath"
                      value={content.lavasBreath || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={`glaciersBreath-${index}`}>
                      빙하의 숨결
                    </Label>
                    <Input
                      type="number"
                      id={`glaciersBreath-${index}`}
                      name="glaciersBreath"
                      value={content.glaciersBreath || 0}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </FormGroup>
                </StyledSection>
              )}

              <Button
                type="button"
                onClick={() => handleRemoveContent(index)}
                color="red"
              >
                삭제
              </Button>
            </ContentForm>
          ))}
          <Button type="button" onClick={handleAddContent}>
            컨텐츠 추가
          </Button>
          <Button type="submit" color="primary">
            모두 추가하기
          </Button>
        </Form>
      </Container>
    </DefaultLayout>
  );
};

export default ContentCreate;

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  color: ${({ theme }) => theme.app.text.main};
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ContentForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: bold;
  color: ${({ theme }) => theme.app.text.dark2};
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 5px;
  font-size: 16px;
  background: ${({ theme }) => theme.app.bg.main};
  color: ${({ theme }) => theme.app.text.main};
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 5px;
  font-size: 16px;
  background: ${({ theme }) => theme.app.bg.main};
  color: ${({ theme }) => theme.app.text.main};
`;

const StyledSection = styled.div`
  grid-column: span 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
  background: ${({ theme }) => theme.app.bg.gray1};
`;
