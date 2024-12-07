# Next.js의 서버사이드 렌더링(SSR)

Next.js에서 제공하는 렌더링 방식 중 하나인 서버사이드 렌더링(Server-Side Rendering, SSR)에 대해 알아보고 정리해 보았다.

## 목차

1. 서버사이드 렌더링 기본 이해
2. getServerSideProps 활용하기
3. 실전 사용 예제
4. 성능 최적화와 주의사항
5. SSR vs SSG 비교

## 서버사이드 렌더링 기본 이해

### SSR이란?

- 매 요청마다 서버에서 페이지를 렌더링하여 클라이언트에 전달
- 항상 최신 데이터를 보여줄 수 있음
- 정적 생성(SSG)과 동시에 사용할 수 없음

### 사용해야 하는 경우

- 실시간 데이터가 필요한 페이지
- 사용자별 맞춤 컨텐츠
- 검색 결과 페이지
- 데이터가 자주 업데이트되는 대시보드

### SSR 작동 방식

서버사이드 렌더링은 다음과 같은 단계로 동작한다.

1. 사용자가 페이지를 요청하면 서버는 모든 필요한 데이터를 가져온다.
2. 서버에서 React 컴포넌트를 실행하여 HTML 생성
3. 생성된 HTML과 함께 JS 코드를 클라이언트에 전송
4. 클라이언트에서 JS가 실행되며 인터랙티브한 페이지를 만든다.(hydration)

## getServerSideProps 활용하기

### 기본 구조

```jsx
export async function getServerSideProps(context) {
  // 서버 사이드 로직
  return {
    props: {
      // 컴포넌트에 전달할 props
    },
  };
}
```

### context 객체 활용

context 객체는 다음과 같은 정보를 제공한다:

```jsx
export async function getServerSideProps(context) {
  const {
    req, // HTTP 요청 객체
    res, // HTTP 응답 객체
    query, // 쿼리 파라미터
    params, // 동적 라우트 파라미터
    preview, // 프리뷰 모드 여부
    previewData, // 프리뷰 데이터
    resolvedUrl, // 현재 경로
    locale, // 현재 로케일
    locales, // 지원되는 로케일 목록
    defaultLocale, // 기본 로케일
  } = context;

  return {
    props: {},
  };
}
```

### 다양한 데이터 페칭 전략

```jsx
export async function getServerSideProps(context) {
  // 직접 데이터베이스 쿼리
  const data = await prisma.post.findMany();

  // REST API 호출
  const response = await fetch("https://api.example.com/data");

  // GraphQL 쿼리
  const { data: graphqlData } = await client.query({
    query: GET_POSTS,
  });

  return {
    props: {
      data,
      apiData: await response.json(),
      graphqlData,
    },
  };
}
```

### 헤더 및 쿠키 처리

```jsx
export async function getServerSideProps({ req, res }) {
  // 쿠키 읽기
  const token = req.cookies.token;

  // 커스텀 헤더 설정
  res.setHeader("Custom-Header", "value");

  // 인증 처리
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      isAuthenticated: true,
    },
  };
}
```

## 실전 사용 예제

### 검색 기능 구현

```jsx
export async function getServerSideProps(context) {
  const q = context.query["q"] || "";

  try {
    const res = await axios.get(`/products/?q=${encodeURIComponent(q)}`);
    const products = res.data.results ?? [];

    return {
      props: {
        products,
        q,
      },
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      props: {
        products: [],
        q,
        error: "검색 중 오류가 발생했습니다.",
      },
    };
  }
}
```

### 제품별 사이즈 추천 리뷰

```jsx
export async function getServerSideProps(context) {
  const { req, params } = context;
  const productId = params.id;

  try {
    // 제품 정보 조회
    const [productRes, sizeReviewsRes] = await Promise.all([
      axios.get(`/products/${productId}`),
      axios.get(`/size_reviews/?product_id=${productId}`),
    ]);

    return {
      props: {
        product: productRes.data,
        sizeReviews: sizeReviewsRes.data.results ?? [],
      },
    };
  } catch {
    return {
      notFound: true, // 404 페이지 표시
    };
  }
}
```

페이지네이션 구현

```jsx
export async function getServerSideProps({ query }) {
  const page = parseInt(query.page) || 1;
  const limit = 10;

  const [posts, total] = await Promise.all([
    fetchPosts(page, limit),
    getTotalPosts(),
  ]);

  return {
    props: {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    },
  };
}
```

실시간 데이터 관리

```jsx
export async function getServerSideProps() {
  const products = await fetchProductsWithStock();

  // 실시간 가격 정보 추가
  const productsWithPricing = await Promise.all(
    products.map(async (product) => {
      const realTimePrice = await fetchRealTimePrice(product.id);
      return {
        ...product,
        currentPrice: realTimePrice,
      };
    })
  );

  return {
    props: {
      products: productsWithPricing,
      lastUpdated: new Date().toISOString(),
    },
  };
}
```

## 성능 최적화와 주의사항

### 캐싱 전략

```jsx
export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  const data = await fetchData();

  return {
    props: {
      data,
    },
  };
}
```

### 에러 처리

```jsx
export async function getServerSideProps(context) {
  try {
    const data = await fetchData();

    return {
      props: { data },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
}
```

### 조건부 리다이렉트

```jsx
export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
```

### 메모리 관리 주의사항

- 큰 데이터셋은 페이지네이션 적용
- 불필요한 데이터는 필터링하여 전송
- 이미지나 큰 파일은 CDN 활용

### 에러 처리예시

```jsx
export async function getServerSideProps() {
  try {
    const data = await fetchData();

    return {
      props: { data },
    };
  } catch (error) {
    // 오류 로깅
    console.error("Error fetching data:", error);

    if (error.code === "NETWORK_ERROR") {
      return {
        props: {
          error: "네트워크 연결을 확인해주세요",
          fallbackData: [], // 폴백 데이터 제공
        },
      };
    }

    // 심각한 오류 발생 시 에러 페이지로 리다이렉트
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
}
```

## SSR vs SSG 비교

### 리소스 사용량 비교

- **SSR**:
  - 서버 CPU 사용량 높음
  - 메모리 사용량 변동적
  - 요청당 처리 시간 필요
- **SSG**:
  - 빌드 시 일회성 리소스 사용
  - 런타임 서버 부하 없음
  - CDN 캐싱 용이

### SSR을 선택해야 하는 경우

- 실시간 데이터가 필요한 경우
- 사용자별 맞춤 컨텐츠가 필요한 경우
- 요청 시점의 데이터가 중요한 경우
- 리퀘스트의 데이터를 사용해야 하는 경우 (예: 헤더, 쿼리스트링, 쿠키 등)

### SSG를 선택해야 하는 경우

- 마케팅 페이지
- 블로그 포스트
- 도움말 문서
- 정적 제품 목록

### 하이브리드 접근 방식ㄱ 예시

```jsx
// 정적 레이아웃 컴포넌트
export async function getStaticProps() {
  return {
    props: {
      layout: await fetchLayoutData(),
    },
  };
}

// 동적 콘텐츠 영역
export async function getServerSideProps() {
  return {
    props: {
      content: await fetchDynamicContent(),
    },
  };
}
```

## 성능 최적화 방법들

1. **데이터 병렬 요청**

```jsx
const [data1, data2] = await Promise.all([fetchData1(), fetchData2()]);
```

1. **필요한 데이터만 선택하여 반환**

```jsx
return {
  props: {
    title: data.title,
    summary: data.summary,
    // 큰 데이터는 제외
  },
};
```

1. **적절한 캐싱 전략 사용**

- CDN 캐싱 활용
- stale-while-revalidate 패턴 적용

## 결론

서버사이드 렌더링은 실시간 데이터가 필요한 동적 페이지에 적합한 렌더링 방식이다. 하지만 매 요청마다 서버에서 렌더링을 수행하기 때문에, 성능과 서버 부하를 고려하여 적절히 사용해야 한다. Next.js의 장점 중 하나는 페이지별로 다른 렌더링 방식을 선택할 수 있다는 것이다. 따라서 페이지의 특성에 따라 SSG와 SSR을 적절히 조합하여 사용하는 것이 좋다.

\*\* 상기 내용은 pages router 기준
