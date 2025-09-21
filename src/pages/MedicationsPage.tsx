import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, Clock, AlertCircle, Calendar, History, CheckCircle, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

// This should match the dashboard medications data
const medications = [
  { id: 1, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', times: ['8:00 AM', '8:00 PM'], status: 'active' },
  { id: 2, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', times: ['8:00 AM'], status: 'active' },
  { id: 3, name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Once daily', times: ['9:00 AM'], status: 'active' },
];

const MedicationsPage = () => {
  const { t } = useLanguage();
  const [medicationTaken, setMedicationTaken] = useState<Record<string, boolean>>({});

  const markDoseTaken = (medicationId: number, doseTime: string) => {
    const today = new Date().toDateString();
    const doseKey = `${medicationId}-${doseTime}-${today}`;
    setMedicationTaken(prev => ({
      ...prev,
      [doseKey]: true
    }));
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

  const isDoseTaken = (medicationId: number, doseTime: string) => {
    const today = new Date().toDateString();
    const doseKey = `${medicationId}-${doseTime}-${today}`;
    return medicationTaken[doseKey];
  };

  const getTodaysMedications = () => {
    const today = new Date();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    
    return medications.flatMap(med => 
      med.times.map(time => {
        const [timeStr, period] = time.split(' ');
        const [hours, minutes] = timeStr.split(':').map(Number);
        let hour24 = hours;
        if (period === 'PM' && hours !== 12) hour24 += 12;
        if (period === 'AM' && hours === 12) hour24 = 0;
        
        const medicationTime = hour24 * 60 + minutes;
        const currentTime = currentHour * 60 + currentMinute;
        
        return {
          ...med,
          time,
          isPast: medicationTime < currentTime,
          isTaken: isDoseTaken(med.id, time)
        };
      })
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gov-navy mb-2">{t("medications")}</h1>
        <p className="text-muted-foreground">{t("manage_medications_prescriptions")}</p>
      </div>

      {/* Current Medications */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-500" />
            {t("current_medications")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {medications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {medications.map((medication) => {
                const allDosesTaken = medication.times.every(time => isDoseTaken(medication.id, time));
                
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
                            {t("all_taken")}
                          </Badge>
                        )}
                        <Badge variant="secondary">{medication.status}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{medication.dosage}</p>
                    <p className="text-sm text-muted-foreground mb-2">{medication.frequency}</p>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">{t("todays_doses")}</p>
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
                                  {t("dose_taken")}
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
                                  {t("take")}
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => undoDoseTaken(medication.id, doseTime)}
                                  className="h-6 text-xs px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="w-2 h-2 mr-1" />
                                  {t("undo")}
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
          ) : (
            <div className="text-center py-8">
              <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t("no_current_medications")}</p>
              <p className="text-sm text-muted-foreground">{t("add_prescribed_medications")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Medications */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            {t("todays_medications")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("no_medications_today")}</p>
            <p className="text-sm text-muted-foreground">{t("daily_schedule_appear")}</p>
          </div>
        </CardContent>
      </Card>

      {/* Past Medications */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-500" />
            {t("past_medications")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("no_medication_history")}</p>
            <p className="text-sm text-muted-foreground">{t("completed_courses_listed")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationsPage;
