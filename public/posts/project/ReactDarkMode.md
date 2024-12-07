# React 다크모드 구현하기: Context API와 CSS를 활용한 테마 전환

블로그 제작 중 다크모드를 구현해보면서 구현 방법에 대해 정리해 보았다.

---

## 구현 목표

1. 사용자가 수동으로 테마를 전활할 수 있어야 함
2. 시스템의 테마 설정을 자동으로 감지
3. 사용자의 테마 선택을 기억하고 유지
4. 전역으로 일관된 테마 관리

## Context API 로 테마 상태 관리하기

먼저 테마 상태를 전역적으로 관리하기 위한 Context를 생성한다.

```jsx
// ThemeContext.jsx

import { createContext } from "react";
export const ThemeContext = createContext();
```

다음, 테마 관리를 위한 Provider 컴포넌트 구현

```jsx
// ThemeProvider.jsx

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // localStorage에서 저장된 테마 확인
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;

    // 시스템 테마 설정 확인
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // 테마 전환 함수
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

- localStorage에서 사용자가 이전에 설정한 테마 확인
- 저장된 테마가 없다면 시스템 설정 확인
- matchMedia API를 사용해 시스템의 다크모드 여부 확인

> matchMedia API란?
> 웹 브라우저에서 CSS의 미디어쿼리와 자바스크립트를 결합하여 사용자가 현재 브라우저 창의 상태(ex: 창 크기 또는 디스플레이 유형) 에 따라 동적으로 동작을 수행할 수 있도록 하는 API 이다.
> 주요 특징

1. 미디어 쿼리 매칭
2. 미디어 쿼리 변경 감지
3. 이벤트 해제
   주요 활용 예시로는 다음과 같다:
4. CSS와 함께 반응형 디자인 구현

- 미디어 쿼리와 자바스크립트를 결합해 동적 UI 변화를 구현

2. 리소스 로드 최적화

- 특정 화면 크기에서만 필요한 리소스를 로드하거나 기능을 활성화

3. UX 향상

- 디바이스 유형, 혹은 화면 크기에 따라 컨텐츠를 동적으로 제공
  >

## 테마 변경 감지 및 적용

useEffect를 사용하여 테마 변경을 감지하고 적용한다.

```jsx
// ThemeProvider.jsx 내부

useEffect(() => {
  // HTML 속성 및 localStorage 업데이트
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}, [theme]);

// 시스템 테마 변경 감지
useEffect(() => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = (e) => {
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  };

  mediaQuery.addEventListener("change", handleChange);
  return () => mediaQuery.removeEventListener("change", handleChange);
}, []);
```

- 테마 변경 시 HTML 속성 업데이트 및 localStorage 저장
- 시스템 테마 변경 감지 및 자동 적용 (사용자 설정이 없을 경우)

## CSS 스타일링

테마에 따른 스타일을 CSS 로 정의

```css
/* 다크모드 스타일 */
:root[data-theme="dark"] {
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;
}

/* 라이트모드 스타일 */
:root[data-theme="light"] {
  color: #213547;
  background-color: #ffffff;
}

/* 시스템 테마 대응 */
@media (prefers-color-scheme: dark) {
  :root {
    /* 다크모드 기본 스타일 */
  }
}
```

## 커스텀 훅 만들기

다크모드 기능을 사용할 수 있는 커스텀 훅을 만든다

```jsx
// useTheme.js
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
```

## 사용 예시

main.jsx 에서 Router.jsx 자체를 감싸 주었다.

```jsx
// main.jsx

import { ThemeProvider } from "./context/ThemeProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  </StrictMode>
);
```

이후 useTheme() 을 사용하여 다크모드 기능 구현 완료

```jsx
// Nav.jsx

const Nav = () => {
  const { theme, toggleTheme } = useTheme();

          // ...
          <ThemeToggleButton onClick={toggleTheme}>
            <img
              src={theme === "light" ? dark_mode : light_mode}
              alt="theme"
              style={{ width: "2rem", height: "2rem" }}
            />
          </ThemeToggleButton>
          // ...
```

## 마무리

기존에 컴포넌트별 다크모드는 구현해 본적이 있었으나, 프로젝트 전체의 일관된 테마 관리는 처음 시도해보았다. 특히 Context API를 활용한 전역 상태 관리 방식이 나름 인상적이었는데, 기존에 Redux나 Zustand같은 상태 관리 라이브러리만 사용해왔던 나에게 새로운 관점을 제공했다. 간단한 전역 상태 관리의 경우, 추가적인 라이브러리 없이 React의 내장 기능만으로도 충분히 해결책을 만들 수 있다는 점을 배웠다. 앞으로는 상황에 따라 적절한 도구를 선택하는 것의 중요성을 더 깊이 고민해볼 수 있을 것 같다.
