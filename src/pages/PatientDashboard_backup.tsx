import React, { useState, useEffect, useCallback } from 'react';
import { useMockAuth } from "@/hooks/useMockAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Activity, Thermometer, Weight, Calendar, Bell, TrendingUp, AlertCircle, CheckCircle, Clock, Pill, X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock health data
const healthData = [
  { date: 'Jan 15', bloodSugar: 110, bloodPressure: 120, heartRate: 72, weight: 70 },
  { date: 'Jan 20', bloodSugar: 105, bloodPressure: 118, heartRate: 75, weight: 69.8 },
  { date: 'Jan 25', bloodSugar: 115, bloodPressure: 125, heartRate: 68, weight: 70.2 },
  { date: 'Jan 30', bloodSugar: 108, bloodPressure: 122, heartRate: 70, weight: 70.0 },
];

// Mock medications
const medications = [
  { id: 1, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', times: ['8:00 AM', '8:00 PM'], status: 'active' },
  { id: 2, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', times: ['8:00 AM'], status: 'active' },
  { id: 3, name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Once daily', times: ['9:00 AM'], status: 'active' },
];

const PatientDashboard = () => {
  const { user } = useMockAuth();
  const [medicationTaken, setMedicationTaken] = useState<Record<string, boolean>>({});
  const [reminders, setReminders] = useState([
    { id: 1, type: 'medication', message: 'Time to take your Metformin (500mg)', time: '8:00 AM', priority: 'high' },
    { id: 2, type: 'healthData', message: 'Log your daily health measurements', time: 'Morning', priority: 'medium' },
  ]);

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

  const dismissReminder = (reminderId: number) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
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
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">Health Score: 85%</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Next checkup in 12 days</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  <Bell className="w-4 h-4 mr-2" />
                  Reminders
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Reminders */}
        {reminders.length > 0 && (
          <div className="mb-8">
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <Alert key={reminder.id} className={`border-l-4 ${
                  reminder.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                  reminder.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                  'border-l-blue-500 bg-blue-50'
                }`}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{reminder.message}</span>
                      <span className="text-sm text-muted-foreground ml-2">({reminder.time})</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissReminder(reminder.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blood Pressure</p>
                  <p className="text-2xl font-bold text-red-600">122/80</p>
                  <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">Normal</Badge>
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
                  <p className="text-2xl font-bold text-blue-600">70 BPM</p>
                  <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">Good</Badge>
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
                  <p className="text-2xl font-bold text-orange-600">108 mg/dL</p>
                  <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">Normal</Badge>
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
                  <p className="text-2xl font-bold text-purple-600">70.0 kg</p>
                  <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-800">Stable</Badge>
                </div>
                <Weight className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Trends Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Health Trends (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bloodSugar" stroke="#f97316" strokeWidth={2} name="Blood Sugar" />
                <Line type="monotone" dataKey="heartRate" stroke="#3b82f6" strokeWidth={2} name="Heart Rate" />
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
                            {!taken && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markDoseTaken(medication.id, doseTime)}
                                className="h-6 text-xs px-2"
                              >
                                <CheckCircle className="w-2 h-2 mr-1" />
                                Take
                              </Button>
                            )}
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

        {/* Health Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Health Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Daily Steps</span>
                <span>7,500 / 10,000</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Water Intake</span>
                <span>6 / 8 glasses</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Sleep Hours</span>
                <span>7 / 8 hours</span>
              </div>
              <Progress value={87.5} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard; 
    qualification: 'MBBS, MD Dermatology',
    experience: '6 years',
    rating: 4.7,
    location: 'Skin Care Clinic, Nagpur',
    availableSlots: ['9:30 AM', '10:30 AM', '11:30 AM', '2:00 PM', '3:00 PM'],
    consultationFee: 600,
    image: '/api/placeholder/100/100'
  },
  { 
    id: 4, 
    name: 'Dr. Suresh Patil', 
    specialty: 'Orthopedics', 
    qualification: 'MBBS, MS Orthopedics',
    experience: '15 years',
    rating: 4.8,
    location: 'Bone & Joint Hospital, Nashik',
    availableSlots: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'],
    consultationFee: 700,
    image: '/api/placeholder/100/100'
  },
  { 
    id: 5, 
    name: 'Dr. Meera Joshi', 
    specialty: 'Pediatrics', 
    qualification: 'MBBS, MD Pediatrics',
    experience: '10 years',
    rating: 4.9,
    location: 'Children\'s Hospital, Aurangabad',
    availableSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:30 PM', '3:30 PM', '4:30 PM'],
    consultationFee: 550,
    image: '/api/placeholder/100/100'
  },
  { 
    id: 6, 
    name: 'Dr. Vikram Singh', 
    specialty: 'Neurology', 
    qualification: 'MBBS, MD, DM Neurology',
    experience: '14 years',
    rating: 4.8,
    location: 'Neuro Care Center, Mumbai',
    availableSlots: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    consultationFee: 900,
    image: '/api/placeholder/100/100'
  }
];

const upcomingAppointments = [];

const medications = [
  { id: 1, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', times: ['8:00 AM', '8:00 PM'], status: 'active' },
  { id: 2, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', times: ['8:00 AM'], status: 'active' },
  { id: 3, name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Once daily', times: ['9:00 AM'], status: 'active' },
];

const PatientDashboard = () => {
  const { t } = useLanguage();
  const { user } = useMockAuth();
  
  // State for health data
  const [healthData, setHealthData] = useState([
    { date: 'Day 1', bloodSugar: 0, bloodPressure: 0, heartRate: 0, weight: 0 },
    { date: 'Day 2', bloodSugar: 0, bloodPressure: 0, heartRate: 0, weight: 0 },
    { date: 'Day 3', bloodSugar: 0, bloodPressure: 0, heartRate: 0, weight: 0 },
    { date: 'Day 4', bloodSugar: 0, bloodPressure: 0, heartRate: 0, weight: 0 },
    { date: 'Day 5', bloodSugar: 0, bloodPressure: 0, heartRate: 0, weight: 0 },
    { date: 'Day 6', bloodSugar: 0, bloodPressure: 0, heartRate: 0, weight: 0 },
    { date: 'Day 7', bloodSugar: 0, bloodPressure: 0, heartRate: 0, weight: 0 },
  ]);
  
  // State for the add data modal
  const [isAddDataOpen, setIsAddDataOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Day 1');
  const [newHealthData, setNewHealthData] = useState({
    bloodSugar: '',
    bloodPressure: '',
    heartRate: '',
    weight: ''
  });

  // Reminder system state
  const [reminders, setReminders] = useState([]);
  const [reminderSettings, setReminderSettings] = useState({
    medicationReminders: true,
    healthDataReminders: true,
    reminderTime: '09:00'
  });
  const [isReminderSettingsOpen, setIsReminderSettingsOpen] = useState(false);
  const [lastHealthDataEntry, setLastHealthDataEntry] = useState(null);
  const [medicationTaken, setMedicationTaken] = useState({});

  // Appointment scheduling state
  const [appointments, setAppointments] = useState(upcomingAppointments);
  const [isScheduleAppointmentOpen, setIsScheduleAppointmentOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');

  const checkReminders = useCallback(() => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const today = now.toDateString();
    const newReminders = [];

    // Check medication reminders
    if (reminderSettings.medicationReminders) {
      medications.forEach(med => {
        med.times.forEach(doseTime => {
          const doseKey = `${med.id}-${doseTime}-${today}`;
          if (!medicationTaken[doseKey] && doseTime === currentTime) {
            newReminders.push({
              id: `med-${med.id}-${doseTime}-${Date.now()}`,
              type: 'medication',
              title: 'Medication Reminder',
              message: `Time to take ${med.name} (${med.dosage}) - ${doseTime}`,
              medication: med,
              doseTime: doseTime,
              timestamp: now
            });
          }
        });
      });
    }

    // Check health data reminders
    if (reminderSettings.healthDataReminders && currentTime === reminderSettings.reminderTime) {
      const todayEntry = lastHealthDataEntry && new Date(lastHealthDataEntry).toDateString() === today;
      if (!todayEntry) {
        newReminders.push({
          id: `health-${Date.now()}`,
          type: 'healthData',
          title: 'Health Data Reminder',
          message: 'Don\'t forget to log your daily health measurements!',
          timestamp: now
        });
      }
    }

    if (newReminders.length > 0) {
      setReminders(prev => [...prev, ...newReminders]);
    }
  }, [reminderSettings, lastHealthDataEntry, medicationTaken]);

  // Check for reminders on component mount and every minute
  useEffect(() => {
    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkReminders]);

  const dismissReminder = (reminderId) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
  };

  const markMedicationTaken = (medicationId) => {
    const today = new Date().toDateString();
    const medicationKey = `${medicationId}-${today}`;
    setMedicationTaken(prev => ({
      ...prev,
      [medicationKey]: true
    }));
    // Dismiss related reminders
    setReminders(prev => prev.filter(reminder => 
      !(reminder.type === 'medication' && reminder.medication?.id === medicationId)
    ));
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Helper function to get next dose time for a medication
  const getNextDoseTime = (medication) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes
    
    const todayTimes = medication.times.map(time => {
      const [hours, minutes] = time.split(/[: ]/).map(Number);
      const isPM = time.includes('PM') && hours !== 12;
      const is12AM = time.includes('AM') && hours === 12;
      const hour24 = isPM ? hours + 12 : (is12AM ? 0 : hours);
      return { time, minutes: hour24 * 60 + minutes };
    });

    // Find next dose today
    const nextTodayDose = todayTimes.find(dose => dose.minutes > currentTime);
    if (nextTodayDose) {
      return nextTodayDose.time;
    }

    // If no more doses today, return first dose of tomorrow
    return medication.times[0] + ' (Tomorrow)';
  };

  // Check if a specific dose time has been taken today
  const isDoseTaken = (medicationId, doseTime) => {
    const today = new Date().toDateString();
    const doseKey = `${medicationId}-${doseTime}-${today}`;
    return medicationTaken[doseKey];
  };

  // Mark a specific dose as taken
  const markDoseTaken = (medicationId, doseTime) => {
    const today = new Date().toDateString();
    const doseKey = `${medicationId}-${doseTime}-${today}`;
    setMedicationTaken(prev => ({
      ...prev,
      [doseKey]: true
    }));
    // Dismiss related reminders
    setReminders(prev => prev.filter(reminder => 
      !(reminder.type === 'medication' && reminder.medication?.id === medicationId)
    ));
  };

  // Undo a specific dose (mark as not taken)
  const undoDoseTaken = (medicationId, doseTime) => {
    const today = new Date().toDateString();
    const doseKey = `${medicationId}-${doseTime}-${today}`;
    setMedicationTaken(prev => {
      const updated = { ...prev };
      delete updated[doseKey];
      return updated;
    });
  };

  // Appointment booking functions
  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !appointmentReason) {
      return;
    }

    const newAppointment = {
      id: Date.now(),
      doctor: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: selectedDate,
      time: selectedTime,
      type: appointmentReason,
      status: 'Scheduled',
      location: selectedDoctor.location,
      fee: selectedDoctor.consultationFee
    };

    setAppointments(prev => [...prev, newAppointment]);
    
    // Reset form
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setAppointmentReason('');
    setIsScheduleAppointmentOpen(false);
  };

  const cancelAppointment = (appointmentId) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleAddHealthData = () => {
    const updatedData = healthData.map(item => {
      if (item.date === selectedDay) {
        return {
          ...item,
          bloodSugar: newHealthData.bloodSugar ? parseFloat(newHealthData.bloodSugar) : item.bloodSugar,
          bloodPressure: newHealthData.bloodPressure ? parseFloat(newHealthData.bloodPressure) : item.bloodPressure,
          heartRate: newHealthData.heartRate ? parseFloat(newHealthData.heartRate) : item.heartRate,
          weight: newHealthData.weight ? parseFloat(newHealthData.weight) : item.weight,
        };
      }
      return item;
    });
    
    setHealthData(updatedData);
    setLastHealthDataEntry(new Date().toISOString());
    setNewHealthData({ bloodSugar: '', bloodPressure: '', heartRate: '', weight: '' });
    setIsAddDataOpen(false);
    
    // Dismiss health data reminders when data is added
    setReminders(prev => prev.filter(reminder => reminder.type !== 'healthData'));
  };

  const getLatestValue = (metric: keyof typeof newHealthData) => {
    const latestData = healthData.find(item => item[metric] > 0);
    return latestData ? latestData[metric] : 0;
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        {/* Personal Health Welcome */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white mb-6">
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
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">Health Score: 85%</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Next checkup in 12 days</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  <Bell className="w-4 h-4 mr-2" />
                  Reminders
                </Button>
                <Dialog open={isScheduleAppointmentOpen} onOpenChange={setIsScheduleAppointmentOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Appointment
                    </Button>
                  </DialogTrigger>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Schedule New Appointment</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    {/* Doctor Selection */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Select Doctor</Label>
                      <div className="grid gap-3 max-h-60 overflow-y-auto">
                        {availableDoctors.map((doctor) => (
                          <div
                            key={doctor.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedDoctor?.id === doctor.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:bg-muted/50'
                            }`}
                            onClick={() => setSelectedDoctor(doctor)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary font-medium text-sm">
                                  {doctor.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{doctor.name}</h3>
                                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                                <p className="text-xs text-muted-foreground">{doctor.qualification}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-xs">⭐ {doctor.rating}</span>
                                  <span className="text-xs">{doctor.experience}</span>
                                  <span className="text-xs font-medium">₹{doctor.consultationFee}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{doctor.location}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedDoctor && (
                      <>
                        {/* Date Selection */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="appointment-date">Appointment Date</Label>
                            <Input
                              id="appointment-date"
                              type="date"
                              min={getMinDate()}
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="appointment-time">Available Time Slots</Label>
                            <Select value={selectedTime} onValueChange={setSelectedTime}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedDoctor.availableSlots.map((slot) => (
                                  <SelectItem key={slot} value={slot}>
                                    {slot}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Reason for Visit */}
                        <div>
                          <Label htmlFor="appointment-reason">Reason for Visit</Label>
                          <Select value={appointmentReason} onValueChange={setAppointmentReason}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Regular Checkup">Regular Checkup</SelectItem>
                              <SelectItem value="Follow-up">Follow-up</SelectItem>
                              <SelectItem value="Consultation">Consultation</SelectItem>
                              <SelectItem value="Emergency">Emergency</SelectItem>
                              <SelectItem value="Second Opinion">Second Opinion</SelectItem>
                              <SelectItem value="Routine Screening">Routine Screening</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Appointment Summary */}
                        {selectedDate && selectedTime && appointmentReason && (
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium mb-2">Appointment Summary</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Doctor:</strong> {selectedDoctor.name}</p>
                              <p><strong>Specialty:</strong> {selectedDoctor.specialty}</p>
                              <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                              <p><strong>Time:</strong> {selectedTime}</p>
                              <p><strong>Reason:</strong> {appointmentReason}</p>
                              <p><strong>Location:</strong> {selectedDoctor.location}</p>
                              <p><strong>Consultation Fee:</strong> ₹{selectedDoctor.consultationFee}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsScheduleAppointmentOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleBookAppointment}
                      disabled={!selectedDoctor || !selectedDate || !selectedTime || !appointmentReason}
                    >
                      Book Appointment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              {/* Reminder Settings */}
              <Dialog open={isReminderSettingsOpen} onOpenChange={setIsReminderSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Reminders
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Reminder Settings</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="medication-reminders">Medication Reminders</Label>
                      <Switch
                        id="medication-reminders"
                        checked={reminderSettings.medicationReminders}
                        onCheckedChange={(checked) => 
                          setReminderSettings(prev => ({...prev, medicationReminders: checked}))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="health-data-reminders">Daily Health Data Reminders</Label>
                      <Switch
                        id="health-data-reminders"
                        checked={reminderSettings.healthDataReminders}
                        onCheckedChange={(checked) => 
                          setReminderSettings(prev => ({...prev, healthDataReminders: checked}))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reminder-time" className="text-right">
                        Daily Reminder Time
                      </Label>
                      <Input
                        id="reminder-time"
                        type="time"
                        className="col-span-3"
                        value={reminderSettings.reminderTime}
                        onChange={(e) => 
                          setReminderSettings(prev => ({...prev, reminderTime: e.target.value}))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setIsReminderSettingsOpen(false)}>
                      Save Settings
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddDataOpen} onOpenChange={setIsAddDataOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Health Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Health Data</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="day" className="text-right">
                        Day
                      </Label>
                      <Select value={selectedDay} onValueChange={setSelectedDay}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {healthData.map((item) => (
                            <SelectItem key={item.date} value={item.date}>
                              {item.date}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="bloodSugar" className="text-right">
                        Blood Sugar (mg/dL)
                      </Label>
                      <Input
                        id="bloodSugar"
                        type="number"
                        placeholder="110"
                        className="col-span-3"
                        value={newHealthData.bloodSugar}
                        onChange={(e) => setNewHealthData({...newHealthData, bloodSugar: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="bloodPressure" className="text-right">
                        Blood Pressure (mmHg)
                      </Label>
                      <Input
                        id="bloodPressure"
                        type="number"
                        placeholder="120"
                        className="col-span-3"
                        value={newHealthData.bloodPressure}
                        onChange={(e) => setNewHealthData({...newHealthData, bloodPressure: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="heartRate" className="text-right">
                        Heart Rate (BPM)
                      </Label>
                      <Input
                        id="heartRate"
                        type="number"
                        placeholder="72"
                        className="col-span-3"
                        value={newHealthData.heartRate}
                        onChange={(e) => setNewHealthData({...newHealthData, heartRate: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="weight" className="text-right">
                        Weight (kg)
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        placeholder="70.0"
                        className="col-span-3"
                        value={newHealthData.weight}
                        onChange={(e) => setNewHealthData({...newHealthData, weight: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDataOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddHealthData}>
                      Add Data
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Active Reminders */}
        {reminders.length > 0 && (
          <div className="mb-8 space-y-3">
            {reminders.map((reminder) => (
              <Alert key={reminder.id} className={`border-l-4 ${
                reminder.type === 'medication' 
                  ? 'border-l-blue-500 bg-blue-50' 
                  : 'border-l-orange-500 bg-orange-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {reminder.type === 'medication' ? (
                      <Pill className="w-5 h-5 text-blue-600 mt-0.5" />
                    ) : (
                      <Activity className="w-5 h-5 text-orange-600 mt-0.5" />
                    )}
                    <div>
                      <AlertTitle className="text-sm font-medium">
                        {reminder.title}
                      </AlertTitle>
                      <AlertDescription className="text-sm">
                        {reminder.message}
                      </AlertDescription>
                      {reminder.type === 'medication' && reminder.medication && (
                        <div className="mt-2 flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => markDoseTaken(reminder.medication.id, reminder.doseTime)}
                            className="h-7 text-xs"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mark as Taken
                          </Button>
                        </div>
                      )}
                      {reminder.type === 'healthData' && (
                        <div className="mt-2">
                          <Button
                            size="sm"
                            onClick={() => setIsAddDataOpen(true)}
                            className="h-7 text-xs"
                          >
                            <PlusCircle className="w-3 h-3 mr-1" />
                            Add Health Data
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissReminder(reminder.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blood Pressure</p>
                  <p className="text-2xl font-bold text-primary">
                    {getLatestValue('bloodPressure') > 0 ? `${getLatestValue('bloodPressure')}/80` : '--/--'}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <Heart className="w-3 h-3 mr-1" />
                    {getLatestValue('bloodPressure') > 0 ? 'Latest reading' : 'No data yet'}
                  </p>
                </div>
                <Heart className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Heart Rate</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {getLatestValue('heartRate') > 0 ? `${getLatestValue('heartRate')} BPM` : '-- BPM'}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <Activity className="w-3 h-3 mr-1" />
                    {getLatestValue('heartRate') > 0 ? 'Latest reading' : 'No data yet'}
                  </p>
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
                  <p className="text-2xl font-bold text-orange-600">
                    {getLatestValue('bloodSugar') > 0 ? `${getLatestValue('bloodSugar')} mg/dL` : '-- mg/dL'}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <Thermometer className="w-3 h-3 mr-1" />
                    {getLatestValue('bloodSugar') > 0 ? 'Latest reading' : 'No data yet'}
                  </p>
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
                  <p className="text-2xl font-bold text-purple-600">
                    {getLatestValue('weight') > 0 ? `${getLatestValue('weight')} kg` : '-- kg'}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <Weight className="w-3 h-3 mr-1" />
                    {getLatestValue('weight') > 0 ? 'Latest reading' : 'No data yet'}
                  </p>
                </div>
                <Weight className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Blood Sugar Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={healthData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={true}
                    tickLine={true}
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Days', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontSize: '14px', fontWeight: 'bold' } }}
                  />
                  <YAxis 
                    axisLine={true}
                    tickLine={true}
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Blood Sugar (mg/dL)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '14px', fontWeight: 'bold' } }}
                    domain={[0, 'dataMax + 20']}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} mg/dL`, 'Blood Sugar']}
                    labelFormatter={(label) => `Day: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bloodSugar" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center text-sm text-muted-foreground mt-2">
                {healthData.some(item => item.bloodSugar > 0) 
                  ? 'Track your blood sugar levels over time' 
                  : 'Add health data to see your trends'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No appointments scheduled</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsScheduleAppointmentOpen(true)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Your First Appointment
                  </Button>
                </div>
              ) : (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border rounded-lg bg-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{appointment.doctor}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{appointment.specialty}</p>
                        <p className="text-sm text-muted-foreground mb-2">{appointment.type}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{appointment.location}</p>
                        <p className="text-xs font-medium mt-1">Fee: ₹{appointment.fee}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelAppointment(appointment.id)}
                          className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Medications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Current Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {medications.map((medication) => {
                const allDosesTaken = medication.times.every(time => isDoseTaken(medication.id, time));
                const nextDose = getNextDoseTime(medication);
                
                return (
                  <div key={medication.id} className={`p-4 border rounded-lg ${
                    allDosesTaken ? 'bg-green-50 border-green-200' : ''
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{medication.name}</h3>
                      <div className="flex items-center gap-2">
                        {allDosesTaken && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            All Doses Taken
                          </Badge>
                        )}
                        <Badge variant="secondary">{medication.status}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{medication.dosage}</p>
                    <p className="text-sm text-muted-foreground mb-2">{medication.frequency}</p>
                    
                    {/* Individual dose tracking */}
                    <div className="mb-3 space-y-2">
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
                                  variant="ghost"
                                  onClick={() => undoDoseTaken(medication.id, doseTime)}
                                  className="h-6 text-xs px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="w-2 h-2 mr-1" />
                                  Undo
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Next: {nextDose}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
