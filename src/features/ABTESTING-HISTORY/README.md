# A/B Testing History Feature

A comprehensive UI for viewing and analyzing A/B test results and performance metrics.

## Features

### 📊 Dashboard Overview
- **Statistics Cards**: Total tests, completion rate, success rate, and participant count
- **Real-time Metrics**: Live updates of test performance and significance

### 🔍 Advanced Filtering
- **Search**: Find tests by name or ID
- **Status Filter**: Filter by completed, running, failed, or cancelled tests
- **Date Range**: Filter tests by start/end dates
- **Active Filter Display**: Visual indicators of applied filters with easy removal

### 📋 Comprehensive Table View
- **Sortable Columns**: Sort by any field (name, status, conversion rate, etc.)
- **Status Indicators**: Visual status badges with icons
- **Quick Actions**: View details, export data
- **Responsive Design**: Works on all screen sizes

### 📈 Detailed Test Analysis
- **Test Information**: Start/end dates, duration, sample size
- **Statistical Results**: P-value, effect size, confidence intervals
- **Product Fit Analysis**: Detailed analysis of variant performance
- **Winning Variant**: Clear identification of best performing variant

### 📄 Pagination
- **Flexible Page Sizes**: 10, 20, 30, 40, or 50 items per page
- **Smart Navigation**: First, previous, next, last page buttons
- **Page Indicators**: Shows current page and total pages
- **Item Count**: Displays current range and total count

## API Integration

### Endpoints
- `GET /ab-testing/history` - Get paginated test history
- `GET /ab-testing/history/stats` - Get overall statistics
- `GET /ab-testing/history/{id}` - Get specific test details

### Response Types
Uses `CommonPaginationResponse` and `APISuccessResponse` from `common.type.ts` for consistent API handling.

## Components

### Core Components
- `ABTestHistoryPage` - Main page component
- `ABTestHistoryStats` - Statistics overview cards
- `ABTestHistoryFilters` - Advanced filtering interface
- `ABTestHistoryTable` - Sortable data table
- `ABTestHistoryDetails` - Detailed test view
- `ABTestHistoryPagination` - Pagination controls

### API Hooks
- `useABTestHistoryQuery` - Fetch paginated test history
- `useABTestHistoryStatsQuery` - Fetch statistics
- `useABTestHistoryByIdQuery` - Fetch specific test details

## Usage

```tsx
import { ABTestHistoryPage } from "@/features/ABTESTING-HISTORY";

// Use in your routing
<Route path="/dashboard/ab-testing-history" element={<ABTestHistoryPage />} />
```

## Data Flow

1. **Initial Load**: Fetches statistics and first page of tests
2. **Filtering**: Updates query parameters and refetches data
3. **Sorting**: Updates sort field/direction and refetches data
4. **Pagination**: Updates page/per_page and refetches data
5. **Details View**: Fetches specific test details when selected

## Styling

Uses shadcn/ui components with consistent theming:
- Cards for content sections
- Tables for data display
- Badges for status indicators
- Buttons for actions
- Progress bars for metrics
- Skeleton loaders for loading states

## Error Handling

- Graceful error states with retry options
- Loading skeletons during data fetching
- Empty states with helpful messages
- Network error handling with user feedback

## Performance

- React Query for caching and background updates
- Debounced search input
- Pagination to limit data transfer
- Skeleton loading states for better UX
- Optimized re-renders with proper memoization
