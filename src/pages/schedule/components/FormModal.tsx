import { MdClose } from "@react-icons/all-files/md/MdClose";
import { useQueryClient } from "@tanstack/react-query";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTheme } from "styled-components";

import useCreateSchedule from "@core/hooks/mutations/schedule/useCreateSchedule";
import useDeleteSchedule from "@core/hooks/mutations/schedule/useDeleteSchedule";
import useUpdateFriendsOfSchedule from "@core/hooks/mutations/schedule/useUpdateFriendsOfSchedule";
import useUpdateSchedule from "@core/hooks/mutations/schedule/useUpdateSchedule";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useWeekRaidCategories from "@core/hooks/queries/content/useWeekRaidCategories";
import useSchedule from "@core/hooks/queries/schedule/useSchedule";
import type {
  GetScheduleDetailRequest,
  ScheduleCategory,
  ScheduleRaidCategory,
  ScheduleItem,
  Weekday,
} from "@core/types/schedule";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import Modal from "@components/Modal";
import Checkbox from "@components/form/Checkbox";
import DatePicker from "@components/form/DatePicker";
import FriendCharacterSelector from "@components/form/FriendCharacterSelector";
import SelecterItem from "@components/form/FriendCharacterSelector/SelectorItem";
import Select from "@components/form/Select";

import {
  scheduleRaidCategoryOptions,
  scheduleCategoryOptions,
  weekdayOptions,
  hourOptions,
  minuteOptions,
} from "../constants";
import {
  RaidCategoryList,
  Wrapper,
  Header,
  Title,
  CloseButton,
  Form,
  Groups,
  Group,
  Input,
  Textarea,
  BottomButtons,
  bottomButtonCss,
  OnlyText,
  Message,
  ReadOnlyFriendCharacter,
} from "./FormModal.styles";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetSchedule?: ScheduleItem;
  year: number;
  month: number;
}

const FormModal = ({ isOpen, onClose, targetSchedule, month, year }: Props) => {
  const queryClient = useQueryClient();
  const theme = useTheme();

  const isRegister = targetSchedule === undefined;
  const isEdit = targetSchedule !== undefined && targetSchedule.isLeader;
  const isReadOnly = targetSchedule !== undefined && !targetSchedule.isLeader;
  const getScheduleParams = useMemo<
    GetScheduleDetailRequest | undefined
  >(() => {
    if (targetSchedule) {
      return {
        scheduleId: targetSchedule.scheduleId,
        leaderScheduleId: targetSchedule.isLeader
          ? undefined
          : targetSchedule.leaderScheduleId,
      };
    }

    return undefined;
  }, [targetSchedule]);
  const getSchedule = useSchedule(
    getScheduleParams as GetScheduleDetailRequest,
    {
      enabled: !!getScheduleParams,
    }
  );
  const getWeekRaidCategories = useWeekRaidCategories();
  const getCharacters = useCharacters();

  const createSchedule = useCreateSchedule({
    onSuccess: () => {
      toast.success("일정 등록이 완료되었습니다.");
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getSchedulesMonth({ year, month }),
      });
      onClose();
    },
  });

  const updateSchedule = useUpdateSchedule({
    onSuccess: () => {
      toast.success("일정 수정이 완료되었습니다.");
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getSchedulesMonth({ year, month }),
      });
      onClose();
    },
  });

  const deleteSchedule = useDeleteSchedule({
    onSuccess: () => {
      toast.success("일정 삭제가 완료되었습니다.");
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getSchedulesMonth({ year, month }),
      });
      onClose();
    },
  });

  const updateFriendsOfSchedule = useUpdateFriendsOfSchedule({
    onSuccess: () => {
      toast.success("일정에 속한 깐부가 수정되었습니다.");
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getSchedule(getScheduleParams),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getSchedules(),
      });
    },
  });

  const [leaderCharacterId, setLeaderCharacterId] = useState<number | "">("");
  const [scheduleRaidCategory, setScheduleRaidCategory] = useState<
    ScheduleRaidCategory | ""
  >("");
  const [targetRaidCategoryIds, setTargetRaidCategoryIds] = useState<number[]>(
    []
  );
  const [raidNameInput, setRaidNameInput] = useState("");
  const [scheduleCategory, setScheduleCategory] =
    useState<ScheduleCategory>("ALONE");
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [weekday, setWeekday] = useState<Weekday>("MONDAY");
  const [repeatWeek, setRepeatWeek] = useState(false);
  const [friendCharacterIdList, setFriendCharacterIdList] = useState<number[]>(
    []
  );
  const [memo, setMemo] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | undefined>();
  const [autoCheck, setAutoCheck] = useState(false);

  useEffect(() => {
    // 팝업 닫을 시 초기화
    if (!isOpen) {
      setLeaderCharacterId("");
      setScheduleRaidCategory("");
      setTargetRaidCategoryIds([]);
      setScheduleCategory("ALONE");
      setRaidNameInput("");
      setHour(0);
      setMinute(0);
      setWeekday("MONDAY");
      setRepeatWeek(false);
      setFriendCharacterIdList([]);
      setMemo("");
      setSelectedDate(undefined);
      setAutoCheck(true);
    }
  }, [isOpen]);

  useEffect(() => {
    // 수정모드일 때 초깃값 세팅
    if (
      getScheduleParams &&
      getSchedule.data &&
      getCharacters.data &&
      getWeekRaidCategories.data
    ) {
      const { data: schedule } = getSchedule;
      const raidCategory =
        schedule.scheduleRaidCategory === "RAID"
          ? getWeekRaidCategories.data.find((category) => {
              const splittedName = schedule.raidName.split(" ");
              const name = splittedName
                .reduce<string[]>((acc, word, index) => {
                  if (index < splittedName.length - 1) {
                    return acc.concat(word);
                  }

                  return acc;
                }, [])
                .join(" ");
              const weekContentCategory = splittedName[splittedName.length - 1];

              return (
                category.name === name &&
                category.weekContentCategory === weekContentCategory
              );
            }) || null
          : null;
      const [hour, minute] = schedule.time.split(":");

      if (schedule.scheduleRaidCategory === "RAID" && !raidCategory) {
        toast.error("레이드를 찾을 수 없습니다.");
        onClose();
        return;
      }

      setLeaderCharacterId(schedule.character.characterId);
      setScheduleRaidCategory(schedule.scheduleRaidCategory);
      if (schedule.scheduleRaidCategory === "RAID" && raidCategory) {
        setTargetRaidCategoryIds(raidCategory ? [raidCategory.categoryId] : []);
      }
      if (schedule.scheduleRaidCategory === "ETC") {
        setRaidNameInput(schedule.raidName);
      }
      if (schedule.scheduleCategory === "PARTY") {
        const idList =
          schedule.friendList?.map((friend) => friend.characterId) || [];
        setFriendCharacterIdList(idList);
      }
      setScheduleCategory(schedule.scheduleCategory);
      setWeekday(schedule.dayOfWeek);
      setHour(Number(hour));
      setMinute(Number(minute));
      setRepeatWeek(schedule.repeatWeek);
      setMemo(schedule.memo);
      setSelectedDate(dayjs(schedule.date || dayjs()));
      setAutoCheck(schedule.autoCheck); // 기존 값 세팅
    }
  }, [
    getScheduleParams,
    getSchedule.data,
    getCharacters.data,
    getWeekRaidCategories.data,
  ]);

  if (!getCharacters.data || !getWeekRaidCategories.data) {
    return null;
  }

  const targetLeaderCharacter = getCharacters.data.find(
    (item) => item.characterId === leaderCharacterId
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Wrapper>
        <Header>
          <Title>
            {(() => {
              if (isReadOnly) {
                return "일정 확인";
              }

              if (isEdit) {
                return "일정 수정";
              }

              return "일정 추가";
            })()}
          </Title>
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </Header>

        <Form
          onSubmit={(e) => {
            e.preventDefault();

            if (!scheduleRaidCategory) {
              toast.error("레이드를 선택해주세요.");
              return;
            }
            if (
              scheduleRaidCategory === "RAID" &&
              targetRaidCategoryIds.length === 0
            ) {
              toast.error("레이드 명을 선택해주세요.");
              return;
            }
            if (scheduleRaidCategory === "ETC" && !raidNameInput) {
              toast.error("레이드 명을 입력해주세요.");
              return;
            }

            if (isEdit) {
              updateSchedule.mutate({
                scheduleId: targetSchedule.scheduleId,
                dayOfWeek: weekday,
                time: dayjs()
                  .set("hour", hour)
                  .set("minute", minute)
                  .format("HH:mm"),
                memo,
                date: selectedDate
                  ? selectedDate.format("YYYY-MM-DD")
                  : undefined,
                autoCheck,
              });
            } else {
              if (scheduleRaidCategory === "RAID") {
                targetRaidCategoryIds.forEach((raidCategoryId) => {
                  const targetRaidCategory = getWeekRaidCategories.data.find(
                    (item) => item.categoryId === raidCategoryId
                  );

                  if (targetRaidCategory) {
                    createSchedule.mutate({
                      scheduleRaidCategory,
                      raidName: `${targetRaidCategory.name} ${targetRaidCategory.weekContentCategory}`,
                      raidLevel: targetRaidCategory.level as number,
                      scheduleCategory,
                      dayOfWeek: weekday,
                      time: dayjs()
                        .set("hour", hour)
                        .set("minute", minute)
                        .format("HH:mm"),
                      repeatWeek,
                      leaderCharacterId: getCharacters.data.find(
                        (item) => item.characterId === leaderCharacterId
                      )?.characterId as number,
                      friendCharacterIdList,
                      memo,
                      date: selectedDate
                        ? selectedDate.format("YYYY-MM-DD")
                        : undefined,
                      autoCheck,
                    });
                  }
                });
              } else {
                createSchedule.mutate({
                  scheduleRaidCategory,
                  raidName: (() => {
                    switch (scheduleRaidCategory) {
                      case "GUARDIAN":
                        return "가디언 토벌";
                      default:
                        return raidNameInput;
                    }
                  })(),
                  scheduleCategory,
                  dayOfWeek: weekday,
                  time: dayjs()
                    .set("hour", hour)
                    .set("minute", minute)
                    .format("HH:mm"),
                  repeatWeek,
                  leaderCharacterId: getCharacters.data.find(
                    (item) => item.characterId === leaderCharacterId
                  )?.characterId as number,
                  friendCharacterIdList,
                  memo,
                  date: selectedDate
                    ? selectedDate.format("YYYY-MM-DD")
                    : undefined,
                  autoCheck,
                });
              }
            }
          }}
        >
          <table>
            <colgroup>
              <col width="90px" />
              <col width="auto" />
            </colgroup>
            <tbody>
              <tr>
                <th>일정 종류</th>
                <td>
                  {isEdit || isReadOnly ? (
                    <OnlyText>
                      {
                        scheduleRaidCategoryOptions.find(
                          (item) =>
                            item.value ===
                            getSchedule.data?.scheduleRaidCategory
                        )?.label
                      }
                    </OnlyText>
                  ) : (
                    <Select
                      fullWidth
                      options={scheduleRaidCategoryOptions}
                      value={scheduleRaidCategory}
                      onChange={(value) => {
                        setTargetRaidCategoryIds([]);
                        setScheduleRaidCategory(value);
                      }}
                      placeholder="일정 종류"
                    />
                  )}
                </td>
              </tr>
              <tr>
                <th>{isReadOnly ? "공대장" : "캐릭터"}</th>
                <td>
                  {isEdit || isReadOnly ? (
                    <OnlyText>
                      [{getSchedule.data?.character.itemLevel}{" "}
                      {getSchedule.data?.character.characterClassName}]{" "}
                      {getSchedule.data?.character.characterName}
                    </OnlyText>
                  ) : (
                    <Select
                      fullWidth
                      disabled={!scheduleRaidCategory}
                      options={getCharacters.data
                        .filter(
                          (character) =>
                            character.settings.showCharacter === true
                        )
                        .map((item) => ({
                          value: item.characterId,
                          label: `[${item.itemLevel} ${item.characterClassName}] ${item.characterName}`,
                        }))}
                      value={leaderCharacterId}
                      onChange={(value) => {
                        setTargetRaidCategoryIds([]);
                        setLeaderCharacterId(value);
                      }}
                      placeholder="캐릭터를 선택해주세요."
                    />
                  )}
                </td>
              </tr>
              {isEdit || isReadOnly ? (
                getSchedule.data?.scheduleRaidCategory !== "GUARDIAN" && (
                  <tr>
                    <th>레이드 명</th>
                    <td>
                      <OnlyText>{getSchedule.data?.raidName}</OnlyText>
                    </td>
                  </tr>
                )
              ) : (
                <>
                  {scheduleRaidCategory === "RAID" && (
                    <tr>
                      <th>레이드 명</th>
                      <td>
                        <RaidCategoryList>
                          {getWeekRaidCategories.data
                            .filter(
                              (item) =>
                                item.level <=
                                (targetLeaderCharacter?.itemLevel as number)
                            )
                            .map((item) => (
                              <Checkbox
                                key={item.categoryId}
                                onChange={(checked) => {
                                  if (checked) {
                                    setTargetRaidCategoryIds([
                                      ...targetRaidCategoryIds,
                                      item.categoryId,
                                    ]);
                                  } else {
                                    setTargetRaidCategoryIds(
                                      targetRaidCategoryIds.filter(
                                        (id) => id !== item.categoryId
                                      )
                                    );
                                  }
                                }}
                                checked={targetRaidCategoryIds.includes(
                                  item.categoryId
                                )}
                              >
                                {item.name} {item.weekContentCategory}
                              </Checkbox>
                            ))}
                        </RaidCategoryList>
                      </td>
                    </tr>
                  )}
                  {scheduleRaidCategory === "ETC" && (
                    <tr>
                      <th>컨텐츠 명</th>
                      <td>
                        <Input
                          onChange={(e) => setRaidNameInput(e.target.value)}
                          value={raidNameInput}
                          placeholder="컨텐츠 명을 입력해주세요."
                        />
                      </td>
                    </tr>
                  )}
                </>
              )}
              <tr>
                <th>종류</th>
                <td>
                  {isEdit || isReadOnly ? (
                    <OnlyText>
                      {
                        scheduleCategoryOptions.find(
                          (item) =>
                            item.value === getSchedule.data?.scheduleCategory
                        )?.label
                      }
                    </OnlyText>
                  ) : (
                    <Group>
                      {scheduleCategoryOptions.map((item) => {
                        return (
                          <Button
                            key={item.value}
                            variant={
                              item.value === scheduleCategory
                                ? "contained"
                                : "outlined"
                            }
                            onClick={() => {
                              setScheduleCategory(item.value);
                            }}
                          >
                            {item.label}
                          </Button>
                        );
                      })}
                    </Group>
                  )}
                </td>
              </tr>
              <tr>
                <th>시간</th>
                <td>
                  {isReadOnly ? (
                    <OnlyText>
                      {getSchedule.data?.repeatWeek
                        ? weekdayOptions.find(
                            (item) => item.value === getSchedule.data?.dayOfWeek
                          )?.label
                        : dayjs(getSchedule.data?.date).format(
                            "YYYY-MM-DD"
                          )}{" "}
                      {dayjs(
                        `${getSchedule.data?.date || dayjs().format("YYYY-MM-DD")} ${getSchedule.data?.time}`
                      ).format("A hh:mm")}{" "}
                      {getSchedule.data?.repeatWeek ? "매주 반복" : ""}
                    </OnlyText>
                  ) : (
                    <>
                      {isRegister && (
                        <Groups>
                          <Group>
                            <Checkbox
                              onChange={setRepeatWeek}
                              checked={repeatWeek}
                            >
                              매주 반복
                            </Checkbox>
                          </Group>
                        </Groups>
                      )}
                      <Groups>
                        {repeatWeek ? (
                          <Group>
                            <Select
                              options={weekdayOptions}
                              value={weekday}
                              onChange={setWeekday}
                            />
                            요일
                          </Group>
                        ) : (
                          <Group>
                            <DatePicker
                              value={selectedDate}
                              onChange={(date) => setSelectedDate(date)}
                            />
                          </Group>
                        )}
                        <Group>
                          <Select
                            options={hourOptions}
                            value={hour}
                            onChange={setHour}
                          />
                          :
                          <Select
                            options={minuteOptions}
                            value={minute}
                            onChange={setMinute}
                          />
                        </Group>
                        {isEdit && getSchedule.data?.repeatWeek && (
                          <Group>매주 반복</Group>
                        )}
                      </Groups>
                    </>
                  )}

                  <Group>
                    <Checkbox onChange={setAutoCheck} checked={autoCheck}>
                      자동 체크
                    </Checkbox>
                  </Group>

                  {scheduleCategory === "PARTY" &&
                    (() => {
                      if (!isReadOnly) {
                        if (
                          scheduleRaidCategory === "ETC" ||
                          scheduleRaidCategory === "GUARDIAN" ||
                          (scheduleRaidCategory === "RAID" &&
                            targetRaidCategoryIds.length > 0)
                        ) {
                          return (
                            <Group>
                              <FriendCharacterSelector
                                isEdit={isEdit}
                                onSave={
                                  isEdit
                                    ? ({
                                        addFriendCharacterIdList,
                                        removeFriendCharacterIdList,
                                      }) => {
                                        updateFriendsOfSchedule.mutate({
                                          scheduleId:
                                            getScheduleParams?.scheduleId as number,
                                          addFriendCharacterIdList,
                                          removeFriendCharacterIdList,
                                        });
                                      }
                                    : undefined
                                }
                                minimumItemLevel={undefined}
                                setValue={setFriendCharacterIdList}
                                value={friendCharacterIdList}
                              />
                            </Group>
                          );
                        }

                        if (scheduleRaidCategory === "RAID") {
                          return (
                            <Message>
                              깐부의 캐릭터 추가를 위해 일정 종류와 레이드를
                              선택해주세요.
                            </Message>
                          );
                        }

                        return (
                          <Message>
                            깐부의 캐릭터 추가를 위해 일정 종류를 선택해주세요.
                          </Message>
                        );
                      }

                      return (
                        <ReadOnlyFriendCharacter>
                          {getSchedule.data?.friendList?.map((item) => {
                            return (
                              <SelecterItem
                                key={item.characterId}
                                character={item}
                                disabled
                              />
                            );
                          })}
                        </ReadOnlyFriendCharacter>
                      );
                    })()}
                </td>
              </tr>
              <tr>
                <th>메모</th>
                <td>
                  {isReadOnly ? (
                    memo
                  ) : (
                    <Textarea
                      placeholder="메모를 입력해주세요"
                      onChange={(e) => setMemo(e.target.value)}
                      value={memo}
                    />
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <BottomButtons>
            <Button
              css={bottomButtonCss}
              size="large"
              variant="outlined"
              onClick={onClose}
            >
              취소
            </Button>
            {(isEdit || isReadOnly) && (
              <Button
                css={bottomButtonCss}
                size="large"
                color={theme.palette.error.main}
                onClick={() => {
                  if (window.confirm("일정을 삭제할까요?")) {
                    deleteSchedule.mutate(
                      getScheduleParams?.scheduleId as number
                    );
                  }
                }}
              >
                삭제
              </Button>
            )}
            {(isRegister || isEdit) && (
              <Button css={bottomButtonCss} type="submit" size="large">
                저장
              </Button>
            )}
          </BottomButtons>
        </Form>
      </Wrapper>
    </Modal>
  );
};

export default FormModal;
