프로젝트에서 Google Analytics와 연동하여 데이터를 가져와 보여줘야 하는 기능을 만드는 과정을 정리하고 기록해 보았다.

Google Analytics 4(GA4)의 데이터를 React 애플리케이션에서 활용하는 방법입니다. OAuth 2.0 인증부터 데이터 가져오기까지 전체 과정입니다.

## 목차

1. [사전 준비]
2. [GA4 API 설정]
3. [OAuth 2.0 인증 구현]
4. [데이터 가져오기]
5. [상태 관리와 통합]
6. [실제 구현 예제]
7. [보안 고려사항]

## 사전 준비

### 필요한 사항들

- Google Cloud Console 프로젝트
  - GA4 api를 사용하기 위한 기본 프로젝트
- GA4 속성
  - 추적하고자하는 웹사이트의 GA4 설정
- OAuth 2.0 클라이언트 자격증명
  - API 인증을 위한 필수요소
- 필요한 패키지 설치
  - 데이터 요청과 상태관리를 위한 기본 라이브러리

```bash
npm install axios @reduxjs/toolkit react-redux
```

### 환경 변수 설정

```
VITE_GA4_CLIENT_ID=your_client_id
VITE_GA4_CLIENT_SECRET=your_client_secret
VITE_GA4_OAUTH_REFRESH_TOKEN=your_refresh_token
VITE_GA4_PROPERTY_ID=your_property_id
```

- 보안을 위해 민감한 정보들은 환경변수로 관리한다.(클라이언트id, 시크릿 키 등)

## GA4 API 설정

GA4 데이터에 접근하기 위한 API 설정 과정

### 1. Google Cloud Console 설정

1. Google Cloud Console에서 새 프로젝트 생성
2. Google Analytics Data API 활성화
3. OAuth 2.0 클라이언트 ID 및 비밀키(시크릿) 생성

### 2. 필요한 권한 설정

GA4 데이터 접근에 필요한 최소한의 권한 범위를 정의하는 것이다.

```jsx
const REQUIRED_SCOPES = [
  "<https://www.googleapis.com/auth/analytics.readonly>",
  "<https://www.googleapis.com/auth/analytics.report.readonly>",
];
```

## OAuth 2.0 인증 구현

구글 API 사용을 위한 인증 처리 로직

### 액세스 토큰 획득

리프레시 토큰을 이용해 실제 API 호출에 사용할 액세스 토큰 발급받기

```tsx
interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

const getAccessToken = async (): Promise<string> => {
  try {
    const response = await axios.post<TokenResponse>(
      "<https://oauth2.googleapis.com/token>",
      {
        client_id: import.meta.env.VITE_GA4_CLIENT_ID,
        client_secret: import.meta.env.VITE_GA4_CLIENT_SECRET,
        refresh_token: import.meta.env.VITE_GA4_OAUTH_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("[Token Error]", error);
    throw error;
  }
};
```

## 데이터 가져오기

실제 GA 로부터 데이터를 요청하고 받아오는 부분이다.

### API 요청 인터페이스 정의

```tsx
interface GA4RequestBody {
  dimensions: Array<{ name: string }>;
  metrics: Array<{ name: string }>;
  dateRanges: Array<{
    startDate: string;
    endDate: string;
  }>;
  orderBys?: Array<{
    dimension?: {
      orderType: string;
      dimensionName: string;
    };
    metric?: {
      metricName: string;
    };
    desc: boolean;
  }>;
  keepEmptyRows?: boolean;
}

interface GA4Response {
  rows: Array<{
    dimensionValues: Array<{ value: string }>;
    metricValues: Array<{ value: string }>;
  }>;
}
```

### 데이터 가져오기 함수

```tsx
const fetchGA4Data = async (
  accessToken: string,
  requestBody: GA4RequestBody
) => {
  try {
    const response = await axios.post<GA4Response>(
      `https://analyticsdata.googleapis.com/v1beta/properties/${
        import.meta.env.VITE_GA4_PROPERTY_ID
      }:runReport`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.rows;
  } catch (error) {
    console.error("[Report Error]", error);
    throw error;
  }
};
```

## 상태 관리와 통합

Redux 를 사용하였기 때문에 관련하여 설정해 주었다.

### Redux 슬라이스 설정

리덕스 상태 구조와 액션 정의

```tsx
// gaSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GAState {
  dateReport: any[];
  cityReport: any[];
  deviceReport: any[];
  ageReport: any[];
  genderReport: any[];
}

const initialState: GAState = {
  dateReport: [],
  cityReport: [],
  deviceReport: [],
  ageReport: [],
  genderReport: [],
};

const gaSlice = createSlice({
  name: "ga",
  initialState,
  reducers: {
    setDateReport: (state, action: PayloadAction<any[]>) => {
      state.dateReport = action.payload;
    },
    setCityReport: (state, action: PayloadAction<any[]>) => {
      state.cityReport = action.payload;
    },
    // ... 기타 리듀서
  },
});

export const {
  setDateReport,
  setCityReport,
  setDeviceReport,
  setAgeReport,
  setGenderReport,
} = gaSlice.actions;

export default gaSlice.reducer;
```

## 실제 구현 예제

### Custom Hook 구현

데이터 fetching 로직을 커스텀 훅으로 구현

```tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { setDateReport } from "../store/slices/gaSlice";

export const useDateReportAPI = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 액세스 토큰 획득
        const accessToken = await getAccessToken();

        // 리포트 데이터 요청
        const requestBody: GA4RequestBody = {
          dimensions: [{ name: "date" }],
          metrics: [
            { name: "activeUsers" },
            { name: "totalUsers" },
            { name: "newUsers" },
            { name: "dauPerMau" },
            { name: "dauPerWau" },
            { name: "wauPerMau" },
            { name: "screenPageViews" },
            { name: "sessions" },
            { name: "bounceRate" },
          ],
          dateRanges: [
            {
              startDate: "2024-05-01",
              endDate: "today",
            },
          ],
          orderBys: [
            {
              dimension: {
                orderType: "ALPHANUMERIC",
                dimensionName: "date",
              },
              desc: false,
            },
          ],
          keepEmptyRows: true,
        };

        const data = await fetchGA4Data(accessToken, requestBody);
        dispatch(setDateReport(data));
      } catch (error) {
        console.error("Failed to fetch GA4 data:", error);
      }
    };

    fetchData();
  }, [dispatch]);
};
```

### 컴포넌트에서 사용

```tsx
import { useDateReportAPI } from "./hooks/useGA4";

const AnalyticsComponent = () => {
  useDateReportAPI();

  // Redux에서 데이터 가져오기
  const dateReport = useSelector((state: RootState) => state.ga.dateReport);

  return <div>{/* 데이터 시각화 로직 */}</div>;
};
```

## 보안 고려사항

1. **환경 변수 관리**
   - 민감한 정보는 반드시 환경 변수로 관리
   - .env 파일을 .gitignore에 포함
2. **토큰 관리**
   - 액세스 토큰은 메모리에만 저장
   - 리프레시 토큰은 안전하게 보관
3. **에러 처리**

```tsx
const handleError = (error: any) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // 인증 오류 처리
        break;
      case 403:
        // 권한 오류 처리
        break;
      default:
      // 기타 오류 처리
    }
  }
};
```

## 추가 팁

1. **데이터 캐싱**

불필요한 API 호출을 줄일 수 있다.

```tsx
const CACHE_DURATION = 5 * 60 * 1000; // 5분
let cachedData = null;
let lastFetchTime = 0;

const getCachedOrFetchData = async () => {
  const now = Date.now();
  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    return cachedData;
  }

  const data = await fetchGA4Data(/* ... */);
  cachedData = data;
  lastFetchTime = now;
  return data;
};
```

1. **재시도 로직**

네트워크 오류 등에 대응하기 위한 재시도 로직

```tsx
const fetchWithRetry = async (fn: () => Promise<any>, retries = 3) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchWithRetry(fn, retries - 1);
    }
    throw error;
  }
};
```

## 결론

성공적인 구현을 위해서는:

- 에러 처리
- 데이터 캐싱
- 성능 최적화
- 보안 고려사항

을 고려해야 한다.

## 마무리

GA4 관련 문서나 레퍼런스가 부족했지만, 공식 문서와 다양한 자료들을 참고하여 성공적으로 연동을 완료할 수 있었다. 이 과정에서 OAuth 2.0 인증부터 데이터 처리까지 전반적인 흐름을 이해할 수 있었다. 앞으로 실시간 데이터 처리 구현, 에러 처리 및 복구 로직, 데이터 시각화, 최적화 등의 개선사항을 통해 더 안정적인 GA 연동 시스템을 만들 수 있을 거라고 생각한다.

## 참고 자료

- [Google Analytics Data API 공식 문서](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [OAuth 2.0 프로토콜](https://oauth.net/2/)
- [Google Cloud Console](https://console.cloud.google.com/)
