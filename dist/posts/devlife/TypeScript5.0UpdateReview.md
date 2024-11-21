# TypeScript 5.0: 새로운 기능과 개선사항 총정리

TypeScript 5.0이 출시되면서 다양한 새로운 기능과 개선사항이 도입되었습니다. 이번 포스트에서는 TypeScript 5.0의 주요 변경사항들을 실제 사용 예제와 함께 자세히 살펴보겠습니다.

## 목차

1. [Decorators](#decorators)
2. [const Type Parameters](#const-type-parameters)
3. [모듈 Resolution 개선](#module-resolution)
4. [Export Field Support](#export-field)
5. [Multiple 설정 파일](#multiple-config)
6. [새로운 타입 시스템 기능](#type-system)

## Decorators {#decorators}

TypeScript 5.0은 ECMAScript의 새로운 데코레이터 표준을 지원합니다. 이전 실험적 데코레이터와는 달리, 새로운 데코레이터는 더 간단하고 유연한 문법을 제공합니다.

### 이전 vs 새로운 데코레이터

```typescript
// 이전 실험적 데코레이터
function logged(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  // ...
}

// 새로운 데코레이터
function logged<T>(value: T, context: ClassMethodDecoratorContext) {
  return function (this: T, ...args: any[]) {
    console.log(`Entering ${String(context.name)}`);
    const result = value.apply(this, args);
    console.log(`Exiting ${String(context.name)}`);
    return result;
  };
}

class Example {
  @logged
  greet(name: string) {
    return `Hello, ${name}!`;
  }
}
```

### 데코레이터 합성

새로운 데코레이터는 함수 합성처럼 작동하며, 왼쪽에서 오른쪽으로 평가됩니다:

```typescript
function first(target: any) {
  console.log("first(): factory evaluated");
  return function (value: any, context: any) {
    console.log("first(): called");
  };
}

function second(target: any) {
  console.log("second(): factory evaluated");
  return function (value: any, context: any) {
    console.log("second(): called");
  };
}

@first
@second
class Example {}
```

## const Type Parameters {#const-type-parameters}

TypeScript 5.0은 const 타입 파라미터를 도입했습니다. 이를 통해 리터럴 타입을 더 정확하게 추론할 수 있게 되었습니다.

```typescript
// 이전 방식
function concat<T extends readonly unknown[]>(arr: T, ...items: T) {
  return [...arr, ...items];
}

// TypeScript 5.0
function concat<const T extends readonly unknown[]>(arr: T, ...items: T) {
  return [...arr, ...items];
}

// 사용 예시
const result = concat([1, 2] as const, [3, 4] as const);
// 타입: readonly [1, 2, 3, 4]
```

### 객체 리터럴과 함께 사용

```typescript
declare function makeRecord<const T extends PropertyKey, const V>(
  obj: Record<T, V>
): Record<T, V>;

const result = makeRecord({
  name: "TypeScript",
  version: 5,
});
// 타입: Record<"name" | "version", string | number>
```

## 모듈 Resolution 개선 {#module-resolution}

TypeScript 5.0은 모듈 해석 방식을 크게 개선했습니다. 특히 Node.js의 모듈 해석 알고리즘을 더 잘 지원하게 되었습니다.

### bundler와 node16/nodenext 해석 방식

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    // 또는
    "moduleResolution": "node16"
  }
}
```

### 조건부 내보내기 지원

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

## Export Field Support {#export-field}

package.json의 `exports` 필드에 대한 지원이 개선되었습니다.

```json
{
  "name": "my-package",
  "exports": {
    ".": {
      "types": "./types/index.d.ts",
      "import": "./esm/index.js",
      "require": "./cjs/index.js"
    },
    "./feature": {
      "types": "./types/feature.d.ts",
      "import": "./esm/feature.js",
      "require": "./cjs/feature.js"
    }
  }
}
```

## Multiple 설정 파일 {#multiple-config}

TypeScript 5.0에서는 여러 설정 파일을 더 쉽게 관리할 수 있게 되었습니다.

```json
// tsconfig.json
{
  "extends": ["./tsconfig.base.json", "./tsconfig.paths.json"]
}
```

## 새로운 타입 시스템 기능 {#type-system}

### All 및 Exact Types

```typescript
type Colors = "red" | "green" | "blue";

// 모든 가능한 조합을 포함하는 타입
type RGB = [Colors, Colors, Colors];

// Exact Types
type Point = {
  readonly x: number;
  readonly y: number;
};
```

### 유니온 타입 개선

```typescript
type Status = "success" | "error" | "loading";
type Response<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: Error }
  | { status: "loading" };

function handleResponse<T>(response: Response<T>) {
  if (response.status === "success") {
    // T 타입의 data에 접근 가능
    return response.data;
  }
  // ...
}
```

## 성능 개선

TypeScript 5.0은 이전 버전에 비해 상당한 성능 향상을 이루었습니다:

- 타입 검사 속도 향상
- 메모리 사용량 감소
- 빌드 시간 단축

## 마이그레이션 가이드

TypeScript 5.0으로 업그레이드하기 위한 주요 단계:

1. package.json 업데이트:

```bash
npm install typescript@latest
```

2. tsconfig.json 설정 확인:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    // 새로운 데코레이터 사용 시
    "experimentalDecorators": false
  }
}
```

3. 기존 데코레이터 마이그레이션
4. 모듈 해석 방식 확인

## 결론

TypeScript 5.0은 데코레이터의 표준화, const 타입 파라미터, 개선된 모듈 해석 등 많은 혁신적인 기능들을 도입했습니다. 특히 새로운 데코레이터 문법과 const 타입 파라미터는 코드의 타입 안전성과 표현력을 크게 향상시켜줍니다.

이러한 개선사항들은 TypeScript로 개발하는 개발자들에게 더 나은 개발 경험을 제공할 것으로 기대됩니다. 특히 성능 개선과 새로운 타입 시스템 기능들은 대규모 프로젝트에서 더욱 빛을 발할 것입니다.

## 참고 자료

- [TypeScript 5.0 공식 릴리스 노트](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [새로운 데코레이터 제안](https://github.com/tc39/proposal-decorators)
