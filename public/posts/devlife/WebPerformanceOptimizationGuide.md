# 웹 성능 최적화 가이드: 빠른 웹사이트 구축하기

웹 성능은 사용자 경험과 비즈니스 성과에 직접적인 영향을 미치는 중요한 요소입니다. 이 가이드에서는 웹 성능을 최적화하기 위한 다양한 전략과 기법들을 실제 예제와 함께 살펴보겠습니다.

## 목차

1. [로딩 성능 최적화](#로딩-성능-최적화)
2. [렌더링 성능 최적화](#렌더링-성능-최적화)
3. [자바스크립트 최적화](#자바스크립트-최적화)
4. [이미지 최적화](#이미지-최적화)
5. [캐싱 전략](#캐싱-전략)
6. [측정과 모니터링](#측정과-모니터링)

## 로딩 성능 최적화

### 초기 로딩 시간 단축

#### 1. 코드 스플리팅

React에서 `React.lazy()`와 `Suspense`를 사용한 코드 스플리팅 예제:

```jsx
import React, { Suspense } from "react";

const HeavyComponent = React.lazy(() => import("./HeavyComponent"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

#### 2. Tree Shaking 활용

웹팩 설정 예제:

```javascript
// webpack.config.js
module.exports = {
  mode: "production",
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
};
```

### 리소스 우선순위 지정

```html
<!-- 중요한 CSS -->
<link rel="preload" href="critical.css" as="style" />

<!-- 중요한 스크립트 -->
<link rel="preload" href="critical.js" as="script" />

<!-- 이미지 프리로드 -->
<link rel="preload" href="hero.jpg" as="image" />
```

## 렌더링 성능 최적화 {#rendering-performance}

### React 컴포넌트 최적화

#### 1. 불필요한 리렌더링 방지

```jsx
import React, { memo, useCallback, useMemo } from "react";

const ExpensiveComponent = memo(({ data, onAction }) => {
  // 비용이 큰 계산
  const processedData = useMemo(() => {
    return data.map((item) => expensiveCalculation(item));
  }, [data]);

  // 이벤트 핸들러 메모이제이션
  const handleAction = useCallback(() => {
    onAction(processedData);
  }, [onAction, processedData]);

  return (
    <div onClick={handleAction}>
      {processedData.map((item) => (
        <Item key={item.id} data={item} />
      ))}
    </div>
  );
});
```

#### 2. 가상화 리스트 사용

```jsx
import { FixedSizeList } from "react-window";

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  );

  return (
    <FixedSizeList
      height={400}
      width={300}
      itemCount={items.length}
      itemSize={35}
    >
      {Row}
    </FixedSizeList>
  );
}
```

## 자바스크립트 최적화

### 1. 번들 크기 최적화

```javascript
// 날짜 처리를 위한 Moment.js 대신 Day.js 사용
// Before: import moment from 'moment' (~230KB)
// After: import dayjs from 'dayjs' (~2KB)
import dayjs from "dayjs";

// 선택적 import
import { map, filter } from "lodash-es";
```

### 2. Web Workers 활용

```javascript
// worker.js
self.addEventListener("message", (e) => {
  const result = heavyCalculation(e.data);
  self.postMessage(result);
});

// main.js
const worker = new Worker("worker.js");
worker.postMessage(data);
worker.onmessage = (e) => {
  console.log("계산 결과:", e.data);
};
```

## 이미지 최적화

### 1. 반응형 이미지

```html
<picture>
  <source
    media="(min-width: 800px)"
    srcset="hero-large.jpg 1200w, hero-medium.jpg 800w"
    sizes="80vw"
  />
  <img src="hero-small.jpg" loading="lazy" alt="Hero image" />
</picture>
```

### 2. 이미지 지연 로딩

```javascript
// Intersection Observer를 사용한 이미지 지연 로딩
const images = document.querySelectorAll("img[data-src]");
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
      observer.unobserve(img);
    }
  });
});

images.forEach((img) => imageObserver.observe(img));
```

## 캐싱 전략

### 1. Service Worker 구현

```javascript
// service-worker.js
const CACHE_NAME = "my-site-cache-v1";
const urlsToCache = ["/", "/styles/main.css", "/scripts/main.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

### 2. 브라우저 캐싱 설정

```nginx
# Nginx 설정 예시
location ~* \.(css|js|jpg|jpeg|png|gif|ico|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, no-transform";
}
```

## 측정과 모니터링

### 성능 메트릭 측정

```javascript
// Web Vitals 측정
import { getLCP, getFID, getCLS } from "web-vitals";

function sendToAnalytics({ name, delta, id }) {
  ga("send", "event", {
    eventCategory: "Web Vitals",
    eventAction: name,
    eventValue: Math.round(delta),
    eventLabel: id,
    nonInteraction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

### 성능 모니터링 체크리스트

1. Core Web Vitals 측정

   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)

2. 추가 메트릭
   - Time to First Byte (TTFB)
   - First Contentful Paint (FCP)
   - Time to Interactive (TTI)

## 실제 최적화 사례 연구

### Before

```javascript
// 최적화 전
import moment from "moment";
import { map, filter, reduce } from "lodash";
import heavyComponent from "./heavyComponent";

function App() {
  return (
    <div>
      {heavyComponent}
      <img src="large-image.jpg" />
    </div>
  );
}
```

### After

```javascript
// 최적화 후
import dayjs from "dayjs";
import { map } from "lodash-es";
const HeavyComponent = lazy(() => import("./heavyComponent"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
      <img
        src="large-image.jpg"
        loading="lazy"
        srcset="large-image-300.jpg 300w,
                large-image-600.jpg 600w"
        sizes="(max-width: 600px) 300px, 600px"
      />
    </Suspense>
  );
}
```

## 최적화 체크리스트

- [x] 코드 스플리팅 구현
- [x] 이미지 최적화
- [x] 캐싱 전략 수립
- [x] 번들 크기 최적화
- [x] 성능 메트릭 모니터링
- [x] CSS/JS 최소화
- [x] 중요 리소스 프리로드
- [x] Web Workers 활용 검토

## 결론

웹 성능 최적화는 단순히 한두 가지 기술을 적용하는 것이 아닌, 종합적인 접근이 필요한 과제입니다. 로딩 성능, 렌더링 성능, 자원 최적화 등 다양한 측면을 고려하여 단계적으로 개선해 나가야 합니다.

특히 중요한 것은 지속적인 모니터링과 측정입니다. 성능 메트릭을 꾸준히 추적하고, 사용자 경험에 미치는 영향을 분석하면서 최적화 전략을 조정해 나가야 합니다.

## 참고 자료

- [Web Vitals](https://web.dev/vitals/)
- [MDN 성능 최적화 가이드](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [React 성능 최적화](https://reactjs.org/docs/optimizing-performance.html)
