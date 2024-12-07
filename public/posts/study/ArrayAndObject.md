# 자바스크립트 배열과 객체의 성능

자바스크립트에서 가장 기본적인 데이터 구조인 배열과 객체의 성능 특성을 이해하는 것은 효율적인 코드 작성을 위해 중요하다. 이 글에서는 각 데이터 구조의 시간 복잡도와 성능 특성을 자세히 살펴보았다.

## 목차

1. [객체(Object)의 Big-O]
2. [배열(Array)의 Big-O]
3. [배열 메서드의 시간 복잡도]
4. [성능 최적화 전략]
5. [실제 사용 사례와 성능 비교]

## 객체(Object)의 Big-O

객체는 정렬되지 않은 키-값 쌍의 데이터 구조이다.

### 시간 복잡도

```jsx
const obj = {
  name: "John",
  age: 30,
  city: "New York",
};
```

| 작업        | 시간 복잡도 | 예제                                                   |
| ----------- | ----------- | ------------------------------------------------------ |
| 삽입        | O(1)        | `obj.newKey = value`                                   |
| 삭제        | O(1)        | `delete obj.key`                                       |
| 접근        | O(1)        | `obj.name`                                             |
| 검색        | O(n)        | `Object.values(obj).includes(value)`                   |
| 객체 메서드 | O(n)        | `Object.keys()`, `Object.values()`, `Object.entries()` |

- 삽입/삭제/접근이 모두 O(1)로 매우 빠르다.
- 검색은 O(n)으로 상대적으로 느리다.

### 예제 코드

```jsx
// 객체 접근과 수정 - O(1)
const person = {};
person.name = "John"; // 삽입 O(1)
console.log(person.name); // 접근 O(1)
delete person.name; // 삭제 O(1)

// 객체 검색 - O(n)
function hasValue(obj, value) {
  return Object.values(obj).includes(value); // O(n)
}
```

## 배열(Array)의 Big-O

배열은 순서가 있는 데이터 구조로 위치에 따라 성능 특성이 다르다.

### 시간 복잡도

| 작업             | 시간 복잡도 | 설명                |
| ---------------- | ----------- | ------------------- |
| 접근             | O(1)        | 인덱스로 직접 접근  |
| 검색             | O(n)        | 전체 배열 순회 필요 |
| 삽입/삭제 (끝)   | O(1)        | push/pop            |
| 삽입/삭제 (시작) | O(n)        | unshift/shift       |
| 삽입/삭제 (중간) | O(n)        | splice              |

- 끝에서의 작업(push/pop)은 O(1)로 빠름
- 시작이나 중간에서의 작업(unshift/shift/splice)은 O(n)으로 느림

### 배열 접근이 느린 경우

배열 접근이 느려지는 주요 원인들:

**메모리 단편화**

```jsx
// 불연속적인 메모리 할당
const arr = new Array(1000000);
for (let i = 0; i < arr.length; i += 100) {
  arr[i] = i;
}
```

**배열 크기 변경**

```jsx
let arr = [];
// 배열 크기가 자주 변경되면 메모리 재할당 발생
for (let i = 0; i < 1000000; i++) {
  arr.push(i);
}
```

**희소 배열**

```jsx
const sparseArray = [];
sparseArray[0] = "first";
sparseArray[1000000] = "last";
// 중간의 빈 슬롯들로 인한 성능 저하
```

## 배열 메서드의 시간 복잡도

### 주요 배열 메서드 성능

```jsx
const arr = [1, 2, 3, 4, 5];

// O(1) 메서드
arr.push(6); // 끝에 추가
arr.pop(); // 끝에서 제거
arr[0]; // 인덱스로 접근

// O(n) 메서드
arr.unshift(0); // 시작에 추가
arr.shift(); // 시작에서 제거
arr.includes(3); // 요소 검색
arr.indexOf(3); // 인덱스 검색
arr.slice(); // 배열 복사
arr.map((x) => x * 2); // 모든 요소 변환
arr.filter((x) => x > 2); // 조건에 맞는 요소 필터링
arr.reduce((a, b) => a + b); // 모든 요소 순회 계산

// O(n log n) 메서드
arr.sort(); // 배열 정렬
```

### 실제 성능 비교 예제

```jsx
// 배열 끝에서의 작업 vs 시작에서의 작업
function compareArrayOperations(size) {
  const arr = Array(size).fill(0);

  console.time("Push operations");
  for (let i = 0; i < 10000; i++) {
    arr.push(i);
  }
  console.timeEnd("Push operations");

  console.time("Unshift operations");
  for (let i = 0; i < 10000; i++) {
    arr.unshift(i);
  }
  console.timeEnd("Unshift operations");
}

compareArrayOperations(100000);
// 예상 결과:
// Push operations: ~10ms
// Unshift operations: ~1000ms
```

## 성능 최적화 전략

### 1. 올바른 데이터 구조 선택

```jsx
// 객체를 사용한 빠른 검색
const userMap = {
  john: { age: 30, city: "New York" },
  jane: { age: 25, city: "Boston" },
};

// O(1) 접근
console.log(userMap["john"]);

// 배열을 사용한 경우
const users = [
  { name: "john", age: 30, city: "New York" },
  { name: "jane", age: 25, city: "Boston" },
];

// O(n) 검색
const john = users.find((user) => user.name === "john");
```

### 2. 배열 작업 최적화

```jsx
// 비효율적인 방법
const arr = [];
for (let i = 0; i < 10000; i++) {
  arr.unshift(i); // O(n) 매 반복마다
}

// 최적화된 방법
const arr = [];
for (let i = 0; i < 10000; i++) {
  arr.push(i); // O(1) 매 반복마다
}
arr.reverse(); // 한 번만 O(n)
```

### 3. 캐싱 활용

```jsx
// 비효율적인 방법
function findUser(users, id) {
  return users.find((user) => user.id === id); // 매번 O(n)
  // 매번 전체 배열 검색: ~100ms
}

// 최적화된 방법
const userCache = new Map();
function findUserCached(users, id) {
  if (!userCache.has(id)) {
    const user = users.find((user) => user.id === id);
    userCache.set(id, user);
  }
  return userCache.get(id); // O(1)
}
// 첫 번째: ~100ms
// 두 번째부터: ~0.1ms
```

## 실제 사용 사례와 성능 비교

### 1. 대량의 데이터 처리

```jsx
// 성능 테스트 함수
function performanceTest(size) {
  // 배열을 사용한 방법
  const arr = [];
  console.time("Array operations");
  for (let i = 0; i < size; i++) {
    arr.push({ id: i, value: `item ${i}` });
  }
  const found = arr.find((item) => item.id === size - 1);
  console.timeEnd("Array operations");

  // 객체를 사용한 방법
  const obj = {};
  console.time("Object operations");
  for (let i = 0; i < size; i++) {
    obj[i] = { id: i, value: `item ${i}` };
  }
  const foundInObj = obj[size - 1];
  console.timeEnd("Object operations");
}

// 다양한 크기로 테스트
performanceTest(100000);
```

### 2. 빈도 계산

```jsx
// 배열을 사용한 방법 (비효율적)
function countFrequencyArray(arr) {
  return arr.reduce((acc, curr) => {
    const count = arr.filter((item) => item === curr).length;
    acc[curr] = count;
    return acc;
  }, {});
}

// 객체를 사용한 방법 (효율적)
function countFrequencyObject(arr) {
  return arr.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});
}

// 성능 비교
const testArray = Array(10000)
  .fill()
  .map(() => Math.floor(Math.random() * 100));

console.time("Array method");
countFrequencyArray(testArray);
console.timeEnd("Array method");

console.time("Object method");
countFrequencyObject(testArray);
console.timeEnd("Object method");

// 10000개 요소에 대한 테스트
// Array method: ~5000ms
// Object method: ~10ms
```

- 객체를 사용한 방법이 빠른 이유는 중복순회를 하지 않기 때문이다.

## 실제 적용 시 고려 사항

- 데이터 접근 패턴
  - 키로 접근이 많다면 객체 사용
  - 순차 접근이 많다면 배열 사용
- 메모리 사용
  - 희소 배열은 메모리를 낭비할 수 있음
  - 객체는 키를 문자열로 저장하므로 추가 메모리 사용
- 데이터 크기
  - 작은 데이터셋: 성능 차이 미미
  - 큰 데이터셋: 올바른 자료구조 선택이 중요

## 결론

배열과 객체는 각각의 장단점이 있다:

- 객체는 키-값 쌍의 빠른 접근이 필요할 때 적합
- 배열은 순서가 있는 데이터를 다룰 때 적합

성능 최적화를 위해서는:

1. 적절한 데이터 구조 선택
2. 배열 메서드의 시간 복잡도 이해
3. 캐싱과 메모리 사용 최적화

## 마무리

이 글에서 다룬 내용을 넘어서 추가로 고려해 볼만한 주제들이 몇 가지 더 있다.

- 브라우저별 성능 특성
  - Chrome, Firefox, Safari 등 브라우저마다 배열과 객체의 내부 구현이 다름
  - 특히 V8 엔진(Chrome, Node.js)의 최적화 방식 이해가 중요
- 고급 데이터 구조와의 비교
  - Map, Set, WeakMap 등 ES6+ 데이터 구조의 활용
  - 특수한 상황에서의 LinkedList, Tree 구조 활용 사례
- 메모리 관리와 가비지 컬렉션
  - 대규모 애플리케이션에서의 메모리 누수 방지
  - 효율적인 메모리 사용을 위한 데이터 구조 선택
- 실제 프로젝트 적용
  - 성능 프로파일링 도구 활용 방법
  - 실제 사용자 환경에서의 성능 모니터링
  - A/B 테스트를 통한 최적화 검증

다만 실제 프로젝트에 적용할 경우 프로덕션 환경에서의 실제 UX를 고려하여 최적화가 필요할 것 같다.

## 참고 자료

- [MDN Web Docs: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN Web Docs: Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [JavaScript Arrays and Performance](https://evan-moon.github.io/2019/06/15/diving-into-js-array/)
