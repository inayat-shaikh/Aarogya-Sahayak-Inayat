import React, { useState } from 'react';
import { useLanguage } from "@/hooks/useLanguage";
import { useMockAuth } from "@/hooks/useMockAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  Users, 
  Stethoscope, 
  Hospital, 
  Globe, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  MessageSquare, 
  Phone, 
  Video,
  FileText,
  Activity,
  Heart,
  UserCheck,
  MapPin,
  Bell,
  Plus,
  Search,
  Filter
} from 'lucide-react';

// Mock data for health worker dashboard
const myPatients = [
  { id: 1, name: 'Rajesh Kumar', age: 45, condition: 'Diabetes', lastVisit: '2024-01-15', status: 'stable', priority: 'medium', phone: '+91 98765 43210', address: 'Pune, Maharashtra' },
  { id: 2, name: 'Sunita Devi', age: 38, condition: 'Hypertension', lastVisit: '2024-01-14', status: 'needs_attention', priority: 'high', phone: '+91 98765 43211', address: 'Mumbai, Maharashtra' },
  { id: 3, name: 'Amit Sharma', age: 52, condition: 'Heart Disease', lastVisit: '2024-01-13', status: 'critical', priority: 'high', phone: '+91 98765 43212', address: 'Nashik, Maharashtra' },
  { id: 4, name: 'Priya Patel', age: 29, condition: 'Pregnancy Care', lastVisit: '2024-01-12', status: 'stable', priority: 'medium', phone: '+91 98765 43213', address: 'Aurangabad, Maharashtra' },
  { id: 5, name: 'Ravi Singh', age: 61, condition: 'Arthritis', lastVisit: '2024-01-11', status: 'stable', priority: 'low', phone: '+91 98765 43214', address: 'Nagpur, Maharashtra' },
];

const upcomingAppointments = [
  { id: 1, patient: 'Rajesh Kumar', time: '10:00 AM', type: 'Follow-up', location: 'Clinic A', status: 'confirmed', duration: '30 min' },
  { id: 2, patient: 'Sunita Devi', time: '11:30 AM', type: 'Consultation', location: 'Home Visit', status: 'confirmed', duration: '45 min' },
  { id: 3, patient: 'Amit Sharma', time: '2:00 PM', type: 'Emergency Check', location: 'Clinic A', status: 'urgent', duration: '60 min' },
  { id: 4, patient: 'Priya Patel', time: '3:30 PM', type: 'Prenatal Care', location: 'Health Center', status: 'confirmed', duration: '30 min' },
];

const recentActivities = [
  { id: 1, action: 'Completed consultation with Rajesh Kumar', time: '2 hours ago', type: 'consultation' },
  { id: 2, action: 'Updated medication for Sunita Devi', time: '4 hours ago', type: 'medication' },
  { id: 3, action: 'Scheduled follow-up for Amit Sharma', time: '6 hours ago', type: 'appointment' },
  { id: 4, action: 'Added new patient: Priya Patel', time: '1 day ago', type: 'patient' },
  { id: 5, action: 'Completed health screening camp', time: '2 days ago', type: 'campaign' },
];

const healthMetrics = [
  { month: 'Oct', consultations: 45, homeVisits: 23, emergencies: 8 },
  { month: 'Nov', consultations: 52, homeVisits: 28, emergencies: 12 },
  { month: 'Dec', consultations: 48, homeVisits: 31, emergencies: 6 },
  { month: 'Jan', consultations: 58, homeVisits: 35, emergencies: 9 },
];

const patientStatusData = [
  { name: 'Stable', value: 65, color: '#22c55e' },
  { name: 'Needs Attention', value: 25, color: '#f59e0b' },
  { name: 'Critical', value: 10, color: '#ef4444' },
];

const districtData = [
  { name: 'Konkan', patients: 400, healthWorkers: 240 },
  { name: 'Pune', patients: 300, healthWorkers: 139 },
  { name: 'Nashik', patients: 200, healthWorkers: 180 },
  { name: 'Aurangabad', patients: 278, healthWorkers: 190 },
  { name: 'Amravati', patients: 189, healthWorkers: 150 },
  { name: 'Nagpur', patients: 239, healthWorkers: 180 },
];

const HealthWorkerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useMockAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'bg-green-100 text-green-800';
      case 'needs_attention': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                {user?.profilePicture ? (
                  <AvatarImage 
                    src={user.profilePicture} 
                    alt={user.fullName}
                    className="object-cover object-center"
                  />
                ) : null}
                <AvatarFallback className="bg-secondary text-white text-lg">
                  {user ? getUserInitials(user.fullName) : 'HW'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gov-navy">
                  Welcome back, Dr. {user?.fullName?.split(' ')[0] || 'Health Worker'}!
                </h1>
                <p className="text-muted-foreground">Here's your health worker overview for today</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Patient
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">My Patients</p>
                  <p className="text-2xl font-bold text-blue-600">{myPatients.length}</p>
                  <p className="text-xs text-muted-foreground">Active under care</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
                  <p className="text-2xl font-bold text-green-600">{upcomingAppointments.length}</p>
                  <p className="text-xs text-muted-foreground">Scheduled visits</p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical Cases</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {myPatients.filter(p => p.status === 'critical').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Need attention</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-purple-600">58</p>
                  <p className="text-xs text-muted-foreground">Consultations</p>
                </div>
                <Stethoscope className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">My Patients</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div>
                            <p className="font-medium">{appointment.patient}</p>
                            <p className="text-sm text-muted-foreground">{appointment.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{appointment.time}</p>
                          <p className="text-sm text-muted-foreground">{appointment.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Patient Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Patient Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={patientStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {patientStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {patientStatusData.map((entry) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-sm">{entry.name} ({entry.value}%)</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 border-l-2 border-l-primary/20">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'consultation' ? 'bg-blue-100' :
                        activity.type === 'medication' ? 'bg-green-100' :
                        activity.type === 'appointment' ? 'bg-orange-100' :
                        activity.type === 'patient' ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        {activity.type === 'consultation' && <Stethoscope className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'medication' && <Heart className="w-4 h-4 text-green-600" />}
                        {activity.type === 'appointment' && <Calendar className="w-4 h-4 text-orange-600" />}
                        {activity.type === 'patient' && <UserCheck className="w-4 h-4 text-purple-600" />}
                        {activity.type === 'campaign' && <Globe className="w-4 h-4 text-gray-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    My Patients ({myPatients.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myPatients.map((patient) => (
                    <div key={patient.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-white">
                              {getUserInitials(patient.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{patient.name}</h3>
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(patient.priority)}`}></div>
                            </div>
                            <p className="text-sm text-muted-foreground">Age: {patient.age} • {patient.condition}</p>
                            <p className="text-xs text-muted-foreground">Last visit: {patient.lastVisit}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(patient.status)}>
                            {patient.status.replace('_', ' ')}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Video className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Clock className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.patient}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.type}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {appointment.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {appointment.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button size="sm">
                            Start Consultation
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Monthly Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={healthMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="consultations" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="homeVisits" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="emergencies" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Regional Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Regional Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={districtData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="patients" fill="#3b82f6" name="Patients" />
                      <Bar dataKey="healthWorkers" fill="#10b981" name="Health Workers" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthWorkerDashboard;
