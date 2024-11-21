# React에서 Chart.js 를 활용한 데이터 시각화

GA를 통해 가져온 데이터를 Chart.js를 활용하여 시각화하였습니다.

## 목차

1. [기본 설정](#setup)
2. [차트 종류별 구현](#chart-types)
3. [스타일링과 커스터마이징](#styling)
4. [인터랙티브 기능](#interactive)
5. [성능 최적화](#optimization)

## 기본 설정 {#setup}

### 필요한 패키지 설치

```bash
npm install chart.js react-chartjs-2 styled-components
```

### 기본 차트 컴포넌트 설정

```typescript
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

```typescript
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

## 차트 종류별 구현 {#chart-types}

### 1. 라인 차트 구현

```typescript
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

```typescript
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

```typescript
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

## 인터랙티브 기능 구현 {#interactive}

### 1. 클릭 이벤트 처리

```typescript
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

```typescript
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

## 성능 최적화 {#optimization}

### 1. 메모이제이션 사용

```typescript
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

```typescript
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

## 실제 구현 예제

### 사용자 활동 분석 차트

```typescript
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
- [react-chartjs-2 문서](https://react-chartjs-2.js.org/)
- [Chart.js 성능 최적화 가이드](https://www.chartjs.org/docs/latest/general/performance.html)
