import React from 'react';
import { Clock, MapPin, AlertCircle } from 'lucide-react';

interface LiveFeedProps {
  violations: Array<{
    id: string;
    timestamp: Date;
    location: string;
    severity: 'low' | 'medium' | 'high';
    vehicleNumber?: string;
    confidence: number;
  }>;
}

const LiveFeed: React.FC<LiveFeedProps> = ({ violations }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="space-y-3 p-6">
        {violations.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No recent violations detected</p>
          </div>
        ) : (
          violations.map((violation, index) => (
            <div
              key={violation.id}
              className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                index === 0 ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityBadge(violation.severity)}`}>
                    {violation.severity.toUpperCase()}
                  </span>
                  {index === 0 && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      LIVE
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(violation.timestamp)}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {violation.location}
                </div>
                
                {violation.vehicleNumber && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">Vehicle:</span>
                    <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                      {violation.vehicleNumber}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Confidence: {violation.confidence.toFixed(1)}%</span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveFeed;