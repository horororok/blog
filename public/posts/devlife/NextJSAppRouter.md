# Next.js의 App Router와 React Server Components

## 목차

1. App Router 소개
2. Pages Router vs App Router
3. React Server Components(RSC) 이해하기
4. App Router의 주요 기능
5. 실제 사용 예시
6. 장단점과 고려사항

## 1. App Router 소개

Next.js 13.4 버전부터 도입된 App Router는 새로운 라우팅 아키텍처를 제공합니다. 이는 React Server Components를 기본으로 채택하여 더 나은 성능과 개발 경험을 제공합니다.

### 주요 특징

- `/app` 디렉토리 기반 라우팅
- React Server Components 기본 지원
- 향상된 성능과 번들 사이즈 최적화
- 직관적인 파일 시스템 기반 라우팅

## 2. Pages Router vs App Router

### 구조적 차이

```plaintext
# Pages Router
/pages
  ├── index.js
  ├── about.js
  └── products/
      └── [id].js

# App Router
/app
  ├── layout.js
  ├── page.js
  ├── about/
  │   └── page.js
  └── products/
      └── [id]/
          └── page.js
```

### 주요 변경사항

- 라우팅 구조가 더 직관적으로 변경
- 레이아웃과 템플릿 시스템 개선
- 메타데이터 API 변경
- 데이터 페칭 방식의 현대화

## 3. React Server Components(RSC) 이해하기

### 기본 사용법

```javascript
// app/page.js
async function getData() {
  const res = await fetch("https://api.example.com/data");
  return res.json();
}

export default async function Page() {
  const data = await getData();

  return (
    <main>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </main>
  );
}
```

### 클라이언트 컴포넌트 사용

```javascript
// components/Counter.js
"use client"; // 클라이언트 컴포넌트 선언

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

## 4. App Router의 주요 기능

### 레이아웃 시스템

```javascript
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <nav>공통 네비게이션</nav>
        {children}
        <footer>공통 푸터</footer>
      </body>
    </html>
  );
}
```

### 메타데이터 API

```javascript
// app/page.js
export const metadata = {
  title: "내 페이지",
  description: "페이지 설명",
  openGraph: {
    title: "공유용 타이틀",
    description: "공유용 설명",
  },
};
```

### 서버 액션

```javascript
// app/actions.js
"use server";

export async function submitForm(formData) {
  const name = formData.get("name");
  await saveToDatabase(name);
}
```

## 5. 실제 사용 예시

### 데이터 페칭

```javascript
// app/products/page.js
async function getProducts() {
  const res = await fetch("https://api.example.com/products", {
    next: { revalidate: 3600 }, // 1시간마다 재검증
  });
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
```

### 동적 라우트

```javascript
// app/products/[id]/page.js
export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    id: product.id,
  }));
}
```

## 6. 장단점과 고려사항

### 장점

- 향상된 성능 (작은 번들 사이즈)
- 직관적인 데이터 페칭
- 자동 코드 분할
- SEO 최적화
- 타입스크립트 통합 개선

### 단점

- 학습 곡선
- 기존 코드 마이그레이션 필요
- 일부 기능의 실험적 성격
- 서버 리소스 사용 증가 가능성

## 결론

App Router는 Next.js의 미래를 보여주는 중요한 업데이트입니다. React Server Components와 함께 제공되는 새로운 기능들은 더 나은 성능과 개발 경험을 제공합니다. 다만, 프로젝트의 특성과 요구사항을 고려하여 도입을 결정해야 합니다.

새로운 프로젝트를 시작한다면 App Router를 사용하는 것이 권장되지만, 기존 프로젝트의 경우 점진적인 마이그레이션을 고려해볼 수 있습니다. Next.js는 Pages Router와 App Router의 공존을 허용하므로, 팀의 상황에 맞게 전환 계획을 수립할 수 있습니다.
