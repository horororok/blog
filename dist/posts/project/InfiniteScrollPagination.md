# 무한 스크롤 구현: 데이터 자동 로드와 최적화

무한 스크롤은 사용자가 페이지 끝에 도달할 때 자동으로 데이터를 로드하는 기능으로, 특히 리스트 형태의 UI에서 널리 사용됩니다. 본 글에서는 **스크롤 위치를 감지해 데이터를 불러오는 무한 스크롤 구현** 방법과 더 깔끔하게 작성할 수 있는 **커스텀 훅**으로의 변환까지 살펴보겠습니다.

---

## 1. 기본 구현: 스크롤 위치 감지와 데이터 로드

### 1-1. 주요 기능 설명

무한 스크롤의 핵심은 다음과 같습니다:

1. **현재 스크롤 위치**를 계산하여 사용자가 페이지 끝에 가까워졌는지 확인.
2. **스크롤이 끝에 도달**했을 때 추가 데이터를 요청하고 화면에 렌더링.

### 1-2. 코드 구현

다음 코드는 기본 무한 스크롤을 구현한 컴포넌트입니다:

```javascript
import { useEffect, useState } from "react";
import IdolCard from "./IdolCard";

const AllIdolSelectMobile = ({
  cursor,
  idolList = [],
  handleLoadMore,
  addFavoriteIdolTemp,
  favoriteList,
  tempFavoriteList,
  onClickAdd,
}) => {
  const [allIdols, setAllIdols] = useState([]);

  // 아이돌 목록 가져오기
  useEffect(() => {
    setAllIdols(idolList);
  }, [idolList]);

  // 스크롤 이벤트 핸들러 등록
  useEffect(() => {
    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight) {
        onLoadMore(); // 데이터 추가 요청
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [idolList]);

  // 아이돌 목록 더 가져오기
  const onLoadMore = () => {
    if (idolList.length > 0) {
      handleLoadMore(); // 부모 컴포넌트에서 전달받은 데이터 로드 함수 호출
    }
  };

  // 클릭한 아이돌을 임시 관심 아이돌 목록에 추가
  const onClick = (id) => {
    addFavoriteIdolTemp(id);
  };

  return (
    <div className="allidolselectmobile-container">
      <div className="allidolselectmobile-grid">
        {allIdols.map((card) => (
          <IdolCard
            onClick={onClick}
            key={card.id}
            id={card.id}
            name={card.name}
            image={card.profilePicture}
            groupName={card.group}
            isSelected={tempFavoriteList.some((item) => item.id === card.id)}
            isFavorite={favoriteList.some((item) => item.id === card.id)}
            size="large"
          />
        ))}
      </div>
      <div className="allidolselectmobile-addbtn-overlay">
        <button className="allidolselectmobile-addbtn" onClick={onClickAdd}>
          추가하기
        </button>
      </div>
    </div>
  );
};

export default AllIdolSelectMobile;
```

---

## 2. 문제점과 개선 방향

### 2-1. 문제점

1. **코드 중복:** 스크롤 이벤트 로직이 컴포넌트 내부에 하드코딩되어 재사용성이 떨어짐.
2. **상태 관리:** `idolList`와 `allIdols`를 별도로 관리해야 하는 번거로움.
3. **복잡성:** 컴포넌트가 데이터 로드와 UI를 모두 관리하면서 가독성이 낮아짐.

### 2-2. 개선 방향

- **커스텀 훅으로 분리:** 스크롤 감지와 데이터 로드를 훅으로 분리해 재사용성을 높이고 컴포넌트를 깔끔하게 유지.
- **최적화:** 스크롤 이벤트에 **디바운스**나 **스로틀**을 적용해 성능을 향상.

---

## 3. 개선된 구현: 커스텀 훅 활용

### 3-1. `useInfiniteScroll` 커스텀 훅

스크롤 위치를 감지하고, 조건에 따라 콜백 함수를 실행하도록 커스텀 훅을 구현합니다.

```javascript
import { useEffect } from "react";

const useInfiniteScroll = (callback) => {
  useEffect(() => {
    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight) {
        callback(); // 스크롤 끝에 도달하면 콜백 실행
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [callback]);
};

export default useInfiniteScroll;
```

### 3-2. 개선된 컴포넌트

`useInfiniteScroll` 훅을 적용하여 컴포넌트를 간결하게 재작성합니다.

```javascript
import { useEffect, useState } from "react";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import IdolCard from "./IdolCard";

const AllIdolSelectMobile = ({
  idolList = [],
  handleLoadMore,
  addFavoriteIdolTemp,
  favoriteList,
  tempFavoriteList,
  onClickAdd,
}) => {
  const [allIdols, setAllIdols] = useState([]);

  // 아이돌 목록 가져오기
  useEffect(() => {
    setAllIdols(idolList);
  }, [idolList]);

  // 무한 스크롤 훅 사용
  useInfiniteScroll(() => {
    if (idolList.length > 0) {
      handleLoadMore();
    }
  });

  // 클릭한 아이돌을 임시 관심 아이돌 목록에 추가
  const onClick = (id) => {
    addFavoriteIdolTemp(id);
  };

  return (
    <div className="allidolselectmobile-container">
      <div className="allidolselectmobile-grid">
        {allIdols.map((card) => (
          <IdolCard
            onClick={onClick}
            key={card.id}
            id={card.id}
            name={card.name}
            image={card.profilePicture}
            groupName={card.group}
            isSelected={tempFavoriteList.some((item) => item.id === card.id)}
            isFavorite={favoriteList.some((item) => item.id === card.id)}
            size="large"
          />
        ))}
      </div>
      <div className="allidolselectmobile-addbtn-overlay">
        <button className="allidolselectmobile-addbtn" onClick={onClickAdd}>
          추가하기
        </button>
      </div>
    </div>
  );
};

export default AllIdolSelectMobile;
```

---

## 4. 성능 최적화: 디바운스와 스로틀 적용

### 4-1. 디바운스 적용

스크롤 이벤트를 연속 호출하지 않도록 **디바운스**를 적용할 수 있습니다:

```javascript
import { useEffect } from "react";
import debounce from "lodash.debounce";

const useInfiniteScroll = (callback, delay = 200) => {
  useEffect(() => {
    const debouncedScroll = debounce(() => {
      const { scrollHeight, scrollTop, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight) {
        callback();
      }
    }, delay);

    window.addEventListener("scroll", debouncedScroll);
    return () => {
      window.removeEventListener("scroll", debouncedScroll);
    };
  }, [callback, delay]);
};

export default useInfiniteScroll;
```

### 4-2. 스로틀 적용

비슷한 방식으로 **스로틀**을 적용하여 일정 시간 간격으로만 이벤트를 실행할 수도 있습니다.

---

## 5. 결론

### 구현 요약

1. **스크롤 감지**와 **데이터 로드**를 커스텀 훅으로 분리하여 코드 재사용성 향상.
2. **디바운스/스로틀**을 통해 스크롤 이벤트 처리 최적화.
3. 무한 스크롤을 효율적이고 깔끔하게 구현 가능.
