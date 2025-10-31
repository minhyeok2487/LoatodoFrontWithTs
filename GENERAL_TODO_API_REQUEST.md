---
**백엔드 API 요청 문서: 일반 할 일 관리**

**날짜:** 2025년 10월 27일 월요일
**보낸 사람:** 프론트엔드 팀
**받는 사람:** 백엔드 팀
**제목:** 일반 할 일 기능 백엔드 API 개발 요청

안녕하세요 백엔드 팀,

현재 프론트엔드에서 로컬 스토리지로 관리되고 있는 "일반 할 일" 기능을 백엔드 API를 통해 관리할 수 있도록 개발을 요청드립니다. 기존 `character.api.ts`의 API 구조를 참고하여 RESTful한 형태로 설계해주시면 감사하겠습니다.

**기본 데이터 구조:**

```typescript
// 폴더
interface GeneralTodoFolder {
  id: number; // 고유 식별자 (Long 타입, auto-increment)
  name: string;
  username: string; // 사용자 ID (인증 정보에서 추출)
  sortOrder: number; // 정렬 순서
}

// 카테고리
interface GeneralTodoCategory {
  id: number; // 고유 식별자 (Long 타입, auto-increment)
  name: string;
  color: string | null; // Hex 코드 (예: "#RRGGBB")
  folderId: number; // 속한 폴더의 ID (Long 타입)
  username: string; // 사용자 ID (인증 정보에서 추출)
  sortOrder: number; // 정렬 순서
  viewMode: "list" | "kanban"; // 카테고리별 보기 모드 (기본: "list")
}

// 칸반 상태
interface GeneralTodoStatus {
  id: number; // 고유 식별자 (Long 타입, auto-increment)
  categoryId: number; // 연결된 카테고리 ID
  username: string; // 사용자 ID (인증 정보에서 추출)
  name: string;
  sortOrder: number;
  type: "PROGRESS" | "DONE"; // DONE 은 고정 상태 (삭제/수정 불가)
}

// 할 일 항목
interface GeneralTodoItem {
  id: number; // 고유 식별자 (Long 타입, auto-increment)
  title: string;
  description: string;
  folderId: number; // 속한 폴더의 ID (Long 타입)
  categoryId: number; // 속한 카테고리의 ID (Long 타입)
  username: string; // 사용자 ID (인증 정보에서 추출)
  dueDate: string | null; // ISO 8601 형식의 날짜 및 시간 문자열 (예: "YYYY-MM-DDTHH:mm")
  completed: boolean;
  statusId: number | null; // 연결된 칸반 상태 ID (없으면 null)
  createdAt: string; // 생성일시 (LocalDateTime을 String으로 변환)
  updatedAt: string; // 수정일시 (LocalDateTime을 String으로 변환)
}
```

**필요한 API 엔드포인트:**

**1. 일반 할 일 상태 조회 (GET)**
*   **Endpoint:** `/api/v1/general-todos`
*   **Method:** `GET`
*   **Description:** 현재 사용자의 모든 폴더, 카테고리, 할 일 항목을 조회합니다.
*   **Request:** (인증 토큰)
*   **Response:**
    ```json
    {
      "folders": [GeneralTodoFolderResponse, ...],
      "categories": [GeneralTodoCategoryResponse, ...],
      "todos": [GeneralTodoItemResponse, ...],
      "statuses": [GeneralTodoStatusResponse, ...]
    }
    ```
    *   `GeneralTodoCategoryResponse` 내 `viewMode` 필드로 통합되었습니다.
    *   `statuses` 배열은 각 카테고리의 칸반 상태 목록입니다. `type`이 `"DONE"` 인 항목은 항상 마지막에 존재하며 삭제/이름 변경/정렬이 불가능합니다.

**2. 폴더 관리**
*   **Base Endpoint:** `/api/v1/general-todos/folders`

*   **폴더 생성 (POST)**
    *   **Endpoint:** `/api/v1/general-todos/folders`
    *   **Method:** `POST`
    *   **Description:** 새 폴더를 생성합니다.
    *   **Request Body:**
        ```json
        {
          "name": "새 폴더 이름",
          "sortOrder": 0 // (선택 사항) 정렬 순서. 없으면 마지막 순서로 추가
        }
        ```
    *   **Response:** `GeneralTodoFolderResponse` (생성된 폴더 정보 포함)

*   **폴더 이름 변경 (PATCH)**
    *   **Endpoint:** `/api/v1/general-todos/folders/{folderId}`
    *   **Method:** `PATCH`
    *   **Description:** 특정 폴더의 이름을 변경합니다.
    *   **Request Body:**
        ```json
        {
          "name": "새 폴더 이름"
        }
        ```
    *   **Response:** `GeneralTodoFolderResponse` (업데이트된 폴더 정보 포함)

*   **폴더 순서 변경 (PATCH)**
    *   **Endpoint:** `/api/v1/general-todos/folders/reorder`
    *   **Method:** `PATCH`
    *   **Description:** 폴더들의 순서를 변경합니다.
    *   **Request Body:**
        ```json
        {
          "folderIds": [1, 2, ...] // 변경된 순서대로 폴더 ID 목록 (Long 타입)
        }
        ```
    *   **Response:** `No Content` (HTTP 204)

*   **폴더 삭제 (DELETE)**
    *   **Endpoint:** `/api/v1/general-todos/folders/{folderId}`
    *   **Method:** `DELETE`
    *   **Description:** 특정 폴더와 해당 폴더에 속한 모든 카테고리 및 할 일 항목을 삭제합니다. (영구 삭제)
    *   **Response:** `No Content` (HTTP 204)

**3. 카테고리 관리**
*   **Base Endpoint:** `/api/v1/general-todos/categories`

*   **카테고리 생성 (POST)**
    *   **Endpoint:** `/api/v1/general-todos/categories/folders/{folderId}`
    *   **Method:** `POST`
    *   **Description:** 특정 폴더에 새 카테고리를 생성합니다.
    *   **Request Body:**
        ```json
        {
          "name": "새 카테고리 이름",
          "color": "#RRGGBB", // (선택 사항) 색상
          "sortOrder": 0, // (선택 사항) 정렬 순서. 없으면 마지막 순서로 추가
          "viewMode": "list" // (선택 사항) 기본 보기 모드 (list 또는 kanban)
        }
        ```
    *   **Response:** `GeneralTodoCategoryResponse` (생성된 카테고리 정보 포함)

*   **카테고리 업데이트 (PATCH)**
    *   **Endpoint:** `/api/v1/general-todos/categories/{categoryId}`
    *   **Method:** `PATCH`
    *   **Description:** 특정 카테고리의 이름, 색상, 보기 모드를 업데이트합니다.
    *   **Request Body:**
        ```json
        {
          "name": "새 카테고리 이름", // (선택 사항)
          "color": "#RRGGBB", // (선택 사항)
          "viewMode": "kanban" // (선택 사항)
        }
        ```
    *   **Response:** `GeneralTodoCategoryResponse` (업데이트된 카테고리 정보 포함)

*   **카테고리 순서 변경 (PATCH)**
    *   **Endpoint:** `/api/v1/general-todos/categories/folders/{folderId}/reorder`
    *   **Method:** `PATCH`
    *   **Description:** 특정 폴더 내 카테고리들의 순서를 변경합니다.
    *   **Request Body:**
        ```json
        {
          "categoryIds": [1, 2, ...] // 변경된 순서대로 카테고리 ID 목록 (Long 타입)
        }
        ```
    *   **Response:** `No Content` (HTTP 204)

*   **카테고리 삭제 (DELETE)**
    *   **Endpoint:** `/api/v1/general-todos/categories/{categoryId}`
    *   **Method:** `DELETE`
    *   **Description:** 특정 카테고리와 해당 카테고리에 속한 모든 할 일 항목을 삭제합니다. (영구 삭제)
    *   **Response:** `No Content` (HTTP 204)

**4. 할 일 항목 관리**
*   **Base Endpoint:** `/api/v1/general-todos/items`

*   **할 일 생성 (POST)**
    *   **Endpoint:** `/api/v1/general-todos/items`
    *   **Method:** `POST`
    *   **Description:** 새 할 일 항목을 생성합니다.
    *   **Request Body:**
        ```json
        {
          "title": "할 일 제목",
          "description": "할 일 상세 설명", // (선택 사항)
          "folderId": 1, // 폴더 ID (Long 타입)
          "categoryId": 1, // 카테고리 ID (Long 타입)
          "dueDate": "YYYY-MM-DDTHH:mm", // (선택 사항) 마감일
          "completed": false, // (선택 사항) 기본값 false
          "statusId": 10 // (선택 사항) 기본 상태 ID (생략 시 카테고리의 첫 진행 상태로 설정)
        }
        ```
    *   **Response:** `GeneralTodoItemResponse` (생성된 할 일 항목 정보 포함)
    *   `statusId`를 전달하지 않으면 백엔드에서 해당 카테고리의 첫 번째 `"PROGRESS"` 상태를 자동 지정해주세요. `type` 값이 `"DONE"` 인 상태가 지정되면 `completed` 값도 자동으로 `true`가 되어야 합니다.

*   **할 일 업데이트 (PATCH)**
    *   **Endpoint:** `/api/v1/general-todos/items/{itemId}`
    *   **Method:** `PATCH`
    *   **Description:** 특정 할 일 항목의 정보를 업데이트합니다.
    *   **Request Body:**
        ```json
        {
          "title": "새 할 일 제목", // (선택 사항)
          "description": "새 할 일 상세 설명", // (선택 사항)
          "folderId": 2, // (선택 사항) 폴더 이동 시 새 폴더 ID
          "categoryId": 2, // (선택 사항) 카테고리 이동 시 새 카테고리 ID
          "dueDate": "YYYY-MM-DDTHH:mm", // (선택 사항) 새 마감일
          "completed": true, // (선택 사항) 완료 여부
          "statusId": 12 // (선택 사항) 새 상태 ID (DONE 상태 여부에 따라 completed 자동 반영)
        }
        ```
    *   **Response:** `GeneralTodoItemResponse` (업데이트된 할 일 항목 정보 포함)
    *   `statusId`가 함께 전달되면 상태 타입에 맞춰 `completed` 값을 동기화해야 합니다. (예: `"DONE"` 상태 → `completed: true`, 진행 상태 → `completed: false`)

*   **할 일 완료 상태 토글 (PATCH)**
    *   **Endpoint:** `/api/v1/general-todos/items/{itemId}/toggle-completion`
    *   **Method:** `PATCH`
    *   **Description:** 특정 할 일 항목의 완료 상태를 토글합니다.
    *   **Request Body:**
        ```json
        {
          "completed": true // true 또는 false
        }
        ```
    *   **Response:** `No Content` (HTTP 204)
    *   **주의:** 해당 카테고리가 칸반 상태를 사용하는 경우, 완료로 토글 시 `"DONE"` 상태로, 미완료로 토글 시 기본 진행 상태로 `statusId`를 함께 갱신해주세요.

*   **할 일 삭제 (DELETE)**
    *   **Endpoint:** `/api/v1/general-todos/items/{itemId}`
    *   **Method:** `DELETE`
    *   **Description:** 특정 할 일 항목을 삭제합니다. (영구 삭제)
    *   **Response:** `No Content` (HTTP 204)

**5. 칸반 상태 관리**
*   **Base Endpoint:** `/api/v1/general-todos/categories/{categoryId}/statuses`

*   **상태 생성 (POST)**
    *   **Endpoint:** `/api/v1/general-todos/categories/{categoryId}/statuses`
    *   **Method:** `POST`
    *   **Description:** 선택한 카테고리에 새 진행 상태를 추가합니다.
    *   **Request Body:**
        ```json
        {
          "name": "요청 중"
        }
        ```
    *   **Response:** `GeneralTodoStatusResponse`
    *   새 상태는 항상 `"PROGRESS"` 타입으로 생성되며 `sortOrder`는 마지막 위치로 설정합니다.

*   **상태 이름 변경 (PATCH)**
    *   **Endpoint:** `/api/v1/general-todos/statuses/{statusId}`
    *   **Method:** `PATCH`
    *   **Description:** 특정 상태의 이름을 변경합니다. (`type: "DONE"` 상태는 제외)
    *   **Request Body:**
        ```json
        {
          "name": "진행 중"
        }
        ```
    *   **Response:** `GeneralTodoStatusResponse`

*   **상태 삭제 (DELETE)**
    *   **Endpoint:** `/api/v1/general-todos/statuses/{statusId}`
    *   **Method:** `DELETE`
    *   **Description:** 특정 상태를 삭제합니다. (`type: "DONE"` 상태는 삭제 불가)
    *   **Response:** `No Content` (HTTP 204)
    *   삭제 시 해당 상태에 속한 할 일은 기본 진행 상태(또는 남은 상태가 없으면 DONE 상태)로 자동 이동시켜 주세요.

*   **상태 순서 변경 (PATCH)**
    *   **Endpoint:** `/api/v1/general-todos/categories/{categoryId}/statuses/reorder`
    *   **Method:** `PATCH`
    *   **Description:** 카테고리 내 상태들의 표시 순서를 변경합니다.
    *   **Request Body:**
        ```json
        {
          "statusIds": [21, 18, 35, 40] // 변경된 순서대로 상태 ID 목록
        }
        ```
    *   **Response:** `No Content` (HTTP 204)
    *   서버에서 `sortOrder` 값을 갱신하고, `"DONE"` 상태는 항상 마지막에 위치하도록 검증해주세요.

**인증:**
모든 API는 사용자 인증을 필요로 합니다. (예: JWT 토큰)

**에러 처리:**
표준 HTTP 상태 코드와 함께 상세한 에러 메시지를 포함하는 JSON 응답을 기대합니다.
