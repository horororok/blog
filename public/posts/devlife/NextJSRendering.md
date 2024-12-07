# Next.js 의 렌더링 과정

Next.js의 렌더링 프로세스는 성능과 사용자 경험을 최적화하기 위한 여러 단계로 구성되어 있다. 각 단계별로 어떤 일이 일어나는지 자세히 살펴보았다.

## 목차

1. 초기 페이지 로드
2. 클라이언트 사이드 내비게이션
3. 코드 스플리팅
4. 하이드레이션 프로세스
5. 데이터 페칭 전략
6. 성능 최적화

## 1. 초기 페이지 로드

### 프리렌더링 단계

- 서버에서 먼저 React 컴포넌트를 실행하여 HTML을 생성
- getStaticProps나 getServerSideProps를 통해 필요한 데이터를 미리 가져온다.
- 생성된 HTML과 필요한 JavaScript 코드, JSON 데이터가 함께 클라이언트로 전송
- 브라우저는 받은 HTML을 즉시 렌더링하여 사용자에게 보여

```html
<!-- 서버에서 생성된 초기 HTML -->
<div id="__next">
  <main>
    <h1>Welcome to Next.js</h1>
    <p>This content was pre-rendered</p>
    <!-- 데이터가 이미 HTML에 포함되어 있음 -->
    <div id="user-data">{JSON.stringify(userData)}</div>
  </main>
</div>
```

## 2. 클라이언트 사이드 내비게이션

### Link 컴포넌트

```jsx
// 기본적인 Link 사용 예시
<Link
  href="/products"
  prefetch={true} // 기본값, 자동 프리페칭 활성화
>
  <a className="nav-link">Products</a>
</Link>

// 동적 라우트의 경우
<Link
  href={`/products/${productId}`}
  scroll={false} // 페이지 상단으로 스크롤하지 않음
>
  <a>View Product</a>
</Link>
```

### 특징

- 페이지 이동 시 브라우저의 기본 동작을 preventDefault()로 막는다
- 뷰포트에 Link가 보이면 자동으로 해당 페이지의 코드를 프리로드
- 클릭 시 JavaScript 라우터를 통해 클라이언트 사이드에서 페이지를 전환
- 필요한 데이터만 JSON으로 가져와 페이지를 업데이트

## 3. 코드 스플리팅

### 자동 코드 스플리팅

- 각 페이지는 별도의 JavaScript 번들로 분리
- 공통적으로 사용되는 코드는 shared bundle로 추출
- dynamic import를 사용하면 컴포넌트 레벨에서도 코드 스플리팅이 가능하다.

### 동적 임포트

```jsx
// 컴포넌트 레벨 코드 스플리팅 예시
import dynamic from "next/dynamic";

// 기본적인 동적 임포트
const DynamicHeader = dynamic(() => import("../components/header"));

// 커스텀 로딩 상태 추가
const DynamicChart = dynamic(() => import("../components/chart"), {
  loading: () => <p>차트 로딩중...</p>,
  ssr: false, // 서버사이드 렌더링 비활성화
});

// 특정 조건에서만 로드
const DynamicAuth = dynamic(() => import("../components/auth"), {
  loading: () => <p>인증 모듈 로딩중...</p>,
  ssr: false,
});
```

## 4. 하이드레이션 프로세스

### 단계별 진행

1. HTML 문서 로드 및 파싱
2. JavaScript 번들 다운로드
3. React가 DOM과 메모리의 가상 DOM을 매칭
4. 이벤트 핸들러 부착
5. 상태 관리 시스템 초기화

```jsx
// 하이드레이션 고려사항이 필요한 컴포넌트 예시
function InteractiveForm() {
  // useEffect를 통해 하이드레이션 완료 후 실행할 코드 정의
  useEffect(() => {
    // 클라이언트 사이드 전용 코드
    const handleFormSubmit = (e) => {
      e.preventDefault();
      // 폼 제출 로직
    };

    const form = document.querySelector("form");
    form.addEventListener("submit", handleFormSubmit);

    return () => {
      form.removeEventListener("submit", handleFormSubmit);
    };
  }, []); // 빈 의존성 배열로 마운트 시에만 실행

  return <form>{/* 폼 내용 */}</form>;
}
```

## 5. 데이터 페칭 전략

- getStaticProps: 빌드 시점에 데이터 페칭 → ssg
- getServerSideProps: 매 요청마다 서버에서 데이터 페칭 → ssr
- SWR/React Query: 클라이언트 사이드 데이터 페칭

###

```jsx
// getStaticProps 예시
export async function getStaticProps() {
  try {
    const res = await fetch("https://api.example.com/data");
    const data = await res.json();

    return {
      props: { data },
      revalidate: 60, // ISR: 60초마다 재생성
    };
  } catch (error) {
    return {
      notFound: true, // 404 페이지 표시
    };
  }
}

// SWR을 사용한 클라이언트 사이드 데이터 페칭
function Profile() {
  const { data, error, isLoading } = useSWR("/api/user", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000,
  });

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;
  return <div>Hello {data.name}!</div>;
}
```

## 6. 성능 최적화

이미지 최적화:

- 자동 이미지 리사이징
- WepP 같은 이미지 포맷 사용
- 지연 로딩(레이지 로딩) 적용

### 자동 이미지 최적화

```jsx
import Image from "next/image";

// 최적화된 이미지 컴포넌트
function OptimizedImage() {
  return (
    <Image
      src="/large-image.jpg"
      alt="최적화된 이미지"
      width={800}
      height={600}
      quality={75} // 이미지 품질 설정
      priority={true} // LCP 이미지의 경우 우선 로딩
      placeholder="blur" // 블러 처리된 플레이스홀더 표시
      blurDataURL="data:image..." // 블러 이미지 데이터 URL
    />
  );
}
```

### 스크립트 최적화

- 로딩 전략 선택 가능
- 실행 시점 제어
- 리소스 우선순위 지정

```jsx
import Script from "next/script";

function OptimizedScripts() {
  return (
    <>
      {/* 중요한 스크립트는 즉시 로드 */}
      <Script
        src="https://critical.example.com/script.js"
        strategy="beforeInteractive"
        onLoad={() => console.log("Script loaded")}
      />

      {/* 덜 중요한 스크립트는 지연 로드 */}
      <Script
        src="https://tracking.example.com/analytics.js"
        strategy="lazyOnload"
        async
      />
    </>
  );
}
```

### 라우트 프리페칭

- Link 컴포넌트가 뷰포트에 들어오면 자동으로 프리페치
- 백그라운드에서 페이지 데이터와 코드를 미리 로드
- 빠른 페이지 전환 가능

## 렌더링 최적화 전략

1. **선택적 하이드레이션**

```jsx
const Component = dynamic(() => import("./Component"), {
  ssr: false, // 클라이언트 사이드에서만 렌더링
});
```

1. **스트리밍 SSR**

- 큰 페이지를 작은 청크로 나누어 점진적으로 전송
- 사용자가 더 빠르게 콘텐츠를 볼 수 있음

1. **React Suspense 활용**

```jsx
<Suspense fallback={<Loading />}>
  <SlowComponent />
</Suspense>
```

## 결론

Next.js의 렌더링 과정은 초기 프리렌더링부터 클라이언트 사이드 내비게이션, 코드 스플리팅, 하이드레이션까지 복잡한 단계를 거치지만, 이 모든 과정이 최적화된 사용자 경험을 제공하기 위해 자동으로 처리된다. 개발자는 이러한 렌더링 프로세스를 이해하고 적절히 활용함으로써, 더 빠르고 효율적인 웹 애플리케이션을 구축할 수 있다.

성능 모니터링과 최적화를 위해서는 Chrome DevTools의 Performance 탭과 Next.js의 내장 분석 도구를 활용하는 것이 좋다. 이를 통해 렌더링 과정에서 발생할 수 있는 병목 현상을 파악하고 개선할 수 있다.

## 참고

https://nextjs.org/docs/app/building-your-application/rendering

https://nextjs.org/docs/13/app/building-your-application/rendering

\*\* 상기 내용은 pages router 기준
