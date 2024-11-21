# [알고리즘] 이진 탐색(Binary Search)

## 개요

이진 탐색(Binary Search)은 정렬된 배열에서 특정 값을 찾기 위해 사용하는 효율적인 알고리즘입니다.  
시간 복잡도는 O(log n)으로, 큰 데이터셋에서도 빠르게 동작합니다.

## 동작 원리

1. 배열의 중간 값을 선택합니다.
2. 찾고자 하는 값과 중간 값을 비교합니다.
   - 찾고자 하는 값이 중간 값보다 작으면 왼쪽 절반을 탐색.
   - 찾고자 하는 값이 중간 값보다 크면 오른쪽 절반을 탐색.
3. 위 과정을 값이 발견되거나 검색 범위가 없을 때까지 반복합니다.

## 구현 예제 (JavaScript)

```javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid; // 값 찾음
    } else if (arr[mid] < target) {
      left = mid + 1; // 오른쪽으로 이동
    } else {
      right = mid - 1; // 왼쪽으로 이동
    }
  }
  return -1; // 값 없음
}
```

## 활용 사례

- 데이터베이스 검색
- 게임 내 랭킹 검색
- 정렬된 데이터에서 특정 값 찾기
