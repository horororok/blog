# 반응형 디자인 구현: 미디어 쿼리 vs 조건부 렌더링 및 성능 최적화 사례 분석

반응형 웹 디자인을 구현할 때, **미디어 쿼리**와 **조건부 렌더링**은 흔히 선택하는 두 가지 방식입니다. 본 포스팅에서는 미디어 쿼리 대신 **조건부 렌더링**을 활용한 사례를 중심으로 성능 최적화 방법을 분석하고, 다양한 최적화 기법의 효과를 비교해보겠습니다.

---

## 상황: 조건부 렌더링을 선택한 이유

프로젝트 요구사항은 화면 크기에 따라 컴포넌트의 **모양과 동작**이 크게 달라지는 상황이었습니다.

- **데스크톱/태블릿:** 슬라이더 형태로 리스트를 표시하며, 화면 크기에 따라 슬라이더 내부 요소 개수만 조정.
- **모바일:** 무한 스크롤로 리스트를 페이징 처리.

### 선택의 배경

하나의 컴포넌트에서 모든 동작을 처리하려면 **미디어 쿼리**를 사용해야 했으나, 아래 이유로 조건부 렌더링을 선택했습니다.

1. **역할 분리:** 슬라이더와 무한 스크롤은 UI/UX 동작이 완전히 다르므로 별도 컴포넌트로 분리.
2. **유지보수:** 각 컴포넌트가 역할에 충실하도록 설계하면 수정과 확장이 용이.
3. **성능:** 불필요한 CSS와 로직 처리를 줄일 수 있음.

---

## 창 크기 감지를 위한 `useWindowSize` 훅 구현

창 크기를 실시간으로 감지하기 위해 **`useWindowSize` 훅**을 구현했습니다. 기본적인 훅은 다음과 같습니다:

```javascript
import { useEffect, useState } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
```

하지만 단순히 창 크기를 실시간으로 감지하면, **리사이즈 이벤트마다 상태가 갱신**되어 성능 문제가 발생합니다.

---

## 성능 최적화: 디바운스와 스로틀

리사이즈 이벤트 처리 시 불필요한 상태 업데이트를 줄이기 위해 **디바운스**와 **스로틀** 기법을 적용했습니다.

### 디바운스 적용

이벤트 호출을 지연시켜 **최종 호출만 실행**하는 방식입니다.

```javascript
let timeoutId;
const handleResize = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, 200); // 200ms 디바운스
};
```

### 스로틀 적용

이벤트를 일정 시간 간격으로 제한하여 **일정 주기마다 실행**하도록 합니다.

```javascript
let lastTime = 0;
const handleResize = () => {
  const now = new Date().getTime();
  if (now - lastTime >= 200) {
    // 200ms 스로틀
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    lastTime = now;
  }
};
```

---

## 최적화된 창 크기 감지: 임계값 기준 업데이트

보다 효율적인 방식으로, 창 크기가 특정 임계값(768px, 1024px 등)에 **도달할 때만 상태를 업데이트**하도록 구현했습니다.

### 코드 구현

```javascript
import { useEffect, useState } from "react";

const useWindowSize = () => {
  const [pageState, setPageState] = useState();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width <= 768) {
        setPageState("MOBILE");
      } else if (width <= 1024) {
        setPageState("TABLET");
      } else {
        setPageState("DESKTOP");
      }
    };

    handleResize(); // 초기 상태 설정
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return pageState;
};

export default useWindowSize;
```

---

## 성능 분석: 최적화 기법별 결과 비교

### 테스트 환경

- **조건부 렌더링 사용**
- 창 크기 변화에 따른 상태 업데이트 시간을 측정.

| 방식        | Scripting(ms) | Rendering(ms) | Painting(ms) | Total(ms) |
| ----------- | ------------- | ------------- | ------------ | --------- |
| 최적화 없음 | 2630          | 201           | 189          | 3020      |
| 디바운스    | 81            | 242           | 198          | 521       |
| 스로틀      | 602           | 215           | 175          | 992       |
| 임계점 방식 | 172           | 242           | 175          | 589       |

### 결과 분석

1. **디바운스:** 가장 효율적. 불필요한 상태 업데이트를 줄이며, 연속된 리사이즈 이벤트를 효과적으로 처리.
2. **임계점 방식:** 상태 업데이트 횟수는 줄었으나, 조건 검사 비용(Scripting)이 증가하여 예상보다 효율적이지 않음.
3. **스로틀:** 디바운스보다 성능이 떨어지며, 리사이즈 이벤트가 빈번할수록 더 많은 자원을 소모.

---

## 최적화 결합: 디바운스 + 임계점

두 방식을 결합하여 조건 검사 전에 디바운스를 적용하면 다음과 같은 이점이 있습니다:

- **디바운스**로 리사이즈 이벤트 횟수 감소.
- **임계점 검사**로 상태 업데이트 최소화.

### 개선된 코드

```javascript
import { useEffect, useState } from "react";

const useWindowSize = () => {
  const [pageState, setPageState] = useState();

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;

        if (width <= 768) {
          setPageState("MOBILE");
        } else if (width <= 1024) {
          setPageState("TABLET");
        } else {
          setPageState("DESKTOP");
        }
      }, 200); // 디바운스 200ms
    };

    handleResize(); // 초기 상태 설정
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return pageState;
};

export default useWindowSize;
```

---

## 결론

### 최적화 방식 선택 가이드

- **작업량이 적다면:** 디바운스만으로 충분히 최적화 가능.
- **조건 분기 처리 필요:** 임계값 기준 방식 사용.
- **리사이즈 이벤트 빈번:** 디바운스와 임계점을 결합해 성능 최적화.

조건부 렌더링을 통해 UI/UX의 역할 분리를 명확히 하고, 최적화된 창 크기 감지 로직을 적용하여 성능을 극대화할 수 있습니다.
