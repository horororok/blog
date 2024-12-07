# React useReducer 훅 완벽 가이드

## 목차

1. [useReducer란?](#usereducer란)
2. [사용 용도](#사용-용도)
3. [핵심 구성요소](#핵심-구성요소)
   - [Reducer 함수](#1-reducer-함수)
   - [Action 객체](#2-action-객체)
   - [useReducer 훅](#3-usereducer-훅)
4. [실제 사용 예시](#실제-사용-예시)
5. [TypeScript 활용](#typescript-활용)
6. [Redux와의 비교](#redux와의-비교)
7. [결론](#결론)

## useReducer란?

useReducer는 React의 내장 훅으로, 복잡한 상태 로직을 관리하기 위한 도구입니다. useState의 대안으로 사용되며, 상태 관리와 상태 변경 로직을 명확하게 분리할 수 있습니다.

### 특징

- 상태 변경 로직이 리듀서 함수로 분리되어 관리됨
- dispatch를 호출하여 action 객체를 전달하면 리듀서 함수에서 상태를 업데이트

## 사용 용도

useReducer는 다음과 같은 상황에서 특히 효과적입니다:

- 복잡한 상태 관리와 상태 변경 로직이 명확히 분리되어야 할 때
- 상태 업데이트가 다른 상태에 의존할 때
- 구체적인 사용 사례:
  - 폼(Form) 상태 관리
  - 장바구니 기능 구현
  - 필터링/정렬 기능 개발

## 핵심 구성요소

### 1. Reducer 함수

Reducer 함수는

1. 현재 상태 (state)와
2. 수행할 작업의 정보를 담고 있는 액션 객체 (action) 를 인수로 받아
3. 새로운 상태를 반환한다.

```javascript
function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      return state;
  }
}
```

### 2. Action 객체

Action은 상태 변화를 설명하는 객체로, 다음 요소들을 포함합니다:

- type: 어떤 종류의 상태 변경을 수행할 것인지 (필수)
- payload: 상태 변경에 필요한 데이터 (선택적 사용)

### 3. useReducer 훅

기본 사용법:

```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```

구성요소:

- state: 현재 상태값
- dispatch: action을 보내는 함수
- initialState: 초기 상태값

## 실제 사용 예시

간단한 카운터 구현 예시:

```javascript
function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
    </>
  );
}
```

## TypeScript 활용

### useReducer의 타입 구조

기본 타입 구조:

```typescript
const [state, dispatch] = useReducer<State, Action>(reducer, initialState);
```

리듀서 함수의 타입:

```typescript
type Reducer<State, Action> = (state: State, action: Action) => State;
```

전체 예시 코드:

```typescript
import { useReducer, Reducer, Dispatch } from "react";

type State = { count: number };
type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset"; payload: number };

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: action.payload };
    default:
      throw new Error("Unknown action");
  }
};

function Counter() {
  const [state, dispatch]: [State, Dispatch<Action>] = useReducer(reducer, {
    count: 0,
  });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset", payload: 0 })}>
        Reset
      </button>
    </div>
  );
}
```

## Redux와의 비교

useReducer와 Redux의 주요 차이점:

- useReducer는 store가 없어 보통 로컬 상태관리에 적합
- Redux는 store가 있어 전역상태 관리에 특화
- 두 도구는 상호 배타적이지 않으며 함께 사용 가능

자세한 비교는 다음 문서를 참조하세요: [useReducer vs Redux](https://www.frontendmag.com/tutorials/usereducer-vs-redux/)

## 결론

useReducer는 React 애플리케이션에서 복잡한 상태 관리를 위한 강력한 도구입니다. 적절한 상황에서 사용한다면 코드의 가독성과 유지보수성을 크게 향상시킬 수 있습니다.

더 자세한 내용은 [공식 React 문서](https://react.dev/reference/react/useReducer)를 참조하시기 바랍니다.
