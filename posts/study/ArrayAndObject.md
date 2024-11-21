# 자바스크립트 배열과 객체의 성능

자바스크립트에서 가장 기본적인 데이터 구조인 배열과 객체의 성능 특성을 이해하는 것은 효율적인 코드 작성을 위해 매우 중요합니다. 이 글에서는 각 데이터 구조의 시간 복잡도와 성능 특성을 자세히 살펴보겠습니다.

## 목차

1. [객체(Object)의 Big-O](#object-big-o)
2. [배열(Array)의 Big-O](#array-big-o)
3. [배열 메서드의 시간 복잡도](#array-methods)
4. [성능 최적화 전략](#optimization)
5. [실제 사용 사례와 성능 비교](#use-cases)

## 객체(Object)의 Big-O {#object-big-o}

객체는 정렬되지 않은 키-값 쌍의 데이터 구조입니다.

### 시간 복잡도

```javascript
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

### 예제 코드

```javascript
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

## 배열(Array)의 Big-O {#array-big-o}

배열은 순서가 있는 데이터 구조입니다.

### 시간 복잡도

| 작업             | 시간 복잡도 | 설명                |
| ---------------- | ----------- | ------------------- |
| 접근             | O(1)        | 인덱스로 직접 접근  |
| 검색             | O(n)        | 전체 배열 순회 필요 |
| 삽입/삭제 (끝)   | O(1)        | push/pop            |
| 삽입/삭제 (시작) | O(n)        | unshift/shift       |
| 삽입/삭제 (중간) | O(n)        | splice              |

### 배열 접근이 느린 경우

배열 접근이 느려지는 주요 원인들:

1. **메모리 단편화**

```javascript
// 불연속적인 메모리 할당
const arr = new Array(1000000);
for (let i = 0; i < arr.length; i += 100) {
  arr[i] = i;
}
```

2. **배열 크기 변경**

```javascript
let arr = [];
// 배열 크기가 자주 변경되면 메모리 재할당 발생
for (let i = 0; i < 1000000; i++) {
  arr.push(i);
}
```

3. **희소 배열**

```javascript
const sparseArray = [];
sparseArray[0] = "first";
sparseArray[1000000] = "last";
// 중간의 빈 슬롯들로 인한 성능 저하
```

## 배열 메서드의 시간 복잡도 {#array-methods}

### 주요 배열 메서드 성능

```javascript
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

```javascript
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
```

## 성능 최적화 전략 {#optimization}

### 1. 올바른 데이터 구조 선택

```javascript
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

```javascript
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

```javascript
// 비효율적인 방법
function findUser(users, id) {
  return users.find((user) => user.id === id); // 매번 O(n)
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
```

## 실제 사용 사례와 성능 비교 {#use-cases}

### 1. 대량 데이터 처리

```javascript
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

```javascript
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
```

## 결론

배열과 객체는 각각의 장단점이 있습니다:

- **객체**는 키-값 쌍의 빠른 접근이 필요할 때 적합
- **배열**은 순서가 있는 데이터를 다룰 때 적합

성능 최적화를 위해서는:

1. 적절한 데이터 구조 선택
2. 배열 메서드의 시간 복잡도 이해
3. 캐싱과 메모리 사용 최적화
4. 상황에 따른 트레이드오프 고려

추가적으로

- 특정 브라우저나 환경에서의 성능 차이
- 더 복잡한 데이터 구조와의 비교
- 메모리 사용량 분석
- 실제 프로젝트 사례
  에 대해서 더 알아 볼 수 있습니다.

## 참고 자료

- [MDN Web Docs: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN Web Docs: Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [JavaScript Arrays and Performance](https://evan-moon.github.io/2019/06/15/diving-into-js-array/)
