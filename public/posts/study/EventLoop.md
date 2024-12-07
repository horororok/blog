# 자바스크립트 이벤트 루프와 실행 순서

헷갈리는 부분들이 있어 정리해 보았다.

Java Script는 싱글 스레드 언어이지만, 비동기 작업을 효율적으로 처리할 수 있다. 이는 ‘이벤트 루프’라는 메커니즘 덕분인데, 이에 대해 정리해 보았다.

## 목차

JavaScript 런타임의 구성 요소

실행 순서

마이크로태스크, 매크로태스크

## JavaScript 런타임의 구성 요소

### 콜 스택(Call Stack)

- 함수 호출을 추적하는 데이터 구조
- LIFO(Last In, First Out)방식으로 동작
- 현재 실행 중인 코드의 위치를 추적

### 힙(Heap)

- 객체가 할당되는 메모리 공간
- 구조화되지 않은 큰 메모리 영역

### 태스크 큐(Tast Queue / Callback Que)

- 실행할 콜백 함수들이 대기하는 큐
- setTimeOut, Promise 등의 비동기 작업 완료 후 실행될 콜백들이 여기에 저장된다.

### 이벤트 루프

- 콜 스택과 태스크 큐를 모니터링
- 콜 스택이 비어있을 때 태스크 큐의 작업을 콜스택으로 이동시킨다.

## 실행 순서

예제:

```jsx
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");
```

예제 코드의 실행 결과로 예시를 들면

우선 실행 결과는

```jsx
1;
4;
3;
2;
```

이다.

### 실행 과정

1. 초기 실행
   1. Call Stack에 쌓이고 즉시 실행
   2. `console.log(’1’)` 실행
2. setTimeout 만남
   1. setTimeout은 Web API로 이동
   2. 타이머 완료 후(0s) 콜백이 매크로태스크 큐로 이동
3. Promise 만남
   1. Promise의 콜백이 마이크로태스크 큐로 이동
4. 마지막 동기 코드 실행
   1. Call Stack에서 즉시 실행
   2. `console.log(’4’)` 실행
5. Call Stack이 비워진 후
   1. 이벤트 루프가 마이크로태스크 큐 먼저 확인
   2. Promise 콜백을 Call Stack으로 이동
   3. `console.log(’3’)` 실행
6. 마이크로태스크큐가 비워진 것 확인
   1. 매크로애스크 큐 확인
   2. setTimeout 콜백을 Call Stack으로 이동
   3. `console.log(’2’)` 실행

![Call Stack: 현재 실행 중인 함수들이 쌓이는 곳
Heap: 객체들이 저장되는 메모리 공간
Web APIs 브라우저에서 제공하는 API들이 실행되는 영역
Callback Queues: Microtast queue와 Macrotast queue
Event Loop: 큐들을 감시하고 콜백들을 콜 스택으로 이동시키는 메터니즘](https://prod-files-secure.s3.us-west-2.amazonaws.com/6b086d36-2dc1-46ab-af2c-86e17356ffbd/36aa5638-43ec-41f7-8bc3-3a8f172a125a/image.png)

Call Stack: 현재 실행 중인 함수들이 쌓이는 곳
Heap: 객체들이 저장되는 메모리 공간
Web APIs 브라우저에서 제공하는 API들이 실행되는 영역
Callback Queues: Microtast queue와 Macrotast queue
Event Loop: 큐들을 감시하고 콜백들을 콜 스택으로 이동시키는 메터니즘

Event Loop가 지속적으로 순환하면서 콜스택이 비어있는지 확인하고, 마이크로태스크 큐를 먼저 확인하고 처리, 그 다음 매크로태스크 큐를 확인하고 처리 하는 순서로 작동한다.

> **주의**

- 마이크로태스크큐는 매 매크로태스크 사이에 완전히 비워진다.
- 마이크로태스크에서 새로운 마이크로태스크가 생성되면, 해당 태스크도 현재 사이클에서 모두 실행된다.
- 매크로태스크는 한번의 이벤트 루프 사이클에서 하나씩만 실행된다.

> **번외: 자바스크립트 런타임 환경**

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/6b086d36-2dc1-46ab-af2c-86e17356ffbd/f97d4e9c-3418-4eec-9dcc-0ece076ab609/image.png)

이벤트 루프는 메모리 공간과 별개로, 비동기 작업의 실행을 조율하는 독립적인 메커니즘이다.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/6b086d36-2dc1-46ab-af2c-86e17356ffbd/e605c75a-7993-4311-bab6-454345a77e0b/image.png)

이미지와 같이 원시타입의 경우 콜 스택 내에서 직접 값이 저장되고, 참조 타입의 경우 실제 데이터는 힙에 저장되고, 콜 스택에는 그 메모리 주소만 저장된다.

## 마이크로태스크, 매크로태스크

JavaScript의 태스크는 두 가지 종류로 나뉜다.

### 마이크로태스크(Microtasks)

- Promise의 then / catch / finally 핸들러
- queueMicroTask()로 등록된 콜백
- process.nextTick(Node.js)

### 매크로태스크(Macrotasks)

- setTimeout, setInterval
- setImmediate(Node.js)
- requestAnimationFrame(브라우저)
- I/O 작업
- UI 렌더링(브라우저)

항상 마이크로태스크가 매크로태스크보다 먼저 실행된다.
