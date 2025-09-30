import React from 'react';
import { MapPin } from 'lucide-react';

interface ViolationMapProps {
  violations: Array<{
    id: string;
    coordinates: [number, number];
    severity: 'low' | 'medium' | 'high';
    location: string;
  }>;
}

const ViolationMap: React.FC<ViolationMapProps> = ({ violations }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500 bg-red-100';
      case 'medium': return 'text-orange-500 bg-orange-100';
      default: return 'text-yellow-500 bg-yellow-100';
    }
  };

  const locationStats = violations.reduce((acc, violation) => {
    acc[violation.location] = (acc[violation.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLocations = Object.entries(locationStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Map Placeholder */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg h-80 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10"></div>
        
        {/* Simulated Map Points */}
        {violations.slice(0, 15).map((violation, index) => (
          <div
            key={violation.id}
            className={`absolute w-4 h-4 rounded-full ${getSeverityColor(violation.severity)} 
              border-2 border-white shadow-lg animate-pulse`}
            style={{
              left: `${20 + (index % 8) * 10}%`,
              top: `${20 + Math.floor(index / 8) * 15}%`,
            }}
            title={`${violation.location} - ${violation.severity} severity`}
          />
        ))}
        
        <div className="text-center z-10 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Interactive violation heatmap</p>
          <p className="text-xs text-gray-500">{violations.length} active violations</p>
        </div>
      </div>

      {/* Location Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">High-Risk Locations</h3>
          <div className="space-y-2">
            {topLocations.map(([location, count], index) => (
              <div key={location} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">{location}</span>
                <span className={`text-sm font-medium px-2 py-1 rounded text-white ${
                  index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                }`}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Severity Distribution</h3>
          <div className="space-y-2">
            {['high', 'medium', 'low'].map(severity => {
              const count = violations.filter(v => v.severity === severity).length;
              const percentage = ((count / violations.length) * 100) || 0;
              return (
                <div key={severity} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getSeverityColor(severity).split(' ')[1]}`}></div>
                    <span className="text-sm text-gray-700 capitalize">{severity}</span>
                  </div>
                  <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationMap;