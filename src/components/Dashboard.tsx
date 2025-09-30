import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  Shield, 
  Users, 
  Calendar, 
  Download,
  Filter,
  Bell,
  Camera,
  TrendingUp,
  Eye,
  Search
} from 'lucide-react';
import StatCard from './StatCard';
import ViolationMap from './ViolationMap';
import LiveFeed from './LiveFeed';
import AnalyticsChart from './AnalyticsChart';
import OffenderTable from './OffenderTable';
import AlertPanel from './AlertPanel';

interface ViolationData {
  id: string;
  timestamp: Date;
  location: string;
  coordinates: [number, number];
  severity: 'low' | 'medium' | 'high';
  vehicleNumber?: string;
  confidence: number;
}

const Dashboard: React.FC = () => {
  const [violations, setViolations] = useState<ViolationData[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedZone, setSelectedZone] = useState('all');
  const [showAlerts, setShowAlerts] = useState(true);

  // Mock real-time data simulation
  useEffect(() => {
    const generateMockViolation = (): ViolationData => ({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      location: ['MG Road Junction', 'Residency Road', 'Brigade Road', 'Commercial Street'][Math.floor(Math.random() * 4)],
      coordinates: [12.9716 + (Math.random() - 0.5) * 0.1, 77.5946 + (Math.random() - 0.5) * 0.1] as [number, number],
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      vehicleNumber: Math.random() > 0.7 ? `KA${Math.floor(Math.random() * 100).toString().padStart(2, '0')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}` : undefined,
      confidence: 75 + Math.random() * 25
    });

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setViolations(prev => [generateMockViolation(), ...prev.slice(0, 49)]);
      }
    }, 3000);

    // Initialize with some data
    setViolations(Array.from({ length: 20 }, generateMockViolation));

    return () => clearInterval(interval);
  }, []);

  const todayViolations = violations.filter(v => 
    v.timestamp.toDateString() === new Date().toDateString()
  ).length;

  const highRiskViolations = violations.filter(v => v.severity === 'high').length;
  const repeatOffenders = new Set(violations.filter(v => v.vehicleNumber).map(v => v.vehicleNumber)).size;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Smart Traffic Safety</h1>
                <p className="text-sm text-gray-600">Helmet Detection System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className={`p-2 rounded-lg transition-colors ${
                  showAlerts 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bell className="w-5 h-5" />
              </button>
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts Panel */}
        {showAlerts && (
          <AlertPanel 
            violations={violations.slice(0, 3)} 
            onClose={() => setShowAlerts(false)}
          />
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Zones</option>
              <option value="zone1">Zone 1 - Central</option>
              <option value="zone2">Zone 2 - North</option>
              <option value="zone3">Zone 3 - South</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search violations..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Today's Violations"
            value={todayViolations}
            change={"+12%"}
            changeType="increase"
            icon={AlertTriangle}
            color="orange"
          />
          <StatCard
            title="High Risk Incidents"
            value={highRiskViolations}
            change={"-5%"}
            changeType="decrease"
            icon={Shield}
            color="red"
          />
          <StatCard
            title="Repeat Offenders"
            value={repeatOffenders}
            change={"+8%"}
            changeType="increase"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Detection Accuracy"
            value="94.2%"
            change={"+2.1%"}
            changeType="increase"
            icon={Eye}
            color="green"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Map and Analytics */}
          <div className="xl:col-span-2 space-y-8">
            {/* Violation Heatmap */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Violation Heatmap
                </h2>
              </div>
              <div className="p-6">
                <ViolationMap violations={violations} />
              </div>
            </div>

            {/* Analytics Charts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Violation Analytics
                </h2>
              </div>
              <div className="p-6">
                <AnalyticsChart violations={violations} />
              </div>
            </div>
          </div>

          {/* Right Column - Live Feed and Offenders */}
          <div className="space-y-8">
            {/* Live Violation Feed */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-blue-600" />
                  Live Violations
                </h2>
              </div>
              <LiveFeed violations={violations.slice(0, 10)} />
            </div>

            {/* Repeat Offenders Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Repeat Offenders
                </h2>
              </div>
              <OffenderTable violations={violations} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;