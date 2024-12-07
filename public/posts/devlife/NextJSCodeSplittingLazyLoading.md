# Next.js 의 코드 스플리팅, 레이지 로딩

Next.js 에서의 동적임포트에 대해 알아보다 헷갈리는 부분이 있어 정리해보았다.

애플리케이션 성능을 최적화하는 핵심 기능인 코드 스플리팅과 레이지 로딩

## 목차

## 코드 스플리팅이란?

코드 스플리팅은 애플리케이션의 번들을 더 작은 청크로 나누어 필요한 시점에 로드하도록 하는 기술이다.

Next.js는 기본적으로 두 가지 방식의 코드 스플리팅을 제공한다.

### 1. 페이지 기반 스플리팅

Next.js는 각 페이지를 자동으로 독립적인 JS 번들로 분리한다. 사용자가 특정페이지를 방문할 때만 해당 페이지의 코드를 로드하므로, 초기 로딩 시간을 크게 단축할 수 있다.

```jsx
// pages/about.js
export default function About() {
  return <div>About 페이지</div>
}

// pages/contact.js
export default function Contact() {
  return <div>Contact 페이지</div>
}
```

### 2. 동적 임포트(Dynamic Import)

`next/dynamic`을 사용하면 컴포넌트 레벨에서 코드 스플리팅을 구현할 수 있다. 특정 컴포넌트를 필요한 시점에 동적으로 로드할 수 있어 초기 번들 크기를 줄일 수 있다.

```jsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("../components/HeavyComponent"), {
  loading: () => <p>Loading...</p>,
  ssr: true, // 서버 사이드 렌더링 옵션
});

export default function HomePage() {
  return (
    <div>
      <h1>메인 페이지</h1>
      <HeavyComponent />
    </div>
  );
}
```

## 코드 스플리팅은 언제 일어날까?

코드 스플리팅은 빌드 시점과 런타임 모두에 관여한다.

### 빌드 시점

- Next.js는 웹팩을 사용하여 코드를 분석하고 청크를 생성한다.
- 페이지별 별도의 JS 번들 생성
- import/export 구문을 분석하여 의존성 트리 생성

빌드 결과물 예시:

```bash
.next/static/chunks/
├── framework-2c79e2a64abdb08b.js  # React, Next.js 프레임워크
├── main-0c597b21e4297d0d.js      # 메인 애플리케이션 코드
├── pages/
│   ├── index-12345.js            # 홈페이지
│   └── about-67890.js            # about 페이지
└── webpack-8d9c541658d44b9c.js   # 웹팩 런타임
```

### 런타임

- 사용자가 페이지를 방문할 때 해당 페이지에 필요한 청크만 다운로드
- 동적 import를 사용한 컴포넌트는 필요한 시점에 청크를 요청하고 로드한다.
- Next.js 라우터는 페이지 전환시에 필요한 청크를 미리 프리페치한다.

## 레이지 로딩이란?

레이지 로딩은 분할된 코드를 필요한 시점에 ‘지연 로딩’ 하는 기술이다. 코드 스플리팅과 밀접하게 연관되어 있지만 약간의 차이가 있다.

- 코드 스플리팅: 번들을 여러 개의 작은 청크로 나누는 과정
- 레이지 로딩: 분할된 코드를 필요한 시점에 지연 로딩하는 기술

```jsx
// 레이지 로딩 예시
import { lazy, Suspense } from "react";

const HeavyComponent = lazy(() => import("./HeavyComponent"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

## 코드 스플리팅과 레이지 로딩을 함께 사용하는 예시

```jsx
import { lazy, Suspense } from "react";

// 동적 임포트로 기능별 분리
const DataTable = lazy(() => import("../components/DataTable"));
const Analytics = lazy(() => import("../components/Analytics"));
const UserProfile = lazy(() => import("../components/UserProfile"));

export default function Dashboard() {
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <div>
      {/* 필요한 시점에 레이지 로딩으로 불러오기 */}
      <Suspense fallback={<div>Loading table...</div>}>
        <DataTable />
      </Suspense>

      <button onClick={() => setShowAnalytics(true)}>분석 데이터 보기</button>

      {showAnalytics && (
        <Suspense fallback={<div>Loading analytics...</div>}>
          <Analytics />
        </Suspense>
      )}

      <Suspense fallback={<div>Loading profile...</div>}>
        <UserProfile />
      </Suspense>
    </div>
  );
}
```

## Next.js의 자동 최적화

Next.js는 페이지별 코드 스플리팅을 기본적으로 제공하며, 레이지 로딩과 프리페칭까지 자동으로 구현되어 있다.

```jsx
// pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>홈페이지</h1>
      <Link href="/about">About으로 이동</Link>
    </div>
  );
}
```

이 코드에서

1. 빌드 시 각페이지를 별도 청크로 분할(코드 스플리팅)
2. 초기에는 현재 페이지 코드만 로드(레이지 로딩)
3. Link 컴포넌트가 viewport에 들어오면 자동으로 해당 페이지 코드를 프리페치

\*\* 상기 내용은 page router 기준입니다.
