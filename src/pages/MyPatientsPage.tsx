import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserCheck, Search, Calendar, Phone, MapPin, AlertCircle, Filter, Plus, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Synchronized data from HealthWorkerDashboard
const myPatients = [
  { id: 1, name: 'Rajesh Kumar', age: 45, condition: 'Diabetes', lastVisit: '2024-01-15', status: 'stable', priority: 'medium', phone: '+91 98765 43210', address: 'Pune, Maharashtra' },
  { id: 2, name: 'Sunita Devi', age: 38, condition: 'Hypertension', lastVisit: '2024-01-14', status: 'needs_attention', priority: 'high', phone: '+91 98765 43211', address: 'Mumbai, Maharashtra' },
  { id: 3, name: 'Amit Sharma', age: 52, condition: 'Heart Disease', lastVisit: '2024-01-13', status: 'critical', priority: 'high', phone: '+91 98765 43212', address: 'Nashik, Maharashtra' },
  { id: 4, name: 'Priya Patel', age: 29, condition: 'Pregnancy Care', lastVisit: '2024-01-12', status: 'stable', priority: 'medium', phone: '+91 98765 43213', address: 'Aurangabad, Maharashtra' },
  { id: 5, name: 'Ravi Singh', age: 61, condition: 'Arthritis', lastVisit: '2024-01-11', status: 'stable', priority: 'low', phone: '+91 98765 43214', address: 'Nagpur, Maharashtra' },
];

const MyPatientsPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [patients, setPatients] = useState(myPatients);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    condition: '',
    phone: '',
    address: '',
    status: 'stable',
    priority: 'medium'
  });

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
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const addNewPatient = () => {
    if (!newPatient.name.trim() || !newPatient.age.trim() || !newPatient.condition.trim()) return;
    
    const patient = {
      id: Date.now(),
      name: newPatient.name,
      age: parseInt(newPatient.age),
      condition: newPatient.condition,
      lastVisit: new Date().toISOString().split('T')[0],
      status: newPatient.status,
      priority: newPatient.priority,
      phone: newPatient.phone || '+91 XXXXXXXXXX',
      address: newPatient.address || 'Maharashtra, India'
    };
    
    setPatients(prev => [...prev, patient]);
    setNewPatient({
      name: '',
      age: '',
      condition: '',
      phone: '',
      address: '',
      status: 'stable',
      priority: 'medium'
    });
    setIsAddPatientOpen(false);
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gov-navy mb-2">{t("my_patients")}</h1>
          <p className="text-muted-foreground">{t("manage_monitor_patients")} ({patients.length} {t("total_patients")})</p>
        </div>
        <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t("add_patient")}
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search_patients_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'critical' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('critical')}
            className="text-red-600"
          >
            Critical
          </Button>
          <Button
            variant={statusFilter === 'needs_attention' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('needs_attention')}
            className="text-yellow-600"
          >
            Needs Attention
          </Button>
          <Button
            variant={statusFilter === 'stable' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('stable')}
            className="text-green-600"
          >
            Stable
          </Button>
        </div>
      </div>

      {/* Patient Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t("total_patients")}</p>
                <p className="text-2xl font-bold">{patients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t("critical")}</p>
                <p className="text-2xl font-bold text-red-600">{patients.filter(p => p.status === 'critical').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t("needs_attention")}</p>
                <p className="text-2xl font-bold text-yellow-600">{patients.filter(p => p.status === 'needs_attention').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t("stable")}</p>
                <p className="text-2xl font-bold text-green-600">{patients.filter(p => p.status === 'stable').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient List */}
      <div className="space-y-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getUserInitials(patient.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{patient.name}</h3>
                    <p className="text-muted-foreground">Age: {patient.age} • {patient.condition}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{patient.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Last Visit</p>
                    <p className="font-medium">{patient.lastVisit}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(patient.priority)}>
                      {patient.priority} priority
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Calendar className="w-4 h-4 mr-1" />
                      Schedule
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
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No patients found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
      
      {/* Add Patient Dialog */}
      <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Patient Name */}
            <div className="space-y-2">
              <Label htmlFor="patient-name">Patient Name *</Label>
              <Input
                id="patient-name"
                placeholder="Enter patient's full name"
                value={newPatient.name}
                onChange={(e) => setNewPatient(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="patient-age">Age *</Label>
              <Input
                id="patient-age"
                type="number"
                placeholder="Enter age"
                value={newPatient.age}
                onChange={(e) => setNewPatient(prev => ({ ...prev, age: e.target.value }))}
                min="0"
                max="120"
              />
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <Label htmlFor="patient-condition">Medical Condition *</Label>
              <Input
                id="patient-condition"
                placeholder="e.g., Diabetes, Hypertension"
                value={newPatient.condition}
                onChange={(e) => setNewPatient(prev => ({ ...prev, condition: e.target.value }))}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="patient-phone">Phone Number</Label>
              <Input
                id="patient-phone"
                placeholder="+91 XXXXXXXXXX"
                value={newPatient.phone}
                onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="patient-address">Address</Label>
              <Textarea
                id="patient-address"
                placeholder="Enter patient's address"
                value={newPatient.address}
                onChange={(e) => setNewPatient(prev => ({ ...prev, address: e.target.value }))}
                rows={2}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="patient-status">Health Status</Label>
              <Select value={newPatient.status} onValueChange={(value) => setNewPatient(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all")}</SelectItem>
                  <SelectItem value="critical">{t("critical")}</SelectItem>
                  <SelectItem value="needs_attention">{t("needs_attention")}</SelectItem>
                  <SelectItem value="stable">{t("stable")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="patient-priority">Priority</Label>
              <Select value={newPatient.priority} onValueChange={(value) => setNewPatient(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setNewPatient({
                    name: '',
                    age: '',
                    condition: '',
                    phone: '',
                    address: '',
                    status: 'stable',
                    priority: 'medium'
                  });
                  setIsAddPatientOpen(false);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={addNewPatient}
                disabled={!newPatient.name.trim() || !newPatient.age.trim() || !newPatient.condition.trim()}
                className="flex-1"
              >
                Add Patient
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPatientsPage;
