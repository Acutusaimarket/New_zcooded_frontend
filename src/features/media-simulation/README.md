# Media Simulation Analysis Dashboard

A comprehensive React dashboard for analyzing media simulation results with detailed KPI metrics, persona insights, and strategic recommendations.

## Features

### 🎯 Core Functionality

- **Real-time Data Fetching**: Fetch simulation data via REST API
- **Interactive Charts**: Radar charts, bar charts, line charts using Recharts
- **Multi-tab Navigation**: Overview, Analysis, Comparison, Persona, Recommendations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

### 📊 Dashboard Tabs

#### 1. Overview Tab

- High-level simulation summary
- Media files count and status
- Average effectiveness scores
- Risk assessment indicators
- Quick action buttons (refresh, download, share)

#### 2. Analysis Tab (Coming Soon)

- Individual media analysis
- KPI radar charts
- Detailed metrics breakdown
- Insights and recommendations per media

#### 3. Comparison Tab (Coming Soon)

- Side-by-side media comparison
- Ranking analysis
- Strengths vs weaknesses matrix
- Competitive insights

#### 4. Persona Tab (Coming Soon)

- Target persona profiles
- Behavioral patterns analysis
- Media-persona alignment scores
- Content gap identification

#### 5. Recommendations Tab (Coming Soon)

- Strategic recommendations
- Execution priorities matrix
- Risk mitigation strategies
- Campaign suitability analysis

## Usage

### Basic Implementation

```tsx
import { MediaSimulationDashboard } from "@/features/media-simulation";

export default function MyPage() {
  const simulationId = "68d24739aa642e99ba004341";

  return <MediaSimulationDashboard simulationId={simulationId} />;
}
```

### With Route Parameters

```tsx
import { useParams } from "react-router-dom";

import { MediaSimulationDashboard } from "@/features/media-simulation";

export default function MediaSimulationPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid simulation ID</div>;

  return <MediaSimulationDashboard simulationId={id} />;
}
```

### Custom Hooks Usage

```tsx
import {
  useAnalyticsFilters,
  useChartData,
  useMediaSimulation,
} from "@/features/media-simulation";

function CustomDashboard({ simulationId }: { simulationId: string }) {
  const { data, loading, error, refetch } = useMediaSimulation(simulationId);
  const chartData = useChartData(data);
  const filters = useAnalyticsFilters(data);

  // Your custom implementation
}
```

## API Integration

### Endpoint Configuration

- **Endpoint**: `/api/v1/media/{simulation_id}`
- **Method**: `GET`
- **Authentication**: Required (uses `axiosPrivateInstance`)

### Response Structure

The API should return data matching the `MediaSimulationResponse` interface:

```typescript
interface MediaSimulationResponse {
  status: number;
  success: boolean;
  message: string;
  data: MediaSimulationData;
}
```

### Sample API Response

See the requirements document for the complete sample response structure.

## Components Architecture

### Layout Components

- `DashboardLayout`: Main container with responsive grid
- `TabNavigation`: Horizontal tab navigation with icons
- `FilterPanel`: Advanced filtering controls

### Overview Components

- `SimulationHeader`: Title, metadata, and action buttons
- `MediaMetrics`: Media files overview with KPI scores
- `StatusIndicators`: Risk assessment and readiness status

### Chart Components

- `KPIRadarChart`: 7-point radar chart for KPI metrics
- `EffectivenessBarChart`: Comparative bar chart
- `ComparisonDoughnutChart`: Pie chart for comparisons
- `PerformanceLineChart`: Line chart for trends

### Custom Hooks

- `useMediaSimulation`: Data fetching and state management
- `useChartData`: Chart data transformation
- `useAnalyticsFilters`: Filtering and sorting logic

## Styling & Theming

### Color System

```typescript
const SCORE_COLORS = {
  excellent: "#10B981", // 8-10 points
  good: "#3B82F6", // 6-7 points
  average: "#F59E0B", // 4-5 points
  poor: "#EF4444", // 0-3 points
};
```

### Score Categories

- **Excellent**: 80-100% effectiveness
- **Good**: 60-79% effectiveness
- **Average**: 40-59% effectiveness
- **Poor**: 0-39% effectiveness

### Risk Levels

- **High**: Red (#EF4444)
- **Medium**: Yellow (#F59E0B)
- **Low**: Green (#10B981)

## Performance Optimizations

### Code Splitting

Components are designed for lazy loading:

```tsx
const MediaSimulationDashboard = lazy(() =>
  import("@/features/media-simulation").then((module) => ({
    default: module.MediaSimulationDashboard,
  }))
);
```

### Memoization

Chart components use React.memo for performance:

```tsx
export const KPIRadarChart = React.memo(({ data, ...props }) => {
  // Component implementation
});
```

### Data Transformation

Chart data is memoized in custom hooks to prevent unnecessary recalculations.

## Error Handling

### API Errors

- Automatic retry functionality
- User-friendly error messages
- Fallback loading states

### Data Validation

- Type-safe interfaces
- Runtime validation for critical data
- Graceful degradation for missing data

## Accessibility

### WCAG 2.1 AA Compliance

- Keyboard navigation support
- Screen reader compatibility
- High contrast color ratios
- Focus management

### Interactive Features

- Hover tooltips with detailed information
- Click interactions for drill-down analysis
- Export capabilities for charts and data

## Dependencies

### Core Dependencies

- React 18+
- TypeScript 4.9+
- Recharts (charts)
- Tailwind CSS (styling)
- shadcn/ui (components)

### Utility Libraries

- Axios (HTTP client)
- Lucide React (icons)
- clsx/cn (class utilities)

## Development Guidelines

### File Organization

```
src/features/media-simulation/
├── components/
│   ├── charts/           # Reusable chart components
│   ├── layout/           # Layout and navigation
│   └── overview/         # Overview tab components
├── hooks/                # Custom React hooks
├── services/            # API services
├── types/               # TypeScript definitions
├── utils/               # Utility functions
├── constants/           # Configuration constants
└── containers/          # Main container components
```

### Code Standards

- Strict TypeScript mode
- ESLint + Prettier configuration
- Consistent naming conventions
- Component composition patterns

### Testing Strategy

- Unit tests for utility functions
- Integration tests for hooks
- E2E tests for critical user flows
- Visual regression testing for charts

## Future Enhancements

### Planned Features

1. **Real-time Updates**: WebSocket integration for live data
2. **Advanced Filtering**: Custom filter builder interface
3. **Export Options**: PDF reports, CSV data export
4. **Collaborative Features**: Comments and annotations
5. **A/B Testing**: Integrated testing recommendations
6. **Historical Analysis**: Trend analysis over time
7. **Custom Dashboards**: User-configurable layouts

### Performance Improvements

1. **Virtual Scrolling**: For large datasets
2. **Data Streaming**: Progressive data loading
3. **Caching Strategy**: Intelligent data caching
4. **Bundle Optimization**: Further code splitting

This dashboard provides a solid foundation for media simulation analysis with room for extensive customization and enhancement based on specific business needs.
