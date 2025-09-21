import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Activity, TrendingUp, Thermometer, Weight, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from "@/hooks/useLanguage";
import { useHealthData } from "@/hooks/useHealthData";
import { getBloodPressureStatus, getHeartRateStatus, getBloodSugarStatus, getWeightStatus } from "@/lib/healthUtils";

const MyHealthPage = () => {
  const { t } = useLanguage();
  const { currentMetrics, healthTrends } = useHealthData();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gov-navy mb-2">{t("my_health")}</h1>
        <p className="text-muted-foreground">{t("track_health_vitals")}</p>
      </div>

      {/* Current Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("blood_pressure")}</p>
                <p className="text-2xl font-bold text-foreground">
                  {currentMetrics.bloodPressureSystolic}/{currentMetrics.bloodPressureDiastolic}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">{t("mmhg")}</span>
                  <Badge 
                    variant="secondary" 
                    className={`${getBloodPressureStatus(currentMetrics.bloodPressureSystolic, currentMetrics.bloodPressureDiastolic).color}`}
                  >
                    {getBloodPressureStatus(currentMetrics.bloodPressureSystolic, currentMetrics.bloodPressureDiastolic).status}
                  </Badge>
                </div>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("heart_rate")}</p>
                <p className="text-2xl font-bold text-foreground">{currentMetrics.heartRate} {t("bpm")}</p>
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
                <p className="text-sm font-medium text-muted-foreground">{t("weight")}</p>
                <p className="text-2xl font-bold text-foreground">{currentMetrics.weight} {t("kg")}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="secondary" 
                    className={`${getWeightStatus(currentMetrics.weight).color}`}
                  >
                    BMI: {getWeightStatus(currentMetrics.weight).bmi}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getWeightStatus(currentMetrics.weight).status}
                  </Badge>
                </div>
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
            {t("health_trends")} (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
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

      {/* Health Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Health Goals Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No health goals set yet</p>
              <p className="text-sm text-muted-foreground">Set up your daily health goals to track progress</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Health Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recent health events</p>
              <p className="text-sm text-muted-foreground">Your health activities will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyHealthPage;
