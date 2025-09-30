import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AnalyticsChartProps {
  violations: Array<{
    timestamp: Date;
    severity: 'low' | 'medium' | 'high';
  }>;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ violations }) => {
  // Generate hourly data for the last 24 hours
  const generateHourlyData = () => {
    const hours = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourViolations = violations.filter(v => 
        v.timestamp.getHours() === hour.getHours() &&
        v.timestamp.toDateString() === hour.toDateString()
      );
      
      hours.push({
        hour: hour.getHours(),
        total: hourViolations.length,
        high: hourViolations.filter(v => v.severity === 'high').length,
        medium: hourViolations.filter(v => v.severity === 'medium').length,
        low: hourViolations.filter(v => v.severity === 'low').length,
      });
    }
    
    return hours;
  };

  const hourlyData = generateHourlyData();
  const maxViolations = Math.max(...hourlyData.map(d => d.total), 1);

  // Calculate trends
  const recentHours = hourlyData.slice(-6);
  const earlierHours = hourlyData.slice(-12, -6);
  const recentAvg = recentHours.reduce((sum, h) => sum + h.total, 0) / recentHours.length;
  const earlierAvg = earlierHours.reduce((sum, h) => sum + h.total, 0) / earlierHours.length;
  const trend = recentAvg > earlierAvg ? 'up' : 'down';
  const trendPercent = Math.abs(((recentAvg - earlierAvg) / (earlierAvg || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">24-Hour Violation Trends</h3>
        <div className="flex items-center space-x-2">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-red-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-green-500" />
          )}
          <span className={`text-sm font-medium ${
            trend === 'up' ? 'text-red-600' : 'text-green-600'
          }`}>
            {trendPercent.toFixed(1)}% {trend === 'up' ? 'increase' : 'decrease'}
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="relative">
        <div className="flex items-end justify-between h-48 mb-4">
          {hourlyData.slice(-12).map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1 mx-1">
              <div className="relative w-full bg-gray-200 rounded-t" style={{ height: '160px' }}>
                {/* High severity */}
                {data.high > 0 && (
                  <div
                    className="absolute bottom-0 w-full bg-red-500 rounded-t"
                    style={{
                      height: `${(data.high / maxViolations) * 160}px`,
                    }}
                    title={`High: ${data.high}`}
                  />
                )}
                {/* Medium severity */}
                {data.medium > 0 && (
                  <div
                    className="absolute bg-orange-500"
                    style={{
                      bottom: `${(data.high / maxViolations) * 160}px`,
                      height: `${(data.medium / maxViolations) * 160}px`,
                      width: '100%',
                    }}
                    title={`Medium: ${data.medium}`}
                  />
                )}
                {/* Low severity */}
                {data.low > 0 && (
                  <div
                    className="absolute bg-yellow-500"
                    style={{
                      bottom: `${((data.high + data.medium) / maxViolations) * 160}px`,
                      height: `${(data.low / maxViolations) * 160}px`,
                      width: '100%',
                    }}
                    title={`Low: ${data.low}`}
                  />
                )}
                {/* Total count label */}
                {data.total > 0 && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                    {data.total}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-2">
                {data.hour.toString().padStart(2, '0')}:00
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">High Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Medium Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Low Risk</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{violations.length}</p>
          <p className="text-sm text-gray-600">Total Violations</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-red-600">
            {violations.filter(v => v.severity === 'high').length}
          </p>
          <p className="text-sm text-gray-600">High Priority</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-blue-600">
            {recentAvg.toFixed(1)}
          </p>
          <p className="text-sm text-gray-600">Avg/Hour</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;