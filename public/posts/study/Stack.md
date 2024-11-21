# [자료구조] 스택(Stack)

## 개요

스택(Stack)은 후입선출(LIFO, Last In First Out) 방식으로 동작하는 자료구조입니다.  
가장 나중에 들어온 데이터가 가장 먼저 처리됩니다.

## 특징

1. **삽입(Push):** 데이터를 스택의 맨 위에 추가.
2. **삭제(Pop):** 데이터를 스택의 맨 위에서 제거.
3. **탐색:** 스택의 현재 맨 위 데이터를 확인.

## 구현 예제 (JavaScript)

```javascript
class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element); // 맨 위에 추가
  }

  pop() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items.pop(); // 맨 위에서 제거
  }

  isEmpty() {
    return this.items.length === 0;
  }

  peek() {
    return this.isEmpty()
      ? "Stack is empty"
      : this.items[this.items.length - 1];
  }
}
```

## 활용 사례

- 함수 호출 기록 (Call Stack)
- 괄호 유효성 검사
- 웹 브라우저 뒤로가기 기능
