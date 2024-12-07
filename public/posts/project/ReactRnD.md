# React 에서 드래그앤 드롭과 리사이징 구현하기(with. react-rnd)

프로젝트 진행시에 본인만의 커스텀 페이지를 만들기 위해 드래그앤 드롭과 리사이징이 필요하여 구현한 과정을 정리하고 기록해 보았다.

대시보드나 커스터마이징 가능한 UI를 만들 때 매우 중요한 드래그 앤 드롭과 리사이징 기능을 `react-rnd` 라이브러리를 사용하여 구현해 보았다.

## 목차

1. [기본 설정]
2. [드래그 앤 드롭 구현]
3. [리사이징 구현]
4. [고급 기능 구현]
5. [실제 사용 예제]
6. [성능 최적화]

## 기본 설정

먼저 필요한 패키지를 설치한다.

```bash
npm install react-rnd styled-components
# or
yarn add react-rnd styled-components
```

- styled-components를 통해 컴포넌트 스타일링 진행

### 기본 타입 정의

```tsx
interface ComponentProps {
  componentName: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}
```

- componentName: 컴포넌트의 식별자 역할
- position: 컴포넌트의 x, y 좌표 위치
- size: 컴포넌트의 너비와 높이

## 드래그 앤 드롭 구현

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

- react-rnd의 Rnd 컴포넌트를 사용하여 드래그 가능한 컴포넌트를 구현하였다.
- handleDragStop 함수로 드래그가 끝났을 때의 위치 업데이트
- bounds="parent"로 부모 요소 내에서만 드래그 가능하도록 제한

### 그리드 스냅 기능 추가

```tsx
<Rnd
  dragGrid={[20, 20]} // 20px 단위로 스냅
  bounds="parent"
  // ... 다른 props
/>
```

- dragGrid 속성을 사용하여 드래그 시 20px 단위로 스냅되도록 설정하였다. 이는 정확한 위치 배치를 위해 설정하였다.

## 리사이징 구현

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

- handleResizeStop 함수로 크기 조절이 끝났을 때의 상태 업데이트
- resizeGrid로 크기 조절 시 스냅 기능 제공
- min/maxWidth, min/maxHeight로 크기 제한 설정

## 고급 기능 구현

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

addNewComponent 함수를 통해 새로운 컴포넌트를 동적으로 추가할 수 있도록 만들었다. 기본 위치와 크기 설정을 통해 새 컴포넌트를 생성할 수 있다.

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

isLocked 상태를 통해 컴포넌트의 드래그와 리사이징을 비활성화할 수 있다.

## 실제 사용 예제

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

- 스타일링된 컨테이너와 래퍼 컴포넌트 사용
- 아이템 상태 관리 및 이벤트 핸들링
- 그리드 시스템 적용

## 성능 최적화

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

- useMemo와 useCallback을 사용하여 불필요한 리렌더링을 방지한다.

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

`react-rnd`를 사용한 드래그 앤 드롭과 리사이징 구현은 다음과 같은 이점을 제공한다:

1. 직관적인 사용자 인터페이스
2. 유연한 커스터마이징
3. 그리드 시스템 지원
4. 성능 최적화 용이

주의할 점:

- 부모 컨테이너의 position 설정
- 적절한 bounds 설정
- 성능 최적화 고려
- 모바일 대응

## 마무리

본 프로젝트를 통해 드래그 앤 드롭과 리사이징 기능을 구현하면서 많은 것을 배울 수 있었다. 처음에는 라이브러리 없이 직접 구현하려 했으나, 프로젝트 일정과 복잡도를 고려하여 react-rnd 라이브러리를 활용하게 되었다.
이렇게 본의아니게 라이브러리를 사용하면서도 드래그를 위한 div 요소 구성 방식, 리사이징을 위한 핸들러 포인트 배치, 이벤트 처리 방식 등 많은 기술적 인사이트를 얻을 수 있었다. 이러한 경험을 바탕으로 향후에는 직접 드래그 앤 드롭 기능을 구현해보는 것도 좋은 도전이 될 것 같다.
또한 이번 구현을 통해 성능 최적화, 사용자 경험 개선, 반응형 디자인 등 실제 프로덕션 레벨의 기능 구현에 필요한 다양한 고려사항들을 이해하는 기반이 되었다고 생각한다.

## 참고 자료

- [react-rnd 공식 문서](https://github.com/bokuweb/react-rnd)
- https://www.npmjs.com/package/react-rnd
