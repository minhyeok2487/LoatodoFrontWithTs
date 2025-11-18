# 일반 할 일 일정 입력 개선안

## 배경
- `마감일` 입력이 `datetime-local` 하나로 고정되어 시간 입력이 필수입니다.
- 일정이 날짜만 필요한 경우, 사용자가 임의로 `00:00`을 입력해야 해 불편합니다.
- 일부 클라이언트는 `시작일~마감일` 형태의 기간 입력을 요구하지만, 현재 스키마에는 `dueDate`만 존재합니다.

## 요구사항
1. **단일 마감일 모드**
   - 기존 UI 유지, 단 "하루종일" 체크박스 추가.
   - 체크 시 시간 입력 없이 날짜만 선택, 서버에는 `isAllDay: true`와 00:00 기준의 날짜를 전달.
   - 체크 해제 시 날짜+시간 입력을 모두 요구.
2. **기간 모드**
   - 특정 클라이언트(폴더/카테고리 기준)에는 `시작일`, `마감일` 두 필드를 표시.
   - 기간 모드에서는 "하루종일" 토글을 숨기고 `시작일 ≤ 마감일` 검증을 수행.
3. **편집 시 기본값 유지**
   - 기존 todo의 `startDate`, `dueDate`, `isAllDay` 값을 읽어 폼 상태를 구성해야 함.
4. **목록 표기**
   - 리스트/카드에도 하루종일 여부에 따라 시간 표시를 생략하거나, 기간이면 `시작일 ~ 종료일` 형식으로 노출.

## 뷰 모드별 사양 (백엔드 최신 스펙)
- `GeneralTodoCategoryResponse.viewMode` 값으로 UI를 분기합니다.
  - `LIST`, `KANBAN`: 단일 마감일 + `isAllDay` 토글 지원.
  - `TIMELINE`: 시작~마감 기간 입력, `isAllDay` 미사용.
- **공통 필드**: `title`, `description`, `folderId`, `categoryId`, `statusId`.
- **LIST/KANBAN 모드**
  - `dueDate`는 `datetime-local` 필수.
  - `isAllDay` 토글 ON 시 시간 입력을 숨기거나 비활성화, 날짜만 받아 `2024-07-10T00:00:00`처럼 00:00 시각으로 보냄.
  - 요청 예시:
    ```json
    {
      "title": "디자인 검수",
      "description": "Figma 최종 확인",
      "folderId": 1,
      "categoryId": 3,
      "dueDate": "2024-07-05T00:00:00",
      "isAllDay": true,
      "statusId": 7
    }
    ```
- **TIMELINE 모드**
  - `startDate`, `dueDate` 모두 `datetime-local` 필수, `startDate ≤ dueDate`.
  - `isAllDay`는 항상 false로 취급하며 토글을 노출하지 않음.
  - 요청 예시:
    ```json
    {
      "title": "분기 보고서",
      "description": "자료 취합",
      "folderId": 2,
      "categoryId": 8,
      "startDate": "2024-07-01T09:00:00",
      "dueDate": "2024-07-03T18:00:00",
      "statusId": 12
    }
    ```
- **검증**
  - LIST/KANBAN: `dueDate` 필수. `isAllDay=true` 시 프런트에서 날짜만 받고 `T00:00:00` 보정. `startDate`는 null 유지.
  - TIMELINE: `startDate`, `dueDate` 모두 입력, `startDate ≤ dueDate` 체크. `isAllDay` 생략 또는 false.
- **응답 표시**
  - `GeneralTodoItemResponse`는 항상 `startDate`, `dueDate`, `isAllDay` 포함.
  - 타임라인(viewMode=TIMELINE): `startDate`와 `dueDate` 모두 존재, 카드에 `7/1 09:00 ~ 7/3 18:00`.
  - 단일 모드 + `isAllDay=true`: 날짜만(`7/5`). `isAllDay=false`: 날짜+시간.
- **편집 기본값**
  - 응답 값을 그대로 폼에 넣으면 됨. LIST/KANBAN 항목은 `startDate=null`, TIMELINE 항목은 `isAllDay=false`.
- **우선순위**
  - 타임라인 뷰를 만들고 TIMELINE 모드에서만 기간 입력 UI를 먼저 적용한 뒤, 기존 리스트/칸반 뷰는 단일 마감일 + "하루종일" 개선부터 진행.

## 프런트엔드 작업
1. **타입 확장** (`src/core/types/generalTodo.ts`)
   - `GeneralTodoItem`에 `startDate: string | null`, `isAllDay: boolean` 추가.
   - `DraftTodo`에 `startDate`, `isAllDay` 필드를 추가해 단일/기간 입력을 모두 담습니다.
   - `Create/UpdateGeneralTodoItemRequest`에 `startDate?: string | null`, `isAllDay?: boolean` 추가.
2. **클라이언트별 모드 정보**
   - `GeneralTodoCategory.viewMode` 값(LIST/KANBAN/TIMELINE)에 맞춰 폼을 분기합니다.
   - 폴더/카테고리 선택 시 해당 viewMode에 맞게 draft의 날짜 필드를 초기화합니다.
3. **폼 UI 업데이트** (`src/pages/generalTodo/components/TodoDrawer.tsx`)
   - 단일 모드: 기존 `datetime-local` 옆에 "하루종일" 토글 추가, 체크 시 시간 입력을 숨기거나 비활성화.
   - 기간 모드: `시작일`, `마감일` 두 개의 `datetime-local` 필드를 배치, 오류 메시지를 `FormNotice`로 노출.
4. **상태/검증 로직** (`src/pages/generalTodo/GeneralTodoIndex.tsx`)
   - `resetDraft`와 `handleSubmit`에서 모드별로 날짜 검증/직렬화 수행.
   - 단일 모드: `dueDate` 필수, `isAllDay=true`면 시간을 00:00으로 normalize.
   - 기간 모드: `startDate`, `dueDate` 모두 필수이며 `startDate ≤ dueDate` 조건을 추가.
   - API 호출 시 모드에 맞게 `startDate`, `dueDate`, `isAllDay`를 포함.
5. **표시부 보완**
   - 리스트/보드에서 일정 정보를 포맷팅하는 헬퍼 추가(`하루종일`이면 날짜만, 기간이면 `start~end`).
   - 정렬/필터 로직이 dueDate만 참조한다면 startDate를 고려하도록 수정.
6. **QA 체크리스트**
   - 단일/기간 모드 각각 생성·수정·삭제, 하루종일 토글 on/off, 모바일 레이아웃에서 UI 깨짐 여부.

## 백엔드 요청 사항
1. **DB/DTO 확장**
   - `general_todos` 테이블(가정)에 `start_date TIMESTAMP NULL`, `is_all_day BOOLEAN DEFAULT FALSE` 필드 추가.
   - 기존 데이터는 `start_date = NULL`, `is_all_day = FALSE`로 마이그레이션.
2. **API 계약**
   - `GET /api/v1/general-todos` 응답에 `startDate`, `isAllDay`, `viewMode`(카테고리 단위) 포함.
   - `POST/PATCH /api/v1/general-todos/items` 요청 본문에서 `startDate`, `isAllDay` 허용.
3. **검증 규칙**
   - 기간 모드: `startDate`와 `dueDate` 모두 필수이며 `startDate ≤ dueDate` 체크.
   - 단일 모드: `dueDate` 필수, `isAllDay=true`면 서버에서 시간을 00:00으로 normalize 가능.
4. **모드 정보 전달**
   - 카테고리의 `viewMode` 값이 LIST/KANBAN/TIMELINE 모두 내려오도록 보장합니다.
5. **테스트/배포**
   - 단일/기간 모드 케이스, 하루종일 토글 케이스 단위 테스트 추가.
   - 배포 전 기존 데이터 변환/검증 절차(Null 허용 여부, 기본값) 공유.

## 일정/Next Step 제안
1. 백엔드에서 스키마 변경 및 `viewMode=TIMELINE` 제공 일정 확정.
2. 프런트엔드에서 새로운 타입/폼 로직을 feature flag와 함께 구현.
3. QA에서 모드별 시나리오를 테스트하고, 릴리스 노트에 일정 입력 변화 명시.
