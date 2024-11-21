# Big-O 표기법: 알고리즘 복잡도 이해하기

알고리즘의 효율성을 분석하고 비교하는 데 사용되는 Big-O 표기법은 프로그래밍에서 매우 중요한 개념입니다. 이 글에서는 Big-O 표기법의 기본 개념부터 실제 적용 사례까지 자세히 알아보겠습니다.

## 목차

1. [Big-O 표기법이란?](#what-is-big-o)
2. [주요 시간 복잡도](#time-complexity)
3. [공간 복잡도](#space-complexity)
4. [실제 예제](#examples)
5. [복잡도 분석 팁](#analysis-tips)

## Big-O 표기법이란? {#what-is-big-o}

Big-O 표기법은 알고리즘의 성능이나 복잡도를 표현하는 방법입니다. 입력 크기(n)가 증가할 때 알고리즘의 시간이나 공간이 어떻게 증가하는지를 나타냅니다.

### 특징

- 최악의 경우를 고려
- 상수는 무시
- 가장 큰 차수의 항만 고려

예를 들어, 다음과 같은 함수가 있다면:

```python
def example_function(n):
    result = 5 + n + (3 * n * n)  # 5 + n + 3n²
    return result
```

이 함수의 Big-O는 O(n²)입니다. 왜냐하면:

1. 상수항 5는 무시
2. n항은 n²보다 작으므로 무시
3. 3n²의 계수 3도 무시

## 주요 시간 복잡도 {#time-complexity}

### O(1) - 상수 시간

입력 크기와 관계없이 일정한 시간이 걸리는 알고리즘

```python
def get_first_element(arr):
    return arr[0]  # O(1)
```

### O(log n) - 로그 시간

입력이 커질수록 실행 시간이 로그적으로 증가

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1
```

### O(n) - 선형 시간

입력 크기에 비례하여 실행 시간이 증가

```python
def find_max(arr):
    max_val = arr[0]
    for num in arr:  # O(n)
        if num > max_val:
            max_val = num
    return max_val
```

### O(n log n) - 로그 선형 시간

대부분의 효율적인 정렬 알고리즘의 시간 복잡도

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)
```

### O(n²) - 이차 시간

중첩 반복문을 사용하는 알고리즘

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):  # O(n)
        for j in range(n - 1):  # O(n)
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr
```

### O(2ⁿ) - 지수 시간

재귀적으로 모든 경우의 수를 탐색하는 알고리즘

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

## 공간 복잡도 {#space-complexity}

공간 복잡도는 알고리즘이 사용하는 메모리 공간을 분석합니다.

### 예제: 다양한 공간 복잡도

```python
# O(1) 공간
def sum_array(arr):
    total = 0  # 상수 공간
    for num in arr:
        total += num
    return total

# O(n) 공간
def create_doubled_array(arr):
    return [num * 2 for num in arr]  # 새로운 배열 생성

# O(n²) 공간
def create_matrix(n):
    return [[0 for _ in range(n)] for _ in range(n)]
```

## 실제 예제 {#examples}

### 1. 두 배열의 교집합 찾기

```python
# 방법 1: O(n²) 시간, O(n) 공간
def find_intersection_naive(arr1, arr2):
    result = []
    for x in arr1:  # O(n)
        for y in arr2:  # O(n)
            if x == y and x not in result:
                result.append(x)
    return result

# 방법 2: O(n) 시간, O(n) 공간
def find_intersection_optimized(arr1, arr2):
    set1 = set(arr1)  # O(n) 공간
    return [x for x in arr2 if x in set1]  # O(n) 시간
```

### 2. 정렬된 배열에서 중복 제거

```python
# O(n) 시간, O(1) 공간
def remove_duplicates(sorted_arr):
    if not sorted_arr:
        return 0

    write_pos = 1
    for read_pos in range(1, len(sorted_arr)):
        if sorted_arr[read_pos] != sorted_arr[read_pos - 1]:
            sorted_arr[write_pos] = sorted_arr[read_pos]
            write_pos += 1

    return write_pos
```

## 복잡도 분석 팁 {#analysis-tips}

1. **반복문 분석**

   - 단일 반복문: O(n)
   - 중첩 반복문: O(n²)
   - 반복문 내 반복 횟수가 절반씩 줄어듦: O(log n)

2. **재귀 함수 분석**

   ```python
   def recursive_function(n):
       if n <= 1:
           return 1
       return recursive_function(n - 1)  # O(n)

   def recursive_divide(n):
       if n <= 1:
           return 1
       return recursive_divide(n // 2)  # O(log n)
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

Big-O 표기법은 알고리즘의 효율성을 이해하고 비교하는 데 필수적인 도구입니다. 실제 개발에서는:

1. 입력 크기가 작을 때는 간단한 알고리즘이 더 효율적일 수 있습니다.
2. 상황에 따라 시간과 공간의 트레이드오프를 고려해야 합니다.
3. 실제 환경에서는 상수 시간도 중요할 수 있습니다.

알고리즘의 복잡도를 이해하고 분석하는 능력은 효율적인 코드를 작성하는 데 매우 중요합니다.

## 참고 자료

- Introduction to Algorithms (CLRS)
- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)
- [MIT OpenCourseWare: Introduction to Algorithms](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/)
