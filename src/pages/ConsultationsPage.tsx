import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, MessageSquare, Calendar, Clock, MapPin, Phone, CheckCircle, AlertCircle, Users, Plus, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Synchronized data from HealthWorkerDashboard
const upcomingAppointments = [
  { id: 1, patient: 'Rajesh Kumar', time: '10:00 AM', type: 'Follow-up', location: 'Clinic A', status: 'confirmed', duration: '30 min' },
  { id: 2, patient: 'Sunita Devi', time: '11:30 AM', type: 'Consultation', location: 'Home Visit', status: 'confirmed', duration: '45 min' },
  { id: 3, patient: 'Amit Sharma', time: '2:00 PM', type: 'Emergency Check', location: 'Clinic A', status: 'urgent', duration: '60 min' },
  { id: 4, patient: 'Priya Patel', time: '3:30 PM', type: 'Prenatal Care', location: 'Health Center', status: 'confirmed', duration: '30 min' },
];

const recentConsultations = [
  { id: 1, patient: 'Rajesh Kumar', date: '2024-01-15', type: 'Video Call', duration: '25 min', status: 'completed', notes: 'Blood sugar levels stable, continue current medication' },
  { id: 2, patient: 'Sunita Devi', date: '2024-01-14', type: 'In-Person', duration: '40 min', status: 'completed', notes: 'Blood pressure slightly elevated, adjusted medication dosage' },
  { id: 3, patient: 'Amit Sharma', date: '2024-01-13', type: 'Phone Call', duration: '15 min', status: 'completed', notes: 'Emergency consultation, referred to cardiologist' },
  { id: 4, patient: 'Priya Patel', date: '2024-01-12', type: 'In-Person', duration: '35 min', status: 'completed', notes: 'Routine prenatal checkup, all parameters normal' },
];

// This will be updated dynamically
const getConsultationStats = (appointments: typeof upcomingAppointments) => ({
  today: appointments.length,
  thisWeek: 23,
  thisMonth: 58,
  completed: recentConsultations.length
});

const ConsultationsPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState(upcomingAppointments);
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patient: '',
    time: '',
    type: 'Consultation',
    location: 'Clinic A',
    status: 'confirmed',
    duration: '30 min',
    date: ''
  });

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video call': return <Video className="w-4 h-4" />;
      case 'phone call': return <Phone className="w-4 h-4" />;
      case 'in-person': return <Users className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const addNewAppointment = () => {
    if (!newAppointment.patient.trim() || !newAppointment.time.trim() || !newAppointment.date.trim()) return;
    
    const appointment = {
      id: Date.now(),
      patient: newAppointment.patient,
      time: newAppointment.time,
      type: newAppointment.type,
      location: newAppointment.location,
      status: newAppointment.status,
      duration: newAppointment.duration
    };
    
    setAppointments(prev => [...prev, appointment]);
    setNewAppointment({
      patient: '',
      time: '',
      type: 'Consultation',
      location: 'Clinic A',
      status: 'confirmed',
      duration: '30 min',
      date: ''
    });
    setIsAddAppointmentOpen(false);
  };

  const consultationStats = getConsultationStats(appointments);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gov-navy mb-2">{t("consultations")}</h1>
        <p className="text-muted-foreground">{t("manage_consultations_appointments")}</p>
      </div>

      {/* Consultation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t("todays_appointments")}</p>
                <p className="text-2xl font-bold">{consultationStats.today}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t("this_week")}</p>
                <p className="text-2xl font-bold">{consultationStats.thisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t("this_month")}</p>
                <p className="text-2xl font-bold">{consultationStats.thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t("completed")}</p>
                <p className="text-2xl font-bold">{consultationStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consultation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">{t("upcoming_appointments")}</TabsTrigger>
          <TabsTrigger value="recent">{t("recent_consultations")}</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t("todays_schedule")}</h2>
            <Dialog open={isAddAppointmentOpen} onOpenChange={setIsAddAppointmentOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  {t("add_appointment")}
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
          
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getUserInitials(appointment.patient)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{appointment.patient}</h3>
                      <p className="text-muted-foreground">{appointment.type}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{appointment.time} ({appointment.duration})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Video className="w-4 h-4 mr-1" />
                        Start Call
                      </Button>
                      <Button size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Consultations</h2>
            <Button variant="outline">
              View All History
            </Button>
          </div>
          
          {recentConsultations.map((consultation) => (
            <Card key={consultation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getUserInitials(consultation.patient)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{consultation.patient}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {getTypeIcon(consultation.type)}
                          <span>{consultation.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{consultation.duration}</span>
                        </div>
                        <span>{consultation.date}</span>
                      </div>
                      <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm font-medium mb-1">Consultation Notes:</p>
                        <p className="text-sm text-muted-foreground">{consultation.notes}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(consultation.status)}>
                      {consultation.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      View Full Record
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
      
      {/* Add Appointment Dialog */}
      <Dialog open={isAddAppointmentOpen} onOpenChange={setIsAddAppointmentOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Patient Name */}
            <div className="space-y-2">
              <Label htmlFor="appointment-patient">Patient Name *</Label>
              <Input
                id="appointment-patient"
                placeholder="Enter patient's full name"
                value={newAppointment.patient}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, patient: e.target.value }))}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointment-date">Appointment Date *</Label>
                <Input
                  id="appointment-date"
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment-time">Time *</Label>
                <Input
                  id="appointment-time"
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            {/* Type and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointment-type">Consultation Type</Label>
                <Select value={newAppointment.type} onValueChange={(value) => setNewAppointment(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consultation">General Consultation</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Emergency Check">Emergency Check</SelectItem>
                    <SelectItem value="Prenatal Care">Prenatal Care</SelectItem>
                    <SelectItem value="Vaccination">Vaccination</SelectItem>
                    <SelectItem value="Health Screening">Health Screening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment-duration">Duration</Label>
                <Select value={newAppointment.duration} onValueChange={(value) => setNewAppointment(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15 min">15 minutes</SelectItem>
                    <SelectItem value="30 min">30 minutes</SelectItem>
                    <SelectItem value="45 min">45 minutes</SelectItem>
                    <SelectItem value="60 min">1 hour</SelectItem>
                    <SelectItem value="90 min">1.5 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointment-location">Location</Label>
                <Select value={newAppointment.location} onValueChange={(value) => setNewAppointment(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Clinic A">Clinic A</SelectItem>
                    <SelectItem value="Clinic B">Clinic B</SelectItem>
                    <SelectItem value="Health Center">Health Center</SelectItem>
                    <SelectItem value="Home Visit">Home Visit</SelectItem>
                    <SelectItem value="Community Center">Community Center</SelectItem>
                    <SelectItem value="Video Call">Video Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment-status">Status</Label>
                <Select value={newAppointment.status} onValueChange={(value) => setNewAppointment(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setNewAppointment({
                    patient: '',
                    time: '',
                    type: 'Consultation',
                    location: 'Clinic A',
                    status: 'confirmed',
                    duration: '30 min',
                    date: ''
                  });
                  setIsAddAppointmentOpen(false);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={addNewAppointment}
                disabled={!newAppointment.patient.trim() || !newAppointment.time.trim() || !newAppointment.date.trim()}
                className="flex-1"
              >
                Schedule Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultationsPage;
