# Why does JavaScript's fetch make me wait TWICE?

최근 Korean FE Article News 를 통해 보게 되었는데, 흥미로운 점이 있어 정리해 보았다.

## Korean FE Article News 소개글

이 영상에서는 JavaScript의 fetch 함수가 왜 두 번의 await를 필요로 하는지 설명한다. 첫 번째 await는 네트워크 요청 후 응답 객체를 반환하지만, 이 객체는 스트림 형태로 제공되기 때문에 두 번째 await로 데이터를 읽어야 한다. 데모를 통해 과정을 시각적으로 보여주는 점이 특히 흥미롭다.

# JavaScript Fetch API가 두 번의 await가 필요한 이유

## fetch의 두 단계 프로세스

### 1. 첫 번째 await - 헤더 수신

```jsx
const response = await fetch(url);
```

- HTTP 응답은 헤더와 바디로 구분되고, 이 시점에서 HTTP 응답의 헤더 부분만 받아온다.
- 상태코드, 헤더 정보 등 메타 데이터 확인가능
- 첫 번째 await는 서버로부터 헤더를 받는 즉시 완료
- 이 시점에서 바디는 아직 완전히 수신되지 않은 상태이다.

### 2. 두 번째 await - 바디 수신

```jsx
const data = await response.json();
```

- response.json()이 Promise를 반환하는 이유는 바디 데이터가 크기 때문
- 네트워크를 통해 전송되는 데이터를 점진적으로 수신
- 전체 데이터가 수신될 때까지 기다려야 함
- 데이터가 청크 단위로 스트리밍된다.
- json(), text() 등의 메서드는 전체 ㅅ트림을 읽고 파싱하는 과정이 필요하다.

## 실제 동작 예시

```jsx
// 기본적인 사용
const response = await fetch("/api/data"); // 헤더 수신
const data = await response.json(); // 바디 수신

// 스트리밍 방식으로 데이터 받기
const response = await fetch("/api/data");
const decoder = new TextDecoder();
for await (const chunk of response.body) {
  const text = decoder.decode(chunk);
  console.log(text); // 데이터를 청크 단위로 처리
}
```

## 참고사항

1. `JSON.parse()`와의 차이점
   - `JSON.parse()`는 동기 작업
   - `response.json()`은 비동기 작업(네트워크 통신 필요)
2. 성능 최적화
   - 헤더를 먼저 받음으로써 빠른 초기 응답 가능
   - 대용량 데이터의 경우 스트리밍 방식으로 처리 가능
3. 실제 활용
   - 상태 코드 확인이 빠르게 가능
   - 프로그레시브 로딩 구현에 활용 가능
   - 실시간 데이터 스트리밍에 적합

이러한 두 단계 프로세스는 대용량 데이터 처리와 네트워크 최적화를 위한 웹 표준의 설계 결과이다. 특히 대용량 데이터를 다루거나 실시간 스트리밍이 필요한 경우에 유용한 특징이다.

## 요약

첫 번째 대기는 헤더만 기다린 다음 두 번째 대기는 전체 페이로드를 한 번에 처리하는 것이 아니라 응답 스트림(바이트가 증분적으로 들어옴)을 구문 분석하기 때문에 본문을 기다린다

참고

https://www.youtube.com/watch?v=Ki64Cnyf_cA

https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
