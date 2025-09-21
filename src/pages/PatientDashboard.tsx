import React, { useState } from 'react';
import { useMockAuth } from "@/hooks/useMockAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useHealthData } from "@/hooks/useHealthData";
import { getBloodPressureStatus, getHeartRateStatus, getBloodSugarStatus, getWeightStatus } from "@/lib/healthUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Activity, Thermometer, Weight, Calendar, Bell, TrendingUp, AlertCircle, CheckCircle, Clock, Pill, X, User, MapPin, Star, Undo2, Plus, Timer, Check } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Health data is now provided by useHealthData hook

// Mock medications - matches MedicationsPage
const medications = [
  { id: 1, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', times: ['8:00 AM', '8:00 PM'], status: 'active' },
  { id: 2, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', times: ['8:00 AM'], status: 'active' },
  { id: 3, name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Once daily', times: ['9:00 AM'], status: 'active' },
];

// Mock doctors data
const availableDoctors = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    specialty: 'General Medicine',
    qualification: 'MBBS, MD',
    experience: '8 years',
    rating: 4.8,
    location: 'Primary Health Center, Pune',
    availableSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'],
    consultationFee: 500
  },
  {
    id: 2,
    name: 'Dr. Rajesh Patel',
    specialty: 'Cardiology',
    qualification: 'MBBS, DM Cardiology',
    experience: '12 years',
    rating: 4.9,
    location: 'District Hospital, Mumbai',
    availableSlots: ['10:00 AM', '11:00 AM', '2:30 PM', '3:30 PM', '4:30 PM'],
    consultationFee: 800
  },
  {
    id: 3,
    name: 'Dr. Anjali Desai',
    specialty: 'Dermatology',
    qualification: 'MBBS, MD Dermatology',
    experience: '6 years',
    rating: 4.7,
    location: 'Skin Care Clinic, Nagpur',
    availableSlots: ['9:30 AM', '10:30 AM', '11:30 AM', '2:00 PM', '3:00 PM'],
    consultationFee: 600
  },
  {
    id: 4,
    name: 'Dr. Suresh Kumar',
    specialty: 'Orthopedics',
    qualification: 'MBBS, MS Orthopedics',
    experience: '15 years',
    rating: 4.6,
    location: 'Bone & Joint Clinic, Nashik',
    availableSlots: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    consultationFee: 700
  },
  {
    id: 5,
    name: 'Dr. Meera Joshi',
    specialty: 'Pediatrics',
    qualification: 'MBBS, MD Pediatrics',
    experience: '10 years',
    rating: 4.9,
    location: 'Children Hospital, Aurangabad',
    availableSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '4:00 PM', '5:00 PM'],
    consultationFee: 550
  }
];

const PatientDashboard = () => {
  const { t } = useLanguage();
  const { user } = useMockAuth();
  const { currentMetrics, healthTrends } = useHealthData();
  const [medicationTaken, setMedicationTaken] = useState<Record<string, boolean>>({});
  // Empty appointments to match AppointmentsPage
  const [appointments] = useState([]);
  
  const [reminders, setReminders] = useState([
    { id: 1, type: 'medication', message: 'Time to take your Metformin (500mg)', time: '8:00 AM', priority: 'high', completed: false, snoozedUntil: null },
    { id: 2, type: 'healthData', message: 'Log your daily health measurements', time: 'Morning', priority: 'medium', completed: false, snoozedUntil: null },
    { id: 3, type: 'appointment', message: 'Upcoming appointment with Dr. Priya Sharma', time: '10:00 AM', priority: 'high', completed: false, snoozedUntil: null },
  ]);
  
  // Add reminder dialog state
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    type: 'medication',
    message: '',
    time: '',
    priority: 'medium'
  });
  
  // Appointment scheduling state
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');
  
  // Health goals state
  const [healthGoals, setHealthGoals] = useState({
    steps: { current: 7500, target: 10000 },
    water: { current: 6, target: 8 },
    sleep: { current: 7, target: 8 }
  });

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const markDoseTaken = (medicationId: number, doseTime: string) => {
    const today = new Date().toDateString();
    const doseKey = `${medicationId}-${doseTime}-${today}`;
    setMedicationTaken(prev => ({
      ...prev,
      [doseKey]: true
    }));
  };

  const isDoseTaken = (medicationId: number, doseTime: string) => {
    const today = new Date().toDateString();
    const doseKey = `${medicationId}-${doseTime}-${today}`;
    return medicationTaken[doseKey];
  };

  const undoDoseTaken = (medicationId: number, doseTime: string) => {
    const today = new Date().toDateString();
    const doseKey = `${medicationId}-${doseTime}-${today}`;
    setMedicationTaken(prev => {
      const updated = { ...prev };
      delete updated[doseKey];
      return updated;
    });
  };

  const dismissReminder = (reminderId: number) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  const handleScheduleAppointment = () => {
    // Here you would typically save the appointment
    console.log('Scheduling appointment:', {
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      reason: appointmentReason
    });
    
    // Reset form and close dialog
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedTime('');
    setAppointmentReason('');
    setIsScheduleDialogOpen(false);
    
    // You could add a toast notification here
    alert('Appointment scheduled successfully!');
  };

  const getSelectedDoctorDetails = () => {
    return availableDoctors.find(doc => doc.id.toString() === selectedDoctor);
  };

  // Health goals functions
  const updateHealthGoal = (type: 'steps' | 'water' | 'sleep', current: number) => {
    setHealthGoals(prev => ({
      ...prev,
      [type]: { ...prev[type], current: Math.max(0, current) }
    }));
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(100, (current / target) * 100);
  };

  // Reminder functions
  const completeReminder = (reminderId: number) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, completed: true }
        : reminder
    ));
  };

  const snoozeReminder = (reminderId: number, minutes: number = 15) => {
    const snoozeTime = new Date(Date.now() + minutes * 60000);
    setReminders(prev => prev.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, snoozedUntil: snoozeTime }
        : reminder
    ));
  };

  const addNewReminder = () => {
    if (!newReminder.message.trim() || !newReminder.time.trim()) return;
    
    const reminder = {
      id: Date.now(),
      type: newReminder.type,
      message: newReminder.message,
      time: newReminder.time,
      priority: newReminder.priority,
      completed: false,
      snoozedUntil: null
    };
    
    setReminders(prev => [...prev, reminder]);
    setNewReminder({ type: 'medication', message: '', time: '', priority: 'medium' });
    setIsAddReminderOpen(false);
  };

  const getActiveReminders = () => {
    const now = new Date();
    return reminders.filter(reminder => 
      !reminder.completed && 
      (!reminder.snoozedUntil || reminder.snoozedUntil <= now)
    );
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill className="h-4 w-4" />;
      case 'appointment': return <Calendar className="h-4 w-4" />;
      case 'healthData': return <Heart className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        {/* Personal Health Welcome */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20 border-4 border-white/20">
                  {user?.profilePicture ? (
                    <AvatarImage 
                      src={user.profilePicture} 
                      alt={user.fullName}
                      className="object-cover object-center"
                    />
                  ) : null}
                  <AvatarFallback className="bg-white/20 text-white text-xl">
                    {user ? getUserInitials(user.fullName) : 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    Good {getTimeGreeting()}, {user?.fullName?.split(' ')[0] || 'Patient'}! 👋
                  </h1>
                  <p className="text-white/90 text-lg">Your health journey continues today</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">No upcoming appointments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Reminders */}
        {getActiveReminders().length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Active Reminders</h2>
              <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reminder
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
            <div className="space-y-3">
              {getActiveReminders().map((reminder) => (
                <Alert key={reminder.id} className={`border-l-4 ${
                  reminder.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                  reminder.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                  'border-l-blue-500 bg-blue-50'
                }`}>
                  {getReminderIcon(reminder.type)}
                  <AlertDescription className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{reminder.message}</span>
                        <Badge variant="secondary" className="text-xs">
                          {reminder.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{reminder.time}</span>
                        <Badge variant={reminder.priority === 'high' ? 'destructive' : 
                               reminder.priority === 'medium' ? 'default' : 'secondary'} 
                               className="text-xs">
                          {reminder.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => completeReminder(reminder.id)}
                        className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                        title="Mark as complete"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => snoozeReminder(reminder.id, 15)}
                        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                        title="Snooze for 15 minutes"
                      >
                        <Timer className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissReminder(reminder.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                        title="Dismiss"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}
        
        {/* No reminders state */}
        {getActiveReminders().length === 0 && (
          <div className="mb-8">
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Active Reminders</p>
                <p className="text-sm text-center mb-4">You're all caught up! Add a new reminder to stay on track.</p>
                <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Reminder
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Health Metrics - Real data from useHealthData */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blood Pressure</p>
                  <p className="text-2xl font-bold text-foreground">
                    {currentMetrics.bloodPressureSystolic}/{currentMetrics.bloodPressureDiastolic}
                  </p>
                  <Badge 
                    variant="secondary" 
                    className={`mt-1 ${getBloodPressureStatus(currentMetrics.bloodPressureSystolic, currentMetrics.bloodPressureDiastolic).color}`}
                  >
                    {getBloodPressureStatus(currentMetrics.bloodPressureSystolic, currentMetrics.bloodPressureDiastolic).status}
                  </Badge>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Heart Rate</p>
                  <p className="text-2xl font-bold text-foreground">{currentMetrics.heartRate} BPM</p>
                  <Badge 
                    variant="secondary" 
                    className={`mt-1 ${getHeartRateStatus(currentMetrics.heartRate).color}`}
                  >
                    {getHeartRateStatus(currentMetrics.heartRate).status}
                  </Badge>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blood Sugar</p>
                  <p className="text-2xl font-bold text-foreground">{currentMetrics.bloodSugar} mg/dL</p>
                  <Badge 
                    variant="secondary" 
                    className={`mt-1 ${getBloodSugarStatus(currentMetrics.bloodSugar).color}`}
                  >
                    {getBloodSugarStatus(currentMetrics.bloodSugar).status}
                  </Badge>
                </div>
                <Thermometer className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Weight</p>
                  <p className="text-2xl font-bold text-foreground">{currentMetrics.weight} kg</p>
                  <Badge 
                    variant="secondary" 
                    className={`mt-1 ${getWeightStatus(currentMetrics.weight).color}`}
                  >
                    BMI: {getWeightStatus(currentMetrics.weight).bmi}
                  </Badge>
                </div>
                <Weight className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Trends Chart - Real data */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Health Trends (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={healthTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bloodSugar" stroke="#f97316" strokeWidth={2} name="Blood Sugar (mg/dL)" />
                <Line type="monotone" dataKey="heartRate" stroke="#3b82f6" strokeWidth={2} name="Heart Rate (BPM)" />
                <Line type="monotone" dataKey="bloodPressure" stroke="#ef4444" strokeWidth={2} name="Blood Pressure (Systolic)" />
                <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={2} name="Weight (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Today's Medications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Today's Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {medications.map((medication) => {
                const allDosesTaken = medication.times.every(time => isDoseTaken(medication.id, time));
                
                return (
                  <div key={medication.id} className={`p-4 border rounded-lg ${
                    allDosesTaken ? 'bg-green-50 border-green-200' : ''
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{medication.name}</h3>
                      {allDosesTaken && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          All Taken
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{medication.dosage}</p>
                    <p className="text-sm text-muted-foreground mb-2">{medication.frequency}</p>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Today's Doses:</p>
                      {medication.times.map((doseTime) => {
                        const taken = isDoseTaken(medication.id, doseTime);
                        return (
                          <div key={doseTime} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              <span className="text-sm">{doseTime}</span>
                              {taken && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                  <CheckCircle className="w-2 h-2 mr-1" />
                                  Taken
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-1">
                              {!taken ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => markDoseTaken(medication.id, doseTime)}
                                  className="h-6 text-xs px-2"
                                >
                                  <CheckCircle className="w-2 h-2 mr-1" />
                                  Take
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => undoDoseTaken(medication.id, doseTime)}
                                  className="h-6 text-xs px-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                                >
                                  <Undo2 className="w-2 h-2 mr-1" />
                                  Undo
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments - Empty state to match AppointmentsPage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border rounded-lg">
                    {/* Appointment details would go here */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Upcoming Appointments</p>
                <p className="text-sm text-center mb-4">You don't have any scheduled appointments at the moment.</p>
                <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Appointment
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Health Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Daily Steps */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Daily Steps</span>
                <span className="text-sm text-muted-foreground">
                  {healthGoals.steps.current.toLocaleString()} / {healthGoals.steps.target.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Progress 
                    value={getProgressPercentage(healthGoals.steps.current, healthGoals.steps.target)} 
                    className="h-2" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={healthGoals.steps.current}
                    onChange={(e) => updateHealthGoal('steps', parseInt(e.target.value) || 0)}
                    className="w-20 h-8 text-xs"
                    min="0"
                    max="50000"
                  />
                  <span className="text-xs text-muted-foreground">steps</span>
                </div>
              </div>
            </div>

            {/* Water Intake */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Water Intake</span>
                <span className="text-sm text-muted-foreground">
                  {healthGoals.water.current} / {healthGoals.water.target} glasses
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Progress 
                    value={getProgressPercentage(healthGoals.water.current, healthGoals.water.target)} 
                    className="h-2" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={healthGoals.water.current}
                    onChange={(e) => updateHealthGoal('water', parseInt(e.target.value) || 0)}
                    className="w-16 h-8 text-xs"
                    min="0"
                    max="20"
                    step="1"
                  />
                  <span className="text-xs text-muted-foreground">glasses</span>
                </div>
              </div>
            </div>

            {/* Sleep Hours */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Sleep Hours</span>
                <span className="text-sm text-muted-foreground">
                  {healthGoals.sleep.current} / {healthGoals.sleep.target} hours
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Progress 
                    value={getProgressPercentage(healthGoals.sleep.current, healthGoals.sleep.target)} 
                    className="h-2" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={healthGoals.sleep.current}
                    onChange={(e) => updateHealthGoal('sleep', parseFloat(e.target.value) || 0)}
                    className="w-16 h-8 text-xs"
                    min="0"
                    max="24"
                    step="0.5"
                  />
                  <span className="text-xs text-muted-foreground">hours</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 border-t">
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => updateHealthGoal('steps', healthGoals.steps.current + 1000)}
                  className="text-xs"
                >
                  +1K Steps
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => updateHealthGoal('water', healthGoals.water.current + 1)}
                  className="text-xs"
                >
                  +1 Glass
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setHealthGoals(prev => ({ ...prev, steps: { ...prev.steps, current: 0 }, water: { ...prev.water, current: 0 }, sleep: { ...prev.sleep, current: 0 } }))}
                  className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                >
                  Reset All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Appointment Scheduling Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Doctor Selection */}
            <div className="space-y-2">
              <Label htmlFor="doctor">Select Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {availableDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Details */}
            {selectedDoctor && (
              <div className="p-4 border rounded-lg bg-muted/30">
                {(() => {
                  const doctor = getSelectedDoctorDetails();
                  return doctor ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{doctor.name}</h3>
                          <p className="text-sm text-muted-foreground">{doctor.qualification}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{doctor.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{doctor.experience}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{doctor.location}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Consultation Fee: </span>
                        <span className="text-primary font-semibold">₹{doctor.consultationFee}</span>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="date">Appointment Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Time Selection */}
            {selectedDoctor && (
              <div className="space-y-2">
                <Label>Available Time Slots</Label>
                <div className="grid grid-cols-3 gap-2">
                  {getSelectedDoctorDetails()?.availableSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedTime === slot ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(slot)}
                      className="text-xs"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Reason for Visit */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea
                id="reason"
                placeholder="Describe your symptoms or reason for consultation..."
                value={appointmentReason}
                onChange={(e) => setAppointmentReason(e.target.value)}
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsScheduleDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleScheduleAppointment}
                disabled={!selectedDoctor || !selectedDate || !selectedTime || !appointmentReason.trim()}
                className="flex-1"
              >
                Schedule Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add Reminder Dialog */}
      <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Reminder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Reminder Type */}
            <div className="space-y-2">
              <Label htmlFor="reminder-type">Reminder Type</Label>
              <Select value={newReminder.type} onValueChange={(value) => setNewReminder(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reminder type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medication">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4" />
                      <span>Medication</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="appointment">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Appointment</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="healthData">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span>Health Data</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="general">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>General</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reminder Message */}
            <div className="space-y-2">
              <Label htmlFor="reminder-message">Reminder Message</Label>
              <Textarea
                id="reminder-message"
                placeholder="Enter your reminder message..."
                value={newReminder.message}
                onChange={(e) => setNewReminder(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Time</Label>
              <Input
                id="reminder-time"
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="reminder-priority">Priority</Label>
              <Select value={newReminder.priority} onValueChange={(value) => setNewReminder(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>Low</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span>Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span>High</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setNewReminder({ type: 'medication', message: '', time: '', priority: 'medium' });
                  setIsAddReminderOpen(false);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={addNewReminder}
                disabled={!newReminder.message.trim() || !newReminder.time.trim()}
                className="flex-1"
              >
                Add Reminder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDashboard;
