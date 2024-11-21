# React에서 드래그 앤 드롭과 리사이징 구현하기(react-rnd)

대시보드나 커스터마이징 가능한 UI를 만들 때 매우 중요한 드래그 앤 드롭과 리사이징 기능을 `react-rnd` 라이브러리를 사용하여 구현해 보겠습니다.

## 목차

1. [기본 설정](#setup)
2. [드래그 앤 드롭 구현](#drag-and-drop)
3. [리사이징 구현](#resizing)
4. [고급 기능 구현](#advanced-features)
5. [실제 사용 예제](#real-example)
6. [성능 최적화](#optimization)

## 기본 설정 {#setup}

먼저 필요한 패키지를 설치합니다.

```bash
npm install react-rnd styled-components
# or
yarn add react-rnd styled-components
```

### 기본 타입 정의

```typescript
interface ComponentProps {
  componentName: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}
```

## 드래그 앤 드롭 구현 {#drag-and-drop}

### 기본적인 드래그 가능한 컴포넌트 설정

```tsx
import { Rnd } from "react-rnd";
import { useState } from "react";

const DraggableComponent = () => {
  const [components, setComponents] = useState<ComponentProps[]>([
    {
      componentName: "TestComponent",
      position: { x: 0, y: 0 },
      size: { width: 200, height: 200 },
    },
  ]);

  const handleDragStop = (index: number, d: DraggableData) => {
    setComponents((prevComponents) =>
      prevComponents.map((item, i) =>
        i === index ? { ...item, position: { x: d.x, y: d.y } } : item
      )
    );
  };

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      {components.map((item, index) => (
        <Rnd
          key={index}
          position={{ x: item.position.x, y: item.position.y }}
          size={{ width: item.size.width, height: item.size.height }}
          onDragStop={(e, d) => handleDragStop(index, d)}
          bounds="parent"
        >
          <div style={{ border: "1px solid black", height: "100%" }}>
            {item.componentName}
          </div>
        </Rnd>
      ))}
    </div>
  );
};
```

### 그리드 스냅 기능 추가

```tsx
<Rnd
  dragGrid={[20, 20]} // 20px 단위로 스냅
  bounds="parent"
  // ... 다른 props
/>
```

## 리사이징 구현 {#resizing}

### 기본적인 리사이징 설정

```tsx
const handleResizeStop = (
  index: number,
  direction: string,
  ref: HTMLElement,
  delta: ResizableDelta,
  position: { x: number; y: number }
) => {
  setComponents((prevComponents) =>
    prevComponents.map((item, i) =>
      i === index
        ? {
            ...item,
            size: {
              width: ref.offsetWidth,
              height: ref.offsetHeight,
            },
            position: { x: position.x, y: position.y },
          }
        : item
    )
  );
};

// Rnd 컴포넌트에 적용
<Rnd
  onResizeStop={(e, direction, ref, delta, position) =>
    handleResizeStop(index, direction, ref, delta, position)
  }
  resizeGrid={[20, 20]}
  minWidth="20%"
  minHeight="20%"
  maxWidth="500%"
  maxHeight="500%"
/>;
```

## 고급 기능 구현 {#advanced-features}

### 1. 컴포넌트 동적 추가

```tsx
const addNewComponent = (componentName: string) => {
  setComponents((prev) => [
    ...prev,
    {
      componentName,
      position: { x: 100, y: 100 }, // 기본 위치
      size: { width: 200, height: 200 }, // 기본 크기
    },
  ]);
};
```

### 2. 컴포넌트 삭제 기능

```tsx
const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 1000;
`;

const handleDelete = (index: number) => {
  setComponents((prev) => prev.filter((_, i) => i !== index));
};

// Rnd 컴포넌트 내부
<Rnd>
  <div style={{ position: "relative" }}>
    <DeleteButton onClick={() => handleDelete(index)}>
      <MdDelete />
    </DeleteButton>
    {/* 컴포넌트 내용 */}
  </div>
</Rnd>;
```

### 3. 컴포넌트 잠금 기능

```tsx
const [isLocked, setIsLocked] = useState(false);

<Rnd
  disableDragging={isLocked}
  enableResizing={{
    bottom: !isLocked,
    right: !isLocked,
    top: !isLocked,
    left: !isLocked,
    bottomRight: !isLocked,
    bottomLeft: !isLocked,
    topRight: !isLocked,
    topLeft: !isLocked,
  }}
/>;
```

## 실제 사용 예제 {#real-example}

### 커스텀 대시보드 구현

```tsx
import { Rnd } from "react-rnd";
import { useState, useEffect } from "react";
import styled from "styled-components";

const DashboardContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  position: relative;
`;

const ComponentWrapper = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
  padding: 16px;
  overflow: hidden;
`;

interface DashboardItem extends ComponentProps {
  id: string;
}

const CustomDashboard = () => {
  const [items, setItems] = useState<DashboardItem[]>([]);

  const handleDragStop = (id: string, d: DraggableData) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, position: { x: d.x, y: d.y } } : item
      )
    );
  };

  const handleResizeStop = (
    id: string,
    ref: HTMLElement,
    position: { x: number; y: number }
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              size: {
                width: ref.offsetWidth,
                height: ref.offsetHeight,
              },
              position,
            }
          : item
      )
    );
  };

  return (
    <DashboardContainer>
      {items.map((item) => (
        <Rnd
          key={item.id}
          size={{ width: item.size.width, height: item.size.height }}
          position={{ x: item.position.x, y: item.position.y }}
          onDragStop={(e, d) => handleDragStop(item.id, d)}
          onResizeStop={(e, direction, ref, delta, position) =>
            handleResizeStop(item.id, ref, position)
          }
          dragGrid={[20, 20]}
          resizeGrid={[20, 20]}
          bounds="parent"
        >
          <ComponentWrapper>
            {/* 실제 컴포넌트 렌더링 */}
            {renderComponent(item.componentName)}
          </ComponentWrapper>
        </Rnd>
      ))}
    </DashboardContainer>
  );
};
```

## 성능 최적화 {#optimization}

### 1. 메모이제이션 사용

```tsx
import { useMemo, useCallback } from "react";

const CustomDashboard = () => {
  const handleDragStop = useCallback((id: string, d: DraggableData) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, position: { x: d.x, y: d.y } } : item
      )
    );
  }, []);

  const memoizedComponents = useMemo(
    () =>
      items.map((item) => (
        <Rnd
          key={item.id}
          // ... props
        />
      )),
    [items, handleDragStop]
  );

  return <DashboardContainer>{memoizedComponents}</DashboardContainer>;
};
```

### 2. 드래그 이벤트 최적화

```tsx
const [isDragging, setIsDragging] = useState(false);

<Rnd
  onDragStart={() => setIsDragging(true)}
  onDragStop={(e, d) => {
    setIsDragging(false);
    handleDragStop(id, d);
  }}
  scale={isDragging ? 1.02 : 1} // 드래그 중 시각적 피드백
/>;
```

## 결론

`react-rnd`를 사용한 드래그 앤 드롭과 리사이징 구현은 다음과 같은 이점을 제공합니다:

1. 직관적인 사용자 인터페이스
2. 유연한 커스터마이징
3. 그리드 시스템 지원
4. 성능 최적화 용이

주의할 점:

- 부모 컨테이너의 position 설정
- 적절한 bounds 설정
- 성능 최적화 고려
- 모바일 대응

## 참고 자료

- [react-rnd 공식 문서](https://github.com/bokuweb/react-rnd)
- [React DnD 패턴](https://react-dnd.github.io/react-dnd/about)
- [성능 최적화 가이드](https://reactjs.org/docs/optimizing-performance.html)
