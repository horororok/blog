# React 18 주요 변경 사항

React 18 버전에서 새로나온 것들에 대해 공식문서를 번역하고 정리해 보았다.

---

## 목차

- 동시성 렌더링의 도입
- 새로운 기능: 자동 배칭
- 새로운 기능: Transition
- 새로운 Suspense 기능들
- 새로운 클라이언트 및 서버 렌더링 API
- 새로운 strict 모드 동작
- 새로운 Hooks

## 동시성 렌더링의 도입

기존의 React는 렌더링을 시작하면 그 작업이 완료될 때까지 중단할 수 없었다. 이는 대규모 렌더링 작업 시 사용자 인터페이스가 멈추는 현상을 초래했다. 동시성 렌더링은 이 문제를 해결한다.

### 특징

**중단 가능한 렌더링**

- 렌더링 작업을 시작하고, 중간에 일시 중지했다가, 나중에 다시 시작할 수 있다
- 필요한 경우 진행 중인 렌더링을 완전히 포기할 수도 있다
- 이를 통해 사용자 입력에 더 빠르게 반응할 수 있다

**UI 일관성 보장**

- 렌더링이 중단되더라도 사용자에게 불완전한 UI가 보이지 않는다
- 전체 렌더링 트리가 준비될 때까지 DOM 업데이트를 지연시킨다

**백그라운드 작업**

- 메인 스레드를 차단하지 않고 새로운 UI를 준비할 수 있다
- 대규모 렌더링 작업 중에도 앱이 반응성을 유지한다

**상태 재사용**

- UI 요소를 화면에서 제거했다가 나중에 이전 상태를 유지한 채로 다시 표시할 수 있다
- 예: 탭 전환 시 이전 탭의 상태를 보존할 수 있다

**선택적 적용**

- 동시성 기능은 opt-in 방식이다
- 동시성 기능을 사용하는 부분에서만 활성화된다

동시성은 그 자체로 기능이 아니라, 새로운 기능들을 가능하게 하는 내부 구현 메커니즘이다. 개발자는 startTransition이나 useDeferredValue 같은 API를 통해 이 기능을 활용할 수 있다

### 예시

- 사용자가 검색어를 입력할 때 입력 필드는 즉시 업데이트되어야 한다 (긴급 업데이트)
- 검색 결과 목록은 약간의 지연이 있어도 괜찮다 (비긴급 업데이트)
- 동시성 렌더링을 사용하면 검색 결과를 계산하는 동안에도 입력이 막힘 없이 동작한다

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

## 새로운 기능: 자동 배칭(Automatic Batching)

배칭은 React가 더 나은 성능으 ㄹ위해 여러 상태 업데이트를 하나의 리렌더링으로 그룹화하는 것이다. 자동 배칭이 없늘 때에는 React 이벤트 핸들러 내부의 업데이트만 배칭되었다. Promise, setTimeout, 네이티브 이벤트 핸들러 또는 기타 이벤트 내부의 업데이트는 기본적으로 React에서 배칭되지 않았지만 자동 배칭을 이용하면 이러한 업데이트들이 자동으로 배칭 된다.

```jsx
// 이전: React 이벤트만 배칭되었습니다.
setTimeout(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // React는 각 상태 업데이트마다 두 번 렌더링합니다 (배칭 없음)
}, 1000);

// 이후: 타임아웃, Promise, 네이티브 이벤트 핸들러 또는
// 기타 이벤트 내부의 업데이트가 배칭됩니다.
setTimeout(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // React는 마지막에 한 번만 다시 렌더링합니다 (배칭 적용!)
}, 1000);
```

## 새로운 기능: Transition

트랜지션은 긴급한 업데이트와 긴급하지 않은 업데이트를 구분하기 위한 React의 새로운 개념이다.

긴급 업데이트

- 타이핑, 클릭, 누르기 등과 같은 직접적인 상호작용 반영

트랜지션 업데이트

- UI를 한 뷰에서 다른 뷰로 전환

긴급 업데이트는 물리적 객체의 동작에 대한 우리의 직관과 일치하도록 즉각적인 응답이 필요하다. 그렇지 않으면 잘못된 것처럼 느끼기 때문이다. 하지만 트랜지션은 사용자가 화면에서 모든 중간값을 볼 필요가 없기 때문에 다르다.

예를 들어 드롭다운에서 필터를 선택할 때 클릭하는 순간 필터 버튼 자체가 즉시 반응할 것으로 예상되지만 실제 결과는 별도로 전환될 수 있다. 작은 지연은 감지하고 어렵고 종종 예상되기도 한다. 그리고 결과가 렌더링되기 전에 필터를 다시 변경하면 최신 결과만 보면 된다.

일반적으로 사용자 경험을 위해서는 단일 사용자 입력이 긴급 업데이트와 긴급하지 않은 업데이트를 모두 발생시켜야 한다. 입력 이벤트 내에서 startTransition API를 사용하여 어떤 업데이트가 긴급하고 어떤 것이 트랜지션인지 React에 알릴 수 있다.

```jsx
import { startTransition } from "react";

// 긴급: 입력된 내용 표시
setInputValue(input);

// 내부의 상태 업데이트를 트랜지션으로 표시
startTransition(() => {
  // 트랜지션: 결과 표시
  setSearchQuery(input);
});
```

setTransition으로 래핑된 업데이트는 긴급하지 않은 것으로 처리되며, 클릭이나 키 입력과 같은 더 긴급한 업데이트가 들어오면 중단된다. 트랜지션이 사용자에 의해 중단되면 React는 완료되지 않은 오래된 렌더링 작업을 버리고 최신 업데이트만 렌더링한다.

- `useTransition`: 대기 상태를 추적하는 값을 포함하여 트랜지션을 시작하기 위한 Hook
- `startTransition`: Hook을 사용할 수 없을 때 트랜지션을 시작하기 위한 메서드

트랜지션은 업데이트가 중단될 수 있도록 하는 동시 렌더링(concurrent rendering)을 활성화 한다. 콘텐츠가 다시 일시 중단되면, 트랜지션은 React 에게 백그라운드에서 트랜지션 콘텐츠를 렌더링하는 동안 현재 콘텐츠를 계속 표시하도록 지시한다.

## 새로운 Suspense 기능들

Suspense를 사용하면 컴포넌트 트리의 일부가 표시될 준비가 되지 않았을 때 로딩 상태를 선언적으로 지정할 수 있다.

```jsx
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

Suspense는 ‘UI 로딩 상태’를 React 프로그래밍 모델에서 일급 선언적 개념으로 만든다. 이를 통해 그 위에 더 높은 수준의 기능을 구축할 수 있다.

기존 제한된 버전의 Suspense에서는 React.lazy를 사용한 코드 분할만 지원되었고, 서버에서 렌더링할 때는 지원되지 않았다.

React 18에서는 서버에서의 Suspense 지원을 추가하고 동시 렌더링(concurrent rendering) 기능을 사용하여 그 기능을 확장했다.

React 18의 Suspense는 transition API와 결합할 때 가장 잘 작동한다. transition 중에 일시 중단이 발생하면, React는 이미 표시된 콘텐츠가 fallback으로 대체되는 것을 방지한다. 대신 React는 나쁜 로딩 상태를 방지하기 위해 충분한 데이터가 로드될 때까지 렌더링을 지연시킨다.

## 새로운 클라이언트 및 서버 렌더링 API

### React DOM Client

이러한 새로운 API들은 이제 `react-dom/client`에서 내보내진다:

- `createRoot`: `render` 또는 `unmount`를 위한 루트를 생성하는 새로운 메서드이다. `ReactDOM.render` 대신 사용하면 된다. React 18의 새로운 기능들은 이것 없이는 작동하지 않는다.
- `hydrateRoot`: 서버에서 렌더링된 애플리케이션을 hydrate하기 위한 새로운 메서드이다. 새로운 React DOM Server API와 함께 `ReactDOM.hydrate` 대신 이것을 사용하면 된다. React 18의 새로운 기능들은 이것 없이는 작동하지 않는다.

`createRoot`와 `hydrateRoot` 모두 렌더링이나 hydration 중에 React가 오류로부터 복구될 때 로깅을 위해 알림을 받고 싶은 경우를 위해 `onRecoverableError`라는 새로운 옵션을 제공한다. 기본적으로 React는 `reportError`를 사용하거나 구형 브라우저에서는 `console.error`를 사용한다.

### React DOM Server

이러한 새로운 API들은 이제 `react-dom/server`에서 내보내지며 서버에서 Suspense 스트리밍을 완벽하게 지원한다:

- `renderToPipeableStream`: Node 환경에서의 스트리밍을 위한 메서드
- `renderToReadableStream`: Deno와 Cloudflare workers와 같은 최신 엣지 런타임 환경을 위한 메서드

기존의 `renderToString` 메서드는 계속 작동하지만 권장되지 않는다.

## 새로운 strict 모드 동작

앞으로 React가 UI의 특정 부분을 상태를 유지하면서 추가하고 제거할 수 있는 기능을 추가하고자 한다. 예를 들어, 사용자가 화면을 벗어났다가 다시 돌아올 때 React는 이전 화면을 즉시 표시할 수 있어야 한다. 이를 위해 React는 이전과 동일한 컴포넌트 상태를 사용하여 트리를 언마운트하고 다시 마운트할 것이다.

이 기능은 추가 설정 없이도 React 앱에 더 나은 성능을 제공하지만, 컴포넌트가 여러 번 마운트되고 제거되는 효과에 대해 복원력을 가져야 힌다. 대부분의 효과는 변경 없이 작동하지만, 일부 효과는 한 번만 마운트되거나 제거된다고 가정한다.

이러한 문제를 발견하기 위해 React 18은 Strict Mode에 새로운 개발 전용 검사를 도입한다. 이 새로운 검사는 컴포넌트가 처음 마운트될 때마다 모든 컴포넌트를 자동으로 언마운트하고 다시 마운트하며, 두 번째 마운트에서 이전 상태를 복원한다.

이전에는 React가 컴포넌트를 마운트하고 효과를 생성했다:

```
* React가 컴포넌트를 마운트합니다.
  * 레이아웃 효과가 생성됩니다.
  * 효과가 생성됩니다.
```

React 18의 Strict Mode에서는 개발 모드에서 컴포넌트의 언마운트와 리마운트를 시뮬레이션한다:

```
* React가 컴포넌트를 마운트합니다.
  * 레이아웃 효과가 생성됩니다.
  * 효과가 생성됩니다.
* React가 컴포넌트의 언마운트를 시뮬레이션합니다.
  * 레이아웃 효과가 제거됩니다.
  * 효과가 제거됩니다.
* React가 이전 상태로 컴포넌트의 마운트를 시뮬레이션합니다.
  * 레이아웃 효과가 생성됩니다.
  * 효과가 생성됩니다.
```

## 새로운 Hook

### **useId**

`useId`는 클라이언트와 서버 모두에서 고유한 ID를 생성하면서 hydration 불일치를 방지하는 새로운 Hook이다. 주로 고유한 ID가 필요한 접근성 API와 통합하는 컴포넌트 라이브러리에 유용하다. 이는 React 17 이하 버전에서도 존재하던 문제를 해결하지만, 새로운 스트리밍 서버 렌더러가 HTML을 비순차적으로 전달하는 방식 때문에 React 18에서는 더욱 중요하다.

> `useId`는 목록의 key를 생성하기 위한 것이 **아니다**. key는 데이터로부터 생성되어야 한다.

### **useTransition**

`useTransition`과 `startTransition`을 사용하면 일부 상태 업데이트를 긴급하지 않은 것으로 표시할 수 있다. 다른 상태 업데이트는 기본적으로 긴급한 것으로 간주된다. React는 긴급한 상태 업데이트(예: 텍스트 입력 업데이트)가 긴급하지 않은 상태 업데이트(예: 검색 결과 목록 렌더링)를 중단하도록 허용한다.

### **useDeferredValue**

`useDeferredValue`를 사용하면 트리의 긴급하지 않은 부분의 리렌더링을 지연할 수 있다. 이는 디바운싱과 비슷하지만 몇 가지 장점이 있다. 고정된 시간 지연이 없어서 React는 첫 번째 렌더링이 화면에 반영된 직후에 지연된 렌더링을 시도힌다. 지연된 렌더링은 중단 가능하며 사용자 입력을 차단하지 않는다.

### **useSyncExternalStore**

`useSyncExternalStore`는 스토어에 대한 업데이트를 동기식으로 강제하여 외부 스토어가 동시 읽기를 지원할 수 있게 하는 새로운 Hook이다. 외부 데이터 소스에 대한 구독을 구현할 때 useEffect의 필요성을 제거하며, React 외부의 상태와 통합하는 모든 라이브러리에 권장된다.

> `useSyncExternalStore`는 애플리케이션 코드가 아닌 라이브러리에서 사용하도록 설계되었다.

### **useInsertionEffect**

`useInsertionEffect`는 CSS-in-JS 라이브러리가 렌더링 시 스타일 주입의 성능 문제를 해결할 수 있게 하는 새로운 Hook이다. CSS-in-JS 라이브러리를 직접 만들지 않는 한 이 Hook을 사용할 일은 없을 것으로 예상된다. 이 Hook은 DOM이 변경된 후, 그러나 레이아웃 효과가 새로운 레이아웃을 읽기 전에 실행된다. 이는 React 17 이하 버전에서도 존재하던 문제를 해결하지만, React가 동시 렌더링 중에 브라우저에 제어권을 양보하여 레이아웃을 재계산할 기회를 주기 때문에 React 18에서는 더욱 중요하다.

> `useInsertionEffect`는 애플리케이션 코드가 아닌 라이브러리에서 사용하도록 설계되었다.

## 참고고

https://18.react.dev/blog/2022/03/29/react-v18
