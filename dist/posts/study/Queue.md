# [자료구조] 큐(Queue)

## 개요

큐(Queue)는 선입선출(FIFO, First In First Out) 방식으로 동작하는 자료구조입니다.  
가장 먼저 들어온 데이터가 가장 먼저 처리됩니다.

## 특징

1. **삽입(Enqueue):** 데이터를 큐의 뒤에 추가.
2. **삭제(Dequeue):** 데이터를 큐의 앞에서 제거.
3. **탐색:** 현재 데이터의 상태를 확인.

## 구현 예제 (JavaScript)

```javascript
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element); // 뒤에 추가
  }

  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items.shift(); // 앞에서 제거
  }

  isEmpty() {
    return this.items.length === 0;
  }

  front() {
    return this.isEmpty() ? "Queue is empty" : this.items[0];
  }
}
```

## 활용 사례

- 프린터 작업 대기열
- 콜센터 대기 시스템
- BFS (Breadth-First Search) 알고리즘
