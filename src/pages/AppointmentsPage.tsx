import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, CalendarDays, History, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

// Synchronized data from HealthWorkerDashboard
const upcomingAppointments = [
  { id: 1, patient: 'Rajesh Kumar', time: '10:00 AM', type: 'Follow-up', location: 'Clinic A', status: 'confirmed', duration: '30 min', date: '2024-01-16' },
  { id: 2, patient: 'Sunita Devi', time: '11:30 AM', type: 'Consultation', location: 'Home Visit', status: 'confirmed', duration: '45 min', date: '2024-01-16' },
  { id: 3, patient: 'Amit Sharma', time: '2:00 PM', type: 'Emergency Check', location: 'Clinic A', status: 'urgent', duration: '60 min', date: '2024-01-16' },
  { id: 4, patient: 'Priya Patel', time: '3:30 PM', type: 'Prenatal Care', location: 'Health Center', status: 'confirmed', duration: '30 min', date: '2024-01-16' },
];

const AppointmentsPage = () => {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState(upcomingAppointments);

  const cancelAppointment = (appointmentId) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
  };

  const getTodaysAppointments = () => {
    const today = new Date().toDateString();
    return appointments.filter(apt => new Date(apt.date).toDateString() === today);
  };

  const getFutureAppointments = () => {
    const today = new Date().toDateString();
    return appointments.filter(apt => new Date(apt.date).toDateString() > today);
  };

  const getPastAppointments = () => {
    const today = new Date().toDateString();
    return appointments.filter(apt => new Date(apt.date).toDateString() < today);
  };

  const todaysAppointments = getTodaysAppointments();
  const futureAppointments = getFutureAppointments();
  const pastAppointments = getPastAppointments();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gov-navy mb-2">{t("upcoming_appointments")}</h1>
        <p className="text-muted-foreground">{t("manage_consultations_appointments")}</p>
      </div>

      {/* Today's Appointments */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            {t("todays_appointments")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaysAppointments.length > 0 ? (
            <div className="space-y-4">
              {todaysAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg bg-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{appointment.patient}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{appointment.type}</p>
                      <p className="text-sm text-muted-foreground mb-2">{appointment.location}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                      <p className="text-xs font-medium mt-1">Duration: {appointment.duration}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => cancelAppointment(appointment.id)}
                      className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-3 h-3 mr-1" />
                      {t("cancel")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t("no_upcoming_appointments_message")}</p>
              <p className="text-sm text-muted-foreground">{t("daily_schedule_appear")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Future Appointments */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Future Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No upcoming appointments scheduled</p>
            <p className="text-sm text-muted-foreground">Schedule new appointments to see them here</p>
          </div>
        </CardContent>
      </Card>

      {/* Appointment History */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-green-500" />
            Appointment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No appointment history available</p>
            <p className="text-sm text-muted-foreground">Your past appointments will be listed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsPage;
