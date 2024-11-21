# React 18의 새로운 기능 탐구하기

React 18이 출시되면서 동시성 렌더링(Concurrent Rendering)을 비롯한 여러 혁신적인 기능들이 도입되었습니다. 이번 포스트에서는 React 18의 주요 기능들을 실제 사용 사례와 함께 자세히 살펴보겠습니다.

## 목차

1. [동시성 렌더링 (Concurrent Rendering)](#concurrent-rendering)
2. [자동 배치 처리 (Automatic Batching)](#automatic-batching)
3. [Transitions API](#transitions)
4. [Suspense 스트리밍 SSR](#suspense-ssr)
5. [새로운 Hooks](#new-hooks)

## Concurrent Rendering {#concurrent-rendering}

React 18의 가장 큰 변화는 동시성 렌더링의 도입입니다. 이는 React가 여러 버전의 UI를 동시에 준비할 수 있게 해주는 새로운 메커니즘입니다.

### 동시성 렌더링이란?

기존의 React는 렌더링을 시작하면 그 작업이 완료될 때까지 중단할 수 없었습니다. 이는 대규모 렌더링 작업 시 사용자 인터페이스가 멈추는 현상을 초래했죠. 동시성 렌더링은 이 문제를 해결합니다.

```jsx
// 기존 방식
const [items, setItems] = useState([]);
const handleSearch = (query) => {
  fetchItems(query).then((results) => {
    setItems(results); // 이 업데이트는 차단됨
  });
};

// React 18의 동시성 방식
const [items, setItems] = useState([]);
const handleSearch = (query) => {
  startTransition(() => {
    setItems(results); // 이 업데이트는 중단 가능
  });
};
```

### 실제 사용 예시

검색 기능을 구현할 때 동시성 렌더링의 이점을 확인할 수 있습니다:

```jsx
import { startTransition, useState, useTransition } from "react";

function SearchResults() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    // 입력값 업데이트는 긴급함
    setQuery(e.target.value);

    // 검색 결과 업데이트는 덜 긴급함
    startTransition(() => {
      setResults(searchItems(e.target.value));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending ? <div>Loading...</div> : <ResultsList items={results} />}
    </div>
  );
}
```

## 자동 배치 처리 {#automatic-batching}

React 18은 상태 업데이트의 자동 배치 처리를 개선했습니다. 이전에는 React 이벤트 핸들러 내부에서만 배치 처리가 작동했지만, 이제는 프로미스, setTimeout, 네이티브 이벤트 핸들러 등에서도 작동합니다.

### 이전 vs 이후 비교

```jsx
// React 17 이전
setTimeout(() => {
  setCount((c) => c + 1); // 리렌더링 발생
  setFlag((f) => !f); // 리렌더링 발생
}, 1000);

// React 18
setTimeout(() => {
  setCount((c) => c + 1); // 배치 처리됨
  setFlag((f) => !f); // 배치 처리됨
}, 1000); // 한 번만 리렌더링
```

## Transitions API {#transitions}

Transitions API는 긴급한 업데이트와 긴급하지 않은 업데이트를 구분할 수 있게 해줍니다. 이는 사용자 경험을 크게 개선할 수 있습니다.

### useTransition 사용 예시

```jsx
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState("home");

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabButton isSelected={tab === "home"} onClick={() => selectTab("home")}>
        Home
      </TabButton>
      <TabButton
        isSelected={tab === "posts"}
        onClick={() => selectTab("posts")}
      >
        Posts (slow)
      </TabButton>
      {isPending && <Spinner />}
      <TabPanel tab={tab} />
    </>
  );
}
```

## Suspense 스트리밍 SSR {#suspense-ssr}

React 18은 Suspense를 사용한 스트리밍 SSR을 지원합니다. 이를 통해 서버에서 HTML을 점진적으로 스트리밍할 수 있으며, 클라이언트에서 순차적으로 hydration을 수행할 수 있습니다.

```jsx
// 서버 컴포넌트
function App() {
  return (
    <Layout>
      <Suspense fallback={<NavSkeleton />}>
        <Nav />
      </Suspense>
      <Suspense fallback={<MainSkeleton />}>
        <Main />
      </Suspense>
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
    </Layout>
  );
}
```

## 새로운 Hooks {#new-hooks}

React 18은 몇 가지 새로운 Hooks를 도입했습니다.

### useId

클라이언트와 서버 간에 안정적인 고유 ID를 생성하기 위한 Hook입니다.

```jsx
function NameFields() {
  const id = useId();
  return (
    <div>
      <label htmlFor={`${id}-firstName`}>First Name</label>
      <input id={`${id}-firstName`} type="text" />
      <label htmlFor={`${id}-lastName`}>Last Name</label>
      <input id={`${id}-lastName`} type="text" />
    </div>
  );
}
```

### useDeferredValue

값의 업데이트를 지연시킬 수 있는 Hook입니다.

```jsx
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);

  // deferredQuery를 사용하여 검색 결과를 렌더링
  return (
    <ul>
      {searchResults(deferredQuery).map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

## 결론

React 18은 동시성 렌더링이라는 강력한 기능을 중심으로, 성능과 사용자 경험을 크게 개선할 수 있는 다양한 기능들을 제공합니다. 특히 대규모 애플리케이션에서 이러한 기능들의 중요성은 더욱 커질 것으로 예상됩니다.

이러한 새로운 기능들을 적절히 활용한다면, 더 반응적이고 사용자 친화적인 웹 애플리케이션을 구축할 수 있을 것입니다. 물론 이러한 기능들을 효과적으로 사용하기 위해서는 적절한 사용 사례를 파악하고 실험해보는 과정이 필요할 것입니다.

## 참고 자료

- [React 18 공식 문서](https://reactjs.org/blog/2022/03/29/react-v18.html)
- [React 18 업그레이드 가이드](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html)
