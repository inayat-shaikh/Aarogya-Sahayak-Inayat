import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Globe, User, LogIn, LogOut, Settings, Bell, Heart, Stethoscope, Camera, HelpCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { useMockAuth } from "@/hooks/useMockAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout, isAuthenticated, updateProfilePicture } = useMockAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  // Check if we're on login or registration pages
  const isAuthPage = location.pathname === '/login' || 
                     location.pathname === '/register' || 
                     location.pathname === '/health-worker-register';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateProfilePicture(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Top utility bar - Always visible */}
        <div className="bg-gov-navy text-gov-navy-foreground py-2">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <span>{t("last_updated")}</span>
              <span>{t("screen_reader_access")}</span>
            </div>
            <div className="flex items-center gap-4">
              <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'hi' | 'mr')}>
                <SelectTrigger className="w-32 bg-transparent border-white/20 text-white">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="mr">मराठी</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              {isAuthenticated ? (
                // Authenticated user menu
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/10"
                    onClick={() => setIsNotificationsOpen(true)}
                  >
                    <Bell className="w-4 h-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/10">
                        <Avatar className="w-8 h-8">
                          {user?.profilePicture ? (
                            <AvatarImage 
                              src={user.profilePicture} 
                              alt={user.fullName}
                              className="object-cover object-center"
                            />
                          ) : null}
                          <AvatarFallback className="bg-primary text-white text-sm">
                            {user ? getUserInitials(user.fullName) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium">{user?.fullName?.split(' ')[0] || 'User'}</span>
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            {user?.role === 'patient' ? (
                              <><Heart className="w-3 h-3 mr-1" />{user?.fullName?.split(' ')[0] || 'Patient'}</>
                            ) : (
                              <><Stethoscope className="w-3 h-3 mr-1" />Health Worker</>
                            )}
                          </Badge>
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem>
                        <User className="w-4 h-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => document.getElementById('profile-picture-input')?.click()}>
                        <Camera className="w-4 h-4 mr-2" />
                        Change Profile Picture
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                // Non-authenticated user menu
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                        <User className="w-4 h-4 mr-2" />
                        {t("profile")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <Link to="/login">
                        <DropdownMenuItem>
                          <LogIn className="w-4 h-4 mr-2" />
                          {t("login")}
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <Link to="/help">
                        <DropdownMenuItem>
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Help
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Link to="/register">
                    <Button size="sm" className="bg-accent hover:bg-accent/90">
                      {t("register")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

      {/* Main header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo and title */}
            {isAuthPage ? (
              // Logo non-clickable, but app name clickable on auth pages
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <div className="text-white font-bold text-lg">आस</div>
                </div>
                <div>
                  <Link to="/" className="hover:opacity-80 transition-opacity">
                    <h1 className="text-xl font-bold text-foreground">{t("app_name")}</h1>
                  </Link>
                  <p className="text-xs text-muted-foreground">{t("app_tagline")}</p>
                </div>
              </div>
            ) : (
              // Clickable logo and title on other pages
              <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <div className="text-white font-bold text-lg">आस</div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{t("app_name")}</h1>
                  <p className="text-xs text-muted-foreground">{t("app_tagline")}</p>
                </div>
              </Link>
            )}

            {/* Navigation - Hidden on auth pages */}
            {!isAuthPage && (
              <nav className="hidden lg:flex items-center gap-4">
                {isAuthenticated ? (
                  // Authenticated user navigation
                  <>
                    {user?.role === 'patient' ? (
                      <>
                        <Link to="/patient-dashboard" className="text-sm text-foreground hover:text-primary font-medium transition-colors">
                          Dashboard
                        </Link>
                        <Link to="/my-health" className="text-sm text-foreground hover:text-primary font-medium transition-colors">
                          My Health
                        </Link>
                        <Link to="/appointments" className="text-sm text-foreground hover:text-primary font-medium transition-colors">
                          Appointments
                        </Link>
                        <Link to="/medications" className="text-sm text-foreground hover:text-primary font-medium transition-colors">
                          Medications
                        </Link>
                        <Link to="/reports" className="text-sm text-foreground hover:text-primary font-medium transition-colors">
                          Reports
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/health-worker-dashboard" className="text-sm text-foreground hover:text-primary font-medium transition-colors">
                          Dashboard
                        </Link>
                        <Link to="/patients" className="text-sm text-foreground hover:text-primary font-medium transition-colors">
                          My Patients
                        </Link>
                        <Link to="/consultations" className="text-sm text-foreground hover:text-primary font-medium transition-colors">
                          Consultations
                        </Link>
                        <Link to="/reports" className="text-sm text-foreground hover:text-primary font-medium transition-colors">
                          Reports
                        </Link>
                      </>
                    )}
                  </>
                ) : (
                  // Public navigation
                  <>
                    <a href="#home" className="text-sm text-foreground hover:text-primary font-medium transition-colors">{t("nav_home")}</a>
                    <a href="#about" className="text-sm text-foreground hover:text-primary font-medium transition-colors">{t("nav_about")}</a>
                    <a href="#features" className="text-sm text-foreground hover:text-primary font-medium transition-colors">{t("nav_features")}</a>
                    <a href="#news" className="text-sm text-foreground hover:text-primary font-medium transition-colors">{t("nav_news")}</a>
                    <a href="#health-worker-connect" className="text-sm text-foreground hover:text-primary font-medium transition-colors">{t("nav_health_worker_connect")}</a>
                    <a href="#resources" className="text-sm text-foreground hover:text-primary font-medium transition-colors">{t("nav_resources")}</a>
                    <a href="#contact" className="text-sm text-foreground hover:text-primary font-medium transition-colors">{t("nav_contact_us")}</a>
                  </>
                )}
              </nav>
            )}

            {/* Mobile menu button - Hidden on auth pages */}
            {!isAuthPage && (
              <Button variant="outline" className="lg:hidden">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {/* Hidden file input for profile picture */}
      <input
        id="profile-picture-input"
        type="file"
        accept="image/*"
        onChange={handleProfilePictureChange}
        className="hidden"
      />

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Profile Information</Label>
                <div className="space-y-2 mt-2">
                  <div>
                    <Label htmlFor="user-name">Full Name</Label>
                    <Input
                      id="user-name"
                      value={user?.fullName || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-role">Role</Label>
                    <Input
                      id="user-role"
                      value={user?.role === 'patient' ? 'Patient' : 'Health Worker'}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-base font-medium">Language Preferences</Label>
                <div className="mt-2">
                  <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'hi' | 'mr')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">हिंदी</SelectItem>
                        <SelectItem value="mr">मराठी</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Notifications</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <Switch id="push-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reminder-notifications">Medication Reminders</Label>
                    <Switch id="reminder-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="appointment-reminders">Appointment Reminders</Label>
                    <Switch id="appointment-reminders" defaultChecked />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Privacy & Security</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="data-sharing">Share Health Data with Doctors</Label>
                    <Switch id="data-sharing" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="analytics">Help Improve App with Usage Data</Label>
                    <Switch id="analytics" defaultChecked />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Display Preferences</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compact-view">Compact Dashboard View</Label>
                    <Switch id="compact-view" />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Health Data</Label>
                <div className="space-y-2 mt-2">
                  <Button variant="outline" className="w-full justify-start">
                    Export Health Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    Clear All Health Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsSettingsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="sm:max-w-[400px] max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border-l-4 border-l-blue-500 rounded">
                <div className="flex items-start gap-3">
                  <Bell className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Medication Reminder</p>
                    <p className="text-xs text-muted-foreground">Time to take your Metformin (500mg)</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 border-l-4 border-l-green-500 rounded">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Appointment Confirmed</p>
                    <p className="text-xs text-muted-foreground">Your appointment with Dr. Priya Sharma is confirmed for tomorrow at 10:00 AM</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-orange-50 border-l-4 border-l-orange-500 rounded">
                <div className="flex items-start gap-3">
                  <Heart className="w-4 h-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Health Data Reminder</p>
                    <p className="text-xs text-muted-foreground">Don't forget to log your daily health measurements</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No more notifications</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsNotificationsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;