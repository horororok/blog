# Next.js의 정적 생성(Static Generation)

Next.js에서 가장 중요한 기능 중 하나인 정적 생성(Static Generation)에 대해 상세히 알아보았다. 정적 생성은 Next.js에서 기본적으로 제공하는 렌더링 방식으로, 페이지의 HTML을 빌드 시점에 생성하여 제공한다.

## 목차

1. 정적 생성 기본 이해
2. getStaticProps 활용하기
3. 동적 라우팅과 getStaticPaths
4. 고급 기능과 최적화
5. 주의사항과 모범 사례

## 1. 정적 생성 기본 이해

### 정적 생성이란?

- Next.js는 기본적으로 정적 생성을 지원한다 (이미 최적화되어 있음)
- 정적 생성은 빌드 시점에 HTML을 생성하는 프리렌더링 방식이다
- 주의할 점: 정적 생성은 '고정된 페이지'를 의미하는 것이 아니다

### useEffect와의 관계

- useEffect뿐만 아니라 리액트 훅(useState 등) 들은 프리렌더링 시 서버에서 실행되지 않는다
- 웹브라우저가 로딩된 후에 클라이언트 사이드에서 실행된다

## 2. getStaticProps 활용하기

### 기본 사용법

```jsx
export async function getStaticProps() {
  const res = await axios.get("/api/data");
  const products = res.data.results;

  return {
    props: {
      products,
    },
  };
}
```

### 주요 특징

- 페이지 컴포넌트에서만 사용 가능
- 내부에서 React Hooks 사용 불가
- 서버 사이드에서만 실행
- 개발 환경: 매 요청마다 실행
- 프로덕션 환경: 빌드 타임에만 실행

### context 매개변수 활용

```jsx
export async function getStaticProps(context) {
  // context.params - 동적 라우트 매개변수
  // context.preview - 프리뷰 모드 여부
  // context.previewData - 프리뷰 데이터
}
```

## 3. 동적 라우팅과 getStaticPaths

### getStaticPaths 기본 사용

```jsx
export async function getStaticPaths() {
  return {
    paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
    fallback: false,
  };
}
```

### 동적 paths 생성

```jsx
export async function getStaticPaths() {
  const res = await axios.get("/products/");
  const products = res.data.results;

  const paths = products.map((product) => ({
    params: { id: String(product.id) },
  }));

  return {
    paths,
    fallback: false,
  };
}
```

### fallback 옵션

- `false`: 없는 경로는 404 페이지 반환
- `true`: 없는 경로도 동적으로 생성 시도 (로딩 상태 필요)
- `'blocking'`: SSR처럼 서버에서 생성 완료될 때까지 대기

### 에러 처리

```jsx
export async function getStaticProps(context) {
  const productId = context.params["id"];
  let product;

  try {
    const res = await axios.get(`/products/${productId}`);
    product = res.data;
  } catch {
    return {
      notFound: true, // 404 페이지로 리다이렉트
    };
  }

  return {
    props: {
      product,
    },
  };
}
```

## 4. 고급 기능과 최적화

### ISR (Incremental Static Regeneration)

```jsx
export async function getStaticProps() {
  return {
    props: {
      // 데이터
    },
    revalidate: 60, // 60초마다 재검증
  };
}
```

- revalidate 옵션을 이용하여 특정 시간마다 페이지를 재생성할 수 있다.

### 리다이렉트와 notFound 활용

```jsx
export async function getStaticProps() {
    return {
        props: { ... },
        revalidate: 60,
        notFound: false,    // 404 페이지 표시 여부
        redirect: {         // 리다이렉트 설정
            destination: '/',
            permanent: false,
        }
    }
}

```

### 성능 최적화

```jsx
// 필요한 데이터만 선택하여 반환
export async function getStaticProps() {
  const data = await fetchLargeData();
  return {
    props: {
      title: data.title,
      description: data.description,
      // 필요없는 데이터는 제외
    },
  };
}
```

### TypeScript 지원

```tsx
import { GetStaticProps, GetStaticPaths } from "next";

export const getStaticPaths: GetStaticPaths = async () => {
  // ...
};

export const getStaticProps: GetStaticProps = async (context) => {
  // ...
};
```

## 5. 주의사항과 모범 사례

### 성능 최적화

- 필요한 데이터만 선택적으로 반환
- 큰 데이터는 적절히 필터링하여 전달
- 불필요한 외부 API 호출 최소화

### 개발 vs 프로덕션 환경

- 개발(`npm run dev`): 매 요청마다 실행
- 프로덕션(`npm run build`): 빌드 시점에만 실행
- 환경별 동작 방식 이해 필요

### pageProps의 이해

- 빌드 시점에 생성된 props는 script 태그에 포함
- 하이드레이션 과정에서 React와 동기화
- 클라이언트 사이드 렌더링과의 조화

### 캐시 제어

- getStaticProps의 결과는 CDN에서 캐시됨
- revalidate 옵션으로 캐시 기간 제어 가능
- stale-while-revalidate 패턴 사용

## 결론

Next.js의 정적 생성은 올바르게 사용하기 위해서는 각 API의 특성과 제약사항을 잘 이해해야 할 것 같다. 상황에 따라 SSR이나 CSR과 적절히 조합하여 사용하는 것이 좋고, 특히 데이터 갱신이 잦은 페이지의 경우 ISR을 활용하는 것을 고려해볼 수 있을 것 같다.

\*\* 상기 내용은 pages router 기준
