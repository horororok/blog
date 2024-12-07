# React 19 정식 출시 - 주요 변경사항 총정리(2) - Improvement in React 19

React 19의 개선점에 대한 정리

---

## 목차

## ref를 prop으로 사용하기

함수 컴포넌트에서 ref를 직접 prop으로 사용할 수 있다.

### 기본 사용법

```jsx
function MyInput({ placeholder, ref }) {
  return <input placeholder={placeholder} ref={ref} />;
}

// 사용 예시
<MyInput ref={ref} />;
```

### 주요 변경사항

- **forwardRef 불필요**
  - 새로운 함수 컴포넌트에서는 더 이상 `forwardRef`가 필요하지 않다
  - React 팀은 기존 컴포넌트를 새로운 `ref` prop 방식으로 자동 업데이트하는 codemod를 제공할 예정이라고 한다
- **향후 계획**
  - 향후 버전에서 `forwardRef`는 deprecated 되고 제거될 예정

> **클래스 컴포넌트의 경우**
>
> - 클래스 컴포넌트에 전달되는 `ref`는 prop으로 전달되지 않는다
> - 이는 `ref`가 컴포넌트 인스턴스를 참조하기 때문

### 예시 비교

이전 방식 (forwardRef 사용)

```jsx
const MyInput = React.forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

새로운 방식 (ref prop 사용)

```jsx
function MyInput({ placeholder, ref }) {
  return <input placeholder={placeholder} ref={ref} />;
}
```

## Hydration 에러 보고 개선

기존 - 개발 모드에서 불일치에 대한 구체적인 정보 없이 여러 개의 에러를 로깅

새로운 방식 - 불일치에 대한 diff를 포함한 단일 메시지로 로깅

```jsx
Uncaught Error: Hydration failed because the server rendered HTML didn't match the client.
As a result this tree will be regenerated on the client.

This can happen if an SSR-ed Client Component used:
- A server/client branch `if (typeof window !== 'undefined')`
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called
- Date formatting in a user's locale which doesn't match the server
- External changing data without sending a snapshot of it along with the HTML
- Invalid HTML tag nesting

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.
https://react.dev/link/hydration-mismatch

<App>
  <span>
    + Client
    - Server

at throwOnHydrationMismatch …
```

## Context를 Provider로 직접 사용

`<Context.Provider>` 대신 `<Context>`를 직접 제공자로 렌더링할 수 있다

### 새로운 문법

```jsx
const ThemeContext = createContext("");

function App({ children }) {
  return <ThemeContext value="dark">{children}</ThemeContext>;
}
```

### 사용 예시 비교

기존

```jsx
const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <MainContent />
    </ThemeContext.Provider>
  );
}
```

새로운 방식

```jsx
const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext value="dark">
      <MainContent />
    </ThemeContext>
  );
}
```

기타 개선사항들

### **Cleanup functions for refs**

### **`useDeferredValue` initial value**

### **Support for Document Metadata**

### **Support for stylesheets**

### **Support for async scripts**

### **Support for preloading resources**

### **Compatibility with third-party scripts and extensions**

### **Better error reporting**

### **Support for Custom Elements**

## 참고

https://react.dev/blog/2024/12/05/react-19
