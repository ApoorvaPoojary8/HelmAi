import React from 'react';
import { X, AlertTriangle, Clock, MapPin } from 'lucide-react';

interface AlertPanelProps {
  violations: Array<{
    id: string;
    timestamp: Date;
    location: string;
    severity: 'low' | 'medium' | 'high';
    vehicleNumber?: string;
  }>;
  onClose: () => void;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ violations, onClose }) => {
  const highPriorityViolations = violations.filter(v => v.severity === 'high');
  
  if (highPriorityViolations.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="text-sm font-medium text-red-800">
            High Priority Alerts ({highPriorityViolations.length})
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-red-600 hover:text-red-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mt-3 space-y-2">
        {highPriorityViolations.map(violation => (
          <div key={violation.id} className="bg-white rounded border border-red-200 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                  HIGH RISK
                </span>
                {violation.vehicleNumber && (
                  <span className="font-mono text-sm text-gray-900">
                    {violation.vehicleNumber}
                  </span>
                )}
              </div>
              <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                Dispatch Unit
              </button>
            </div>
            
            <div className="mt-2 text-sm text-gray-600 flex items-center space-x-4">
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {violation.location}
              </span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {violation.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertPanel;