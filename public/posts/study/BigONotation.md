# Big-O 표기법: 알고리즘 복잡도 이해하기

알고리즘에 대해 공부하며 알고리즘의 효율성을 분석하고 비교하는 데 사용되는 중요한 개념인 Big-O 표기법에 대해서 정리해 보기 위해 Big-O 표기법의 기본 개념부터 실제 적용 사례까지 정리해 보았다.

## 목차

1. [Big-O 표기법이란?]
2. [주요 시간 복잡도]
3. [공간 복잡도]
4. [실제 예제]
5. [복잡도 분석 팁]

## Big-O 표기법이란?

Big-O 표기법은 알고리즘의 성능이나 복잡도를 표현하는 방법. 입력 크기(n)가 증가할 때 알고리즘의 시간이나 공간이 어떻게 증가하는지를 나타낸다.

### 특징

- 최악의 경우를 고려
- 상수는 무시
- 가장 큰 차수의 항만 고려

예를 들어, 다음과 같은 함수가 있다면:

```jsx
function exampleFunction(n) {
  let result = 5 + n + 3 * n * n; // 5 + n + 3n²
  return result;
}
```

이 함수의 Big-O는 O(n²)이다. 왜냐하면:

1. 상수항 5는 무시
2. n항은 n²보다 작으므로 무시
3. 3n²의 계수 3도 무시

## 주요 시간 복잡도

### O(1) - 상수 시간

입력 크기와 관계없이 일정한 시간이 걸리는 알고리즘

```jsx
function getFirstElement(arr) {
  return arr[0]; // O(1)
}
```

### O(log n) - 로그 시간

입력이 커질수록 실행 시간이 로그적으로 증가

```jsx
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}
```

### O(n) - 선형 시간

입력 크기에 비례하여 실행 시간이 증가

```jsx
function findMax(arr) {
  let maxVal = arr[0];
  for (const num of arr) {
    // O(n)
    if (num > maxVal) {
      maxVal = num;
    }
  }
  return maxVal;
}
```

### O(n log n) - 로그 선형 시간

대부분의 효율적인 정렬 알고리즘의 시간 복잡도

```jsx
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

// merge 함수 구현
function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex), right.slice(rightIndex));
}
```

### O(n²) - 이차 시간

중첩 반복문을 사용하는 알고리즘

```jsx
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    // O(n)
    for (let j = 0; j < n - 1; j++) {
      // O(n)
      if (arr[j] > arr[j + 1]) {
        // ES6 구조 분해 할당을 사용한 swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
```

### O(2ⁿ) - 지수 시간

재귀적으로 모든 경우의 수를 탐색하는 알고리즘

```jsx
function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

## 공간 복잡도

공간 복잡도는 알고리즘이 사용하는 메모리 공간을 분석한다.

### 예제: 다양한 공간 복잡도

```jsx
// O(1) 공간
function sumArray(arr) {
  let total = 0; // 상수 공간
  for (const num of arr) {
    total += num;
  }
  return total;
}

// O(n) 공간
function createDoubledArray(arr) {
  return arr.map((num) => num * 2); // 새로운 배열 생성
  // 또는 아래처럼도 가능:
  // return Array.from(arr, num => num * 2);
}

// O(n²) 공간
function createMatrix(n) {
  return Array(n)
    .fill()
    .map(() => Array(n).fill(0));
}
```

## 실제 예제

### 1. 두 배열의 교집합 찾기

```jsx
// 방법 1: O(n²) 시간, O(n) 공간
function findIntersectionNaive(arr1, arr2) {
  const result = [];
  for (const x of arr1) {
    // O(n)
    for (const y of arr2) {
      // O(n)
      if (x === y && !result.includes(x)) {
        result.push(x);
      }
    }
  }
  return result;
}

// 방법 2: O(n) 시간, O(n) 공간
function findIntersectionOptimized(arr1, arr2) {
  const set1 = new Set(arr1); // O(n) 공간
  return arr2.filter((x) => set1.has(x)); // O(n) 시간
}
```

### 2. 정렬된 배열에서 중복 제거

```jsx
function removeDuplicates(sortedArr) {
  if (!sortedArr.length) {
    return 0;
  }

  let writePos = 1;
  for (let readPos = 1; readPos < sortedArr.length; readPos++) {
    if (sortedArr[readPos] !== sortedArr[readPos - 1]) {
      sortedArr[writePos] = sortedArr[readPos];
      writePos++;
    }
  }

  return writePos;
}
```

## 복잡도 분석 팁

1. **반복문 분석**
   - 단일 반복문: O(n)
   - 중첩 반복문: O(n²)
   - 반복문 내 반복 횟수가 절반씩 줄어듦: O(log n)
2. **재귀 함수 분석**

   ```jsx
   // O(n) 선형 재귀
   function recursiveFunction(n) {
     if (n <= 1) {
       return 1;
     }
     return recursiveFunction(n - 1); // O(n)
   }

   // O(log n) 로그 재귀
   function recursiveDivide(n) {
     if (n <= 1) {
       return 1;
     }
     return recursiveDivide(Math.floor(n / 2)); // O(log n)
   }
   ```

3. **공통적인 복잡도**
   - 정렬: 대부분 O(n log n)
   - 해시 테이블 검색: O(1) 평균, O(n) 최악
   - 이진 검색: O(log n)

## 시간 복잡도 비교 차트

```
O(1)      < O(log n) < O(n)     < O(n log n) < O(n²)    < O(2ⁿ)
상수 시간 < 로그 시간 < 선형 시간 < 로그 선형  < 이차 시간 < 지수 시간
```

## 결론

Big-O 표기법은 알고리즘의 효율성을 이해하고 비교하는 데 필수적인 도구이다.

실제 개발에서는:

1. 입력 크기가 작을 때는 간단한 알고리즘이 더 효율적일 수 있다.
2. 상황에 따라 시간과 공간의 트레이드오프를 고려해야 한다.
3. 실제 환경에서는 상수 시간도 중요할 수 있다.

알고리즘의 복잡도를 이해하고 분석하는 능력은 효율적인 코드를 작성하는 데 중요하다.

## 마무리

실제 개발하는데에 있어서 적절한 자료구조와 알고리즘을 선택하고, 성능과 가독성 사이의 균형을 판단하거나, 최적화가 필요한 부분을 판단 하는 것이 중요한 것 같다. 대규모 데이터 처리나 실시간 서비스의 응답 시간 최적화, 혹은 비용절감을 위한 효율 증대 등의 영역에서 꼭 필요한 알고리즘이라고 생각했다. 앞으로는 새로운 알고리즘 패턴의 학습과 더불어 최신 최적화 기법에 대해서나 분산 시스템에서의 복잡도 분석에 대한 학습을 시도하며 더 나은 소프트웨어를 위한 사고방식을 만들어 나가고 싶다.

## 참고 자료

- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)

https://developer.mozilla.org/ko/docs/Glossary/Algorithm
