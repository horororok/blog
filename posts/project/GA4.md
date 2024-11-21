# React에서 Google Analytics 4(GA4) API 연동

Google Analytics 4(GA4)의 데이터를 React 애플리케이션에서 활용하는 방법에 대해 상세히 알아보겠습니다. OAuth 2.0 인증부터 데이터 가져오기까지 전체 과정을 다루겠습니다.

## 목차

1. [사전 준비](#prerequisites)
2. [GA4 API 설정](#setup)
3. [OAuth 2.0 인증 구현](#oauth)
4. [데이터 가져오기](#fetching-data)
5. [상태 관리와 통합](#state-management)
6. [실제 구현 예제](#implementation)
7. [보안 고려사항](#security)

## 사전 준비 {#prerequisites}

### 필요한 사항들

1. Google Cloud Console 프로젝트
2. GA4 속성
3. OAuth 2.0 클라이언트 자격증명
4. 필요한 패키지 설치

```bash
npm install axios @reduxjs/toolkit react-redux
```

### 환경 변수 설정

```env
VITE_GA4_CLIENT_ID=your_client_id
VITE_GA4_CLIENT_SECRET=your_client_secret
VITE_GA4_OAUTH_REFRESH_TOKEN=your_refresh_token
VITE_GA4_PROPERTY_ID=your_property_id
```

## GA4 API 설정 {#setup}

### 1. Google Cloud Console 설정

1. Google Cloud Console에서 새 프로젝트 생성
2. Google Analytics Data API 활성화
3. OAuth 2.0 클라이언트 ID 및 비밀키 생성

### 2. 필요한 권한 설정

```javascript
const REQUIRED_SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/analytics.report.readonly",
];
```

## OAuth 2.0 인증 구현 {#oauth}

### 액세스 토큰 획득

```typescript
interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

const getAccessToken = async (): Promise<string> => {
  try {
    const response = await axios.post<TokenResponse>(
      "https://oauth2.googleapis.com/token",
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

## 데이터 가져오기 {#fetching-data}

### API 요청 인터페이스 정의

```typescript
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

```typescript
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

## 상태 관리와 통합 {#state-management}

### Redux 슬라이스 설정

```typescript
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

## 실제 구현 예제 {#implementation}

### Custom Hook 구현

```typescript
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

```typescript
import { useDateReportAPI } from "./hooks/useGA4";

const AnalyticsComponent = () => {
  useDateReportAPI();

  // Redux에서 데이터 가져오기
  const dateReport = useSelector((state: RootState) => state.ga.dateReport);

  return <div>{/* 데이터 시각화 로직 */}</div>;
};
```

## 보안 고려사항 {#security}

1. **환경 변수 관리**

   - 민감한 정보는 반드시 환경 변수로 관리
   - .env 파일을 .gitignore에 포함

2. **토큰 관리**

   - 액세스 토큰은 메모리에만 저장
   - 리프레시 토큰은 안전하게 보관

3. **에러 처리**

```typescript
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

```typescript
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

2. **재시도 로직**

```typescript
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

GA4 API 연동은 다음 단계들을 포함합니다:

1. 적절한 설정과 권한 획득
2. OAuth 2.0 인증 구현
3. 데이터 요청 및 처리
4. 상태 관리와의 통합
5. 보안 고려사항 적용

성공적인 구현을 위해서는:

- 에러 처리
- 데이터 캐싱
- 성능 최적화
- 보안 고려사항

을 반드시 고려해야 합니다.

추가로 다음과 같은 내용을 더 다룰 수 있습니다:

- 더 많은 메트릭과 디멘션
- 데이터 시각화 방법
- 실시간 데이터 처리
- 에러 처리 상세 전략

## 참고 자료

- [Google Analytics Data API 공식 문서](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [OAuth 2.0 프로토콜](https://oauth.net/2/)
- [Google Cloud Console](https://console.cloud.google.com/)
