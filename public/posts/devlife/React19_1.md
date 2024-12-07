# React 19 정식 출시 - 주요 변경사항 총정리(1) - What’s new in React 19

2024년 12월 5일 React 팀이 React 19의 정식 버전을 발표했다. React 19에서 추가된 새로운 기능들과 개선사항들을 번역하고 정리해 보았다.

---

## 목차

## Actions

과거에 수동으로 처리해야 했던 pending 상태, 에러, 낙관적 업데이트(optimistic updates), 순차적 요청 등을 자동으로 처리할 수 있다.

### 기존 방식

```jsx
// 이전 방식
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    }
    redirect("/path");
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

### 새로운 방식

- transitions 에서 async 함수를 사용하여 pending 상태, 에러, 폼, 낙관적 업데이트 자동으로 처리

```jsx
// React 19의 useTransition 사용
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) {
        setError(error);
        return;
      }
      redirect("/path");
    });
  };

  // ... (반환 부분은 동일)
}
```

### 주요 기능

1. Pending 상태 관리:
   1. 요청 시작 시 자동으로 pending 상태가 true 로 설정되고, 최종 상태 업데이트가 완료되면 false로 변경된다.
2. 낙관적 업데이트:
   1. 새로운 useOptimistic 훅을 통해 요청이 처리되는 동안 사용자에게 즉각적인 피드백을 보여줄 수 있다.
3. 에러 처리:
   1. Error Boundaries를 통해 요청 실패를 표시하고, 낙관적 업데이트를 자동으로 원래 값으로 되돌릴 수 있다.
4. 폼 처리ㅏ: `<form>` 요소가 action 과 formAction props 에 함수를 전달할 수 있게 되었다.

### 최종 단순화 버전

```jsx
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

## 새로운 훅: useActionState

### 기본 사용법

```jsx
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      // Action의 어떤 결과든 반환할 수 있습니다.
      // 여기서는 에러만 반환합니다.
      return error;
    }
    // 성공 처리
    return null;
  },
  null
);
```

### 주요 특징

1. 반환값:
   1. error: Actionm의 마지막 실행결과
   2. submitAction: 실핼할 수 있는 래핑된 Action 함수
   3. isPending: Action의 실행 상태
2. 파라미터:
   1. 첫 번째 파라미터: Action 함수(async)
   2. 두 번째 파라미터: 초기 상태값
3. 작동 방식:
   1. useActionState는 Action 함수를 받아서 래핑된 Action을 반환한다.
   2. Actions는 서로 조합이 가능하다
   3. 래핑된 Action이 호출되면, 마지막 Action의결과를 `data`로, Action의 pending 상태를 `pending`으로 반환한다.

### 주요 변경사항

이전에 `ReactDOM.useFormState`로 불렸던 것이 `React.useActionState`로 이름이 변경되었으며, `useFormState`는 더 이상 사용되지 않는다(deprecated).

### 장점

1. 상태 관리 단순화
2. 비동기 작업 처리 간소화
3. 에러 처리의 표준화
4. pending 상태 자동 관리

## React DOM의 <form> Actions

폼 요소들과 ACtions가 통합되어 더 강력한 기능을 제공한다.

### 사용 예시

```jsx
function RegistrationForm() {
  const handleSubmit = async (formData) => {
    // 폼 데이터 처리
    const result = await submitRegistration(formData);
    if (result.success) {
      // 폼이 자동으로 초기화됩니다
      return;
    }
    // 에러 처리
  };

  return (
    <form action={handleSubmit}>
      <input type="text" name="username" />
      <input type="password" name="password" />
      <button type="submit">등록</button>
    </form>
  );
}
```

### 주요 변경사항

1. 새로운 Props 지원

```jsx
<form action={actionFunction}>
```

- <form>, <input>, <button> 엘리머트에서 action과 formAction props에 함수를 직접 전달할 수 있다.
- 이를 통해 Actions를 사용한 자동 폼 제출이 가능하다

1. 자동 폼 초기화

- Action이 성공적으로 완료되면, React는 자동으로 비제어(uncintrolled) 컴포넌트들의 폼을 초기화한다.
- 수동으로 폼을 초기화해야 하는 경우, 새로운 React DOM API인 requestFormReset을 호출할 수 있다.

### 장점

- 코드 간소화
- 자동화된 상태 관리: 폼의 제출 상태와 초기화가 자동으로 처리된다.
- 에러 터리 통합: Actions의 에러 처리 메커니즘을 폼에서도 활용할 수 있다.
- DX 향상

## React DOM의 새로운 훅 useFormStatus

디자인 시스템에서는 props를 컴포넌트까지 전달(drilling)하지 않고도 자신이 속한 <form>의 정보에 접든해야 하는 디자인 컴포넌트를 작성하는 것이 일반적이다. 이를 더 쉽게 하기 위한 새로운 훅이다.

### 기본 사용법

```jsx
import { useFormStatus } from "react-dom";

function DesignButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} />;
}
```

### 주요 특징

- **Context와 유사한 동작**
  - form이 Context provider인 것처럼 동작
  - 부모 `<form>`의 상태를 직접 읽을 수 있다
  - props drilling 없이 폼 상태에 접근 가능하다
- **반환값**
  - `pending`: 폼의 제출 상태를 나타낸다

### 활용 예시

```jsx
function CustomForm() {
  return (
    <form action={submitHandler}>
      <input type="text" name="username" />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={pending ? "opacity-50" : ""}
    >
      {pending ? "제출 중..." : "제출하기"}
    </button>
  );
}
```

### 장점

- **코드 구조 개선**: props drilling을 피할 수 있다
- **재사용성 향상**: 디자인 컴포넌트를 더 쉽게 재사용할 수 있다
- **상태 관리 단순화**: 폼 상태를 쉽게 접근하고 활용할 수 있다
- **유지보수성 향상**: 컴포넌트 간의 결합도를 낮출 수 있다

## 새로운 훅: useOptimistic

데이터 변경 작업 시 비동기 요청이 진행되는 동안 최종 상태를 낙관적으로 보여주는 UI 패턴을 구현하기 위한 새로운 훅이다.

### 기본 사용법

```jsx
function ChangeName({ currentName, onUpdateName }) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async (formData) => {
    const newName = formData.get("name");
    // 낙관적 업데이트: 즉시 UI 반영
    setOptimisticName(newName);
    // 실제 서버 요청
    const updatedName = await updateName(newName);
    // 서버 응답으로 최종 업데이트
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change Name:</label>
        <input
          type="text"
          name="name"
          disabled={currentName !== optimisticName}
        />
      </p>
    </form>
  );
}
```

### 작동 방식

1. 초기 상태는 `currentName`으로 설정
2. 폼 제출 시 `setOptimisticName` 으로 즉시 UI 업데이트
3. 비동기 요청이 진행되는 동안 새로운 값이 표시된다.
4. 요청 성공 시 `onUpdateName`으로 최종 업데이트 수행
5. 요청 실패 시 자동으로 원래 값으로 복구

### 주요 특징

- **즉각적인 UI 업데이트**
  - `setOptimisticName`을 호출하면 즉시 새로운 값이 화면에 표시된다
  - 사용자는 서버 응답을 기다리지 않고도 변경 결과를 볼 수 있다
- **자동 상태 복구**
  - 업데이트가 실패하거나 에러가 발생하면 자동으로 `currentName` 값으로 되돌아간다
  - 별도의 에러 처리 로직 없이도 안전한 상태 관리가 가능하다

## 새로운 API: use

`use`는 렌더링 중에 리소스를 읽을 수 있게 해주는 새로운 API이다.

### Promise 처리 예시

```jsx
import { use } from "react";

function Comments({ commentsPromise }) {
  // `use`는 promise가 resolve될 때까지 suspend합니다
  const comments = use(commentsPromise);
  return comments.map((comment) => <p key={comment.id}>{comment}</p>);
}

function Page({ commentsPromise }) {
  // Comments에서 `use`가 suspend되면,
  // 이 Suspense boundary가 표시됩니다
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  );
}
```

**Promise 처리**

- Promise가 resolve될 때까지 컴포넌트를 suspend한다
- Suspense와 함께 사용하여 로딩 상태를 처리할 수 있다

### Context 사용

```jsx
import { use } from "react";
import ThemeContext from "./ThemeContext";

function Heading({ children }) {
  if (children == null) {
    return null;
  }
  // useContext와 달리 조건부로 사용 가능합니다
  const theme = use(ThemeContext);
  return <h1 style={{ color: theme.color }}>{children}</h1>;
}
```

### 주의 사항

- **렌더링 중 Promise 생성 제한**
  - 렌더링 중에 생성된 Promise는 `use`에서 지원되지 않는다
  - 렌더링 중 생성된 Promise를 사용하면 경고가 표시된다.
  - Suspense 호환 라이브러리나 프레임워크를 통한 Promise만 사용 가능하다
- **사용 조건**
  - 훅처럼 렌더링 중에만 호출 가능하다
  - 하지만 훅과 달리 조건부로 호출할 수 있다

### 향후 계획

- 렌더링 중 Promise 캐싱을 위한 기능이 추가될 예정
- `use`를 통해 렌더링 중 리소스를 소비하는 더 많은 방법이 지원될 예정

## 새로운 ReactDOM Static APIs

`react-dom/static`에 정적 사이트 생성(SSG)을 위한 두 개의 새로운 API가 추가되었다:

1. `prerender`
2. `prerenderToNodeStream`

### 주요 특징

향상된 정적 HTML 생성

- `renderToString`보다 개선된 방식으로 데이터 로딩을 처리
- 모든 데이터가 로드될 때까지 기다린 후 정적 HTML 스트림을 반환

스트리밍 환경 지원

- Node.js Streams
- Web Streams 와 같은 스트리밍 환경에서 작동하도록 설계되었다

### 사용 예시

```jsx
import { prerender } from "react-dom/static";

async function handler(request) {
  const { prelude } = await prerender(<App />, {
    bootstrapScripts: ["/main.js"],
  });

  return new Response(prelude, {
    headers: { "content-type": "text/html" },
  });
}
```

### 특징

- 스트림을 문자열로 변환 가능
- 스트리밍 응답으로 전송 가능
- 모든 데이터가 로드될 때까지 대기

### 제한 사항

- 기존 React DOM 서버 렌더링 API와 달리, 컨텐츠가 로드되는 동안의 스트리밍은 지원하지 않습니다

## React Server Components

### Server Components

서버 컴포넌트는 클라이언트 애플리케이션이나 SSR 서버와 분리된 환경에서, 번들링 이전에 컴포넌트를 미리 렌더링할 수 있게 해주는 새로운 옵션이다.여기서 ‘서버’란 React서버 컴포넌트가 실행되는 별도의 환경이다.

특징

- **실행 환경**
  - CI 서버에서 빌드 타임에 한 번 실행
  - 또는 웹 서버를 사용하여 각 요청마다 실행 가능
- **React 19 지원**
  - Canary 버전의 모든 서버 컴포넌트 기능 포함
  - 라이브러리에서 `react-server` export 조건으로 React 19를 peer dependency로 지정 가능

### Server Actions

서버 액션은 클라이언트 컴포넌트가 서버에서 실행되는 비동기 함수를 호출할 수 있게 해주는 기능이다.

작동방식

- `"use server"` 지시문으로 서버 액션을 정의하면:
  - 프레임워크가 자동으로 서버 함수에 대한 참조를 생성
  - 이 참조를 클라이언트 컴포넌트에 전달
- 클라이언트에서 함수 호출 시:
  - React가 서버에 요청을 보내 함수 실행
  - 실행 결과를 반환

> **서버 컴포넌트에는 별도의 지시문이 없다**
>
> - 흔한 오해: `"use server"`가 서버 컴포넌트를 나타낸다고 생각하는 것
> - 실제로 `"use server"` 지시문은 오직 서버 액션에만 사용됩니다

사용 방법

두 가지 방법으로 사용할 수 있다.

1. 서버 컴포넌트에서 생성하여 클라이언트 컴포넌트에 props로 전달

```jsx
// 서버 컴포넌트
function ServerComponent() {
  async function handleSubmit() {
    "use server";
    // 서버 로직
  }
  return <ClientComponent onSubmit={handleSubmit} />;
}
```

1. 클라이언트 컴포넌트에서 직접 임포트하여 사용

```jsx
// 클라이언트 컴포넌트
import { serverAction } from "./actions";

function ClientComponent() {
  return <button onClick={serverAction}>실행</button>;
}
```

## 참고

https://react.dev/blog/2024/12/05/react-19
