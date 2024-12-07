# React에서 Chart.js 를 활용한 데이터 시각화

GA를 통해 가져온 데이터를 Chart.js를 활용하여 시각화한 과정을 기록해 보았다. Chart.js는 웹에서 데이터 시각화를 구현할 때 가장 많이 사용되는 라이브러리 중 하나로, React와의 통합이 쉽고 다양한 커스터마이징 옵션을 제공한다.

## 목차

1. [기본 설정]
2. [차트 종류별 구현]
3. [스타일링과 커스터마이징]
4. [인터랙티브 기능]
5. [성능 최적화]

## 기본 설정

Chart.js를 React 프로젝트에서 사용하기 위한 기본적인 설정 방법이다.

### 필요한 패키지 설치

```bash
npm install chart.js react-chartjs-2 styled-components
```

- react-chartjs-2는 React 컴포넌트로 차트를 쉽게 사용할 수 있게 해주는 래퍼 라이브러리이다
- 차트 컨테이너의 스타일링을 위해 styled-components 사용

### 기본 차트 컴포넌트 설정

Chart.js는 모듈러 방식으로 설계되어 있어, 필요한 컴포넌트만 선택적으로 등록하여 사용할 수 있다. 이는 번들 크기를 최적화하는 데 도움이 된다.

```tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
```

### 타입 정의

```tsx
interface ChartDataPoint {
  date: string;
  value: number;
}

interface ChartProps {
  data: ChartDataPoint[];
  title?: string;
  color?: string;
}
```

## 차트 종류별 구현

각 차트 타입별 구현 방법
Chart.js는 다양한 차트 타입을 제공하며, 데이터를 효과적으로 표현할 수 있는 용도에 따라 각 차트를 골라 사용한다.

### 1. 라인 차트 구현

라인 차트는 시계열 데이터를 표현하는 데 가장 적합한 차트 타입이다. 시간에 따른 변화나 추세를 파악하기 쉽다.

```tsx
import { Line } from "react-chartjs-2";

interface LineChartProps {
  data: {
    date: string;
    value: number;
  }[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "데이터 추이",
        data: data.map((item) => item.value),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "라인 차트 예제",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};
```

### 2. 멀티 라인 차트

여러 지표를 동시에 비교해야 할 때 사용하는 차트 타입이다. 각 라인의 색상과 스타일을 다르게 설정하여 구분을 쉽게 할 수 있다.

```tsx
interface MultiLineDataProps {
  date: string;
  metric1: number;
  metric2: number;
  metric3: number;
}

const MultiLineChart: React.FC<{ data: MultiLineDataProps[] }> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "지표 1",
        data: data.map((d) => d.metric1),
        borderColor: "#5f996d",
        backgroundColor: "#5f996db0",
      },
      {
        label: "지표 2",
        data: data.map((d) => d.metric2),
        borderColor: "rgb(97, 134, 158)",
        backgroundColor: "rgba(97, 134, 158, 0.2)",
      },
      {
        label: "지표 3",
        data: data.map((d) => d.metric3),
        borderColor: "#c2cec5",
        backgroundColor: "#c2cec5b0",
      },
    ],
  };

  return <Line data={chartData} options={options} />;
};
```

### 3. 커스텀 스타일링

styled-components를 사용하여 차트 컨테이너를 스타일링하였고, Chart.js의 옵션을 통해 차트 내부 요소들의 스타일을 조정하였다.

```tsx
const StyledChartContainer = styled.div`
  height: 400px;
  width: 100%;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        font: {
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          size: 12,
        },
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: "rgba(0,0,0,0.8)",
      titleFont: {
        size: 14,
      },
      bodyFont: {
        size: 13,
      },
      padding: 15,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0,0,0,0.1)",
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};
```

## 인터랙티브 기능 구현

### 1. 클릭 이벤트 처리

Chart.js에서 지원하는 다양한 이벤트 핸들링을 통해 차트의 데이터 포인트를 클릭했을 때 해당 데이터의 상세 정보를 표시하거나 추가 작업을 수행할 수 있다.

```tsx
const ChartWithInteraction: React.FC<ChartProps> = ({ data }) => {
  const handleClick = (event: any) => {
    const points = event.chart.getElementsAtEventForMode(
      event,
      "nearest",
      { intersect: true },
      true
    );

    if (points.length) {
      const firstPoint = points[0];
      const label = event.chart.data.labels[firstPoint.index];
      const value =
        event.chart.data.datasets[firstPoint.datasetIndex].data[
          firstPoint.index
        ];
      console.log(label, value);
    }
  };

  return <Line data={chartData} options={options} onClick={handleClick} />;
};
```

### 2. 동적 데이터 업데이트

setInterval을 사용해서 주시적으로 테이터를 업데이트 해 주었다.

```tsx
const DynamicChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const updateData = () => {
      // 새로운 데이터 포인트 추가
      const newData = {
        labels: [...chartData.labels, new Date().toLocaleTimeString()],
        datasets: [
          {
            ...chartData.datasets[0],
            data: [...chartData.datasets[0].data, Math.random() * 100],
          },
        ],
      };

      setChartData(newData);
    };

    const interval = setInterval(updateData, 1000);
    return () => clearInterval(interval);
  }, [chartData]);

  return <Line data={chartData} options={options} />;
};
```

## 성능 최적화

대량의 데이터 처리 또는 실시간 업게이트가 필요한 경우를 위한 성능 최적화 방법

### 1. 메모이제이션 사용

React의 useMemo() 를 사용해서 불필요한 차트 데이터 재계산을 방지한다.

```tsx
import { useMemo } from "react";

const OptimizedChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.date),
      datasets: [
        {
          label: "데이터",
          data: data.map((d) => d.value),
          // ... 기타 설정
        },
      ],
    }),
    [data]
  );

  return <Line data={chartData} options={options} />;
};
```

### 2. 데이터 샘플링

대용량 데이터셋을 처리할 때 모든 데이터 포인트를 표시하면 성능 저하가 발생할 수 있다. 이때 데이터 샘플링을 통해 적절한 수의 데이ㅌㅓ 포인트만 표시하여 성능 개선을 할 수 있다.

```tsx
const sampleData = (data: DataPoint[], sampleSize: number) => {
  const step = Math.ceil(data.length / sampleSize);
  return data.filter((_, index) => index % step === 0);
};

const LargeDatasetChart: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  const sampledData = useMemo(
    () => sampleData(data, 100), // 100개 포인트로 샘플링
    [data]
  );

  return <Line data={sampledData} options={options} />;
};
```

## 실제 구현

### 사용자 활동 분석 차트

```tsx
interface AUDataProps {
  date: string;
  dauPerMau: string;
  dauPerWau: string;
  wauPerMau: string;
}

const UserActivityChart: React.FC<{ data: AUDataProps[] }> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "DAU/MAU",
        data: data.map((d) => d.dauPerMau),
        borderColor: "#5f996d",
        backgroundColor: "#5f996db0",
      },
      {
        label: "DAU/WAU",
        data: data.map((d) => d.dauPerWau),
        borderColor: "rgb(97, 134, 158)",
        backgroundColor: "rgba(97, 134, 158, 0.2)",
      },
      {
        label: "WAU/MAU",
        data: data.map((d) => d.wauPerMau),
        borderColor: "#c2cec5",
        backgroundColor: "#c2cec5b0",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <StyledChartContainer>
      <Line data={chartData} options={options} />
    </StyledChartContainer>
  );
};
```

## 결론

Chart.js와 React를 함께 사용하면:

1. 다양한 차트 유형 구현 가능
2. 커스터마이징 용이
3. 인터랙티브 기능 구현
4. 성능 최적화 옵션

주의사항:

- 대용량 데이터 처리 시 샘플링 고려
- 메모이제이션을 통한 성능 최적화
- 반응형 디자인 구현
- 접근성 고려

## 참고 자료

- [Chart.js 공식 문서](https://www.chartjs.org/)
- [Chart.js 성능 최적화 가이드](https://www.chartjs.org/docs/latest/general/performance.html)
