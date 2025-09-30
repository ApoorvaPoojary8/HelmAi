import React from 'react';
import { AlertTriangle, Calendar, MapPin } from 'lucide-react';

interface OffenderTableProps {
  violations: Array<{
    vehicleNumber?: string;
    timestamp: Date;
    location: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

const OffenderTable: React.FC<OffenderTableProps> = ({ violations }) => {
  // Group violations by vehicle number
  const offenderData = violations
    .filter(v => v.vehicleNumber)
    .reduce((acc, violation) => {
      const key = violation.vehicleNumber!;
      if (!acc[key]) {
        acc[key] = {
          vehicleNumber: key,
          violations: [],
          lastSeen: violation.timestamp,
          highRiskCount: 0,
        };
      }
      acc[key].violations.push(violation);
      if (violation.timestamp > acc[key].lastSeen) {
        acc[key].lastSeen = violation.timestamp;
      }
      if (violation.severity === 'high') {
        acc[key].highRiskCount++;
      }
      return acc;
    }, {} as Record<string, any>);

  // Sort by violation count and filter repeat offenders (2+ violations)
  const repeatOffenders = Object.values(offenderData)
    .filter((offender: any) => offender.violations.length > 1)
    .sort((a: any, b: any) => b.violations.length - a.violations.length)
    .slice(0, 10);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getRiskLevel = (violationCount: number, highRiskCount: number) => {
    if (highRiskCount > 2 || violationCount > 5) return 'high';
    if (highRiskCount > 0 || violationCount > 3) return 'medium';
    return 'low';
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      {repeatOffenders.length === 0 ? (
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No repeat offenders identified</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {repeatOffenders.map((offender: any, index) => {
            const riskLevel = getRiskLevel(offender.violations.length, offender.highRiskCount);
            const mostRecentLocation = offender.violations
              .sort((a: any, b: any) => b.timestamp - a.timestamp)[0].location;
            
            return (
              <div key={offender.vehicleNumber} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      riskLevel === 'high' ? 'bg-red-500' : 
                      riskLevel === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className="font-mono text-sm font-medium text-gray-900">
                        {offender.vehicleNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        Rank #{index + 1}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                    riskLevel === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {riskLevel.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-3">
                  <div>
                    <span className="font-medium">Total Violations:</span>
                    <span className="ml-1 text-gray-900">{offender.violations.length}</span>
                  </div>
                  <div>
                    <span className="font-medium">High Risk:</span>
                    <span className="ml-1 text-red-600">{offender.highRiskCount}</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>Last seen: {mostRecentLocation}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{offender.lastSeen.toLocaleDateString()} at {offender.lastSeen.toLocaleTimeString()}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                    View History
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OffenderTable;