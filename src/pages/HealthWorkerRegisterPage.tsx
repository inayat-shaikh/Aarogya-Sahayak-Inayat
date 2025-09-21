import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/useLanguage";
import { useMockAuth } from "@/hooks/useMockAuth";
import { Link, useNavigate } from "react-router-dom";
import { healthWorkerRegisterSchema, type HealthWorkerRegisterFormData } from "@/lib/validations";
import { Loader2, Mail, Eye, EyeOff, User, Shield, Briefcase, MapPin, Award, ChevronDown } from "lucide-react";

// Maharashtra districts and major cities for address autocomplete
const maharashtraLocations = [
  // Mumbai Division
  { city: "Mumbai", district: "Mumbai City", state: "Maharashtra", type: "city" },
  { city: "Mumbai Suburban", district: "Mumbai Suburban", state: "Maharashtra", type: "district" },
  { city: "Thane", district: "Thane", state: "Maharashtra", type: "city" },
  { city: "Raigad", district: "Raigad", state: "Maharashtra", type: "district" },
  { city: "Panvel", district: "Raigad", state: "Maharashtra", type: "city" },
  { city: "Kalyan", district: "Thane", state: "Maharashtra", type: "city" },
  { city: "Dombivli", district: "Thane", state: "Maharashtra", type: "city" },
  
  // Pune Division
  { city: "Pune", district: "Pune", state: "Maharashtra", type: "city" },
  { city: "Pimpri-Chinchwad", district: "Pune", state: "Maharashtra", type: "city" },
  { city: "Ahmednagar", district: "Ahmednagar", state: "Maharashtra", type: "city" },
  { city: "Solapur", district: "Solapur", state: "Maharashtra", type: "city" },
  { city: "Satara", district: "Satara", state: "Maharashtra", type: "city" },
  { city: "Sangli", district: "Sangli", state: "Maharashtra", type: "city" },
  { city: "Kolhapur", district: "Kolhapur", state: "Maharashtra", type: "city" },
  
  // Nashik Division
  { city: "Nashik", district: "Nashik", state: "Maharashtra", type: "city" },
  { city: "Dhule", district: "Dhule", state: "Maharashtra", type: "city" },
  { city: "Nandurbar", district: "Nandurbar", state: "Maharashtra", type: "city" },
  { city: "Jalgaon", district: "Jalgaon", state: "Maharashtra", type: "city" },
  { city: "Malegaon", district: "Nashik", state: "Maharashtra", type: "city" },
  
  // Aurangabad Division
  { city: "Aurangabad", district: "Aurangabad", state: "Maharashtra", type: "city" },
  { city: "Jalna", district: "Jalna", state: "Maharashtra", type: "city" },
  { city: "Beed", district: "Beed", state: "Maharashtra", type: "city" },
  { city: "Osmanabad", district: "Osmanabad", state: "Maharashtra", type: "city" },
  { city: "Latur", district: "Latur", state: "Maharashtra", type: "city" },
  { city: "Parbhani", district: "Parbhani", state: "Maharashtra", type: "city" },
  { city: "Hingoli", district: "Hingoli", state: "Maharashtra", type: "city" },
  { city: "Nanded", district: "Nanded", state: "Maharashtra", type: "city" },
  
  // Nagpur Division
  { city: "Nagpur", district: "Nagpur", state: "Maharashtra", type: "city" },
  { city: "Wardha", district: "Wardha", state: "Maharashtra", type: "city" },
  { city: "Chandrapur", district: "Chandrapur", state: "Maharashtra", type: "city" },
  { city: "Gadchiroli", district: "Gadchiroli", state: "Maharashtra", type: "city" },
  { city: "Gondia", district: "Gondia", state: "Maharashtra", type: "city" },
  { city: "Bhandara", district: "Bhandara", state: "Maharashtra", type: "city" },
  
  // Amravati Division
  { city: "Amravati", district: "Amravati", state: "Maharashtra", type: "city" },
  { city: "Akola", district: "Akola", state: "Maharashtra", type: "city" },
  { city: "Washim", district: "Washim", state: "Maharashtra", type: "city" },
  { city: "Buldhana", district: "Buldhana", state: "Maharashtra", type: "city" },
  { city: "Yavatmal", district: "Yavatmal", state: "Maharashtra", type: "city" },
  
  // Konkan Division
  { city: "Ratnagiri", district: "Ratnagiri", state: "Maharashtra", type: "city" },
  { city: "Sindhudurg", district: "Sindhudurg", state: "Maharashtra", type: "city" },
  
  // Other neighboring states for health workers who might work across borders
  { city: "Goa", district: "North Goa", state: "Goa", type: "city" },
  { city: "Belgaum", district: "Belgaum", state: "Karnataka", type: "city" },
  { city: "Hyderabad", district: "Hyderabad", state: "Telangana", type: "city" },
];

const HealthWorkerRegisterPage = () => {
  const { t } = useLanguage();
  const { signUp, loading } = useMockAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Address autocomplete state
  const [locationInput, setLocationInput] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(maharashtraLocations);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<HealthWorkerRegisterFormData>({
    resolver: zodResolver(healthWorkerRegisterSchema),
    defaultValues: {
      role: 'health_worker',
      preferredLanguage: 'en',
      agreeToTerms: false,
      experience: 0,
    },
  });

  // Watch the workLocation field to sync with local state
  const workLocationValue = watch('workLocation');
  
  // Sync form value with local state (only when form value changes externally)
  useEffect(() => {
    if (workLocationValue !== locationInput && workLocationValue !== undefined) {
      setLocationInput(workLocationValue || '');
    }
  }, [workLocationValue]);

  // Address autocomplete functions
  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationInput(value);
    setValue('workLocation', value, { shouldValidate: true });
    
    if (value.length > 0) {
      const filtered = maharashtraLocations.filter(location => 
        location.city.toLowerCase().includes(value.toLowerCase()) ||
        location.district.toLowerCase().includes(value.toLowerCase()) ||
        location.state.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationSelect = (location: typeof maharashtraLocations[0]) => {
    const fullLocation = `${location.city}, ${location.district}, ${location.state}`;
    
    // Update local state first
    setLocationInput(fullLocation);
    
    // Update form value
    setValue('workLocation', fullLocation, { 
      shouldValidate: true, 
      shouldDirty: true,
      shouldTouch: true 
    });
    
    // Hide suggestions
    setShowLocationSuggestions(false);
    
    // Focus back to input and trigger validation
    if (locationInputRef.current) {
      locationInputRef.current.focus();
      locationInputRef.current.blur(); // This will trigger validation
    }
    
    // Force trigger validation after a short delay
    setTimeout(() => {
      trigger('workLocation');
    }, 100);
  };

  const handleLocationInputFocus = () => {
    if (locationInput.length > 0) {
      setShowLocationSuggestions(true);
    }
  };

  const handleLocationInputBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setShowLocationSuggestions(false);
      }
    }, 150);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationInputRef.current && 
        !locationInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onSubmit = async (data: HealthWorkerRegisterFormData) => {
    try {
      const user = await signUp(data.email, data.password, data.fullName, 'health_worker');
      if (user) {
        // User will be signed out until they verify email
        navigate('/login', { 
          state: { 
            message: 'Health Worker registration successful! Please check your email to verify your account. Your application will be reviewed by our team.' 
          }
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/5 to-primary/5 p-4">
      <Card className="w-full max-w-2xl shadow-elevated">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-2">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gov-navy">
            {t("health_worker_registration_title")}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Join Aarogya Sahayak as a Certified Health Worker
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h3>
              </div>

              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName">{t("full_name_label")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder={t("enter_full_name_placeholder")}
                    className="pl-10"
                    {...register('fullName')}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Professional Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your professional email"
                    className="pl-10"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Professional Information
                </h3>
              </div>

              {/* License Number */}
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Medical License Number</Label>
                <div className="relative">
                  <Award className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="licenseNumber"
                    type="text"
                    placeholder="Enter your medical license number"
                    className="pl-10"
                    {...register('licenseNumber')}
                  />
                </div>
                {errors.licenseNumber && (
                  <p className="text-sm text-destructive">{errors.licenseNumber.message}</p>
                )}
              </div>

              {/* Specialization */}
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select onValueChange={(value) => setValue('specialization', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general_medicine">General Medicine</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="gynecology">Gynecology</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="asha_worker">ASHA Worker</SelectItem>
                    <SelectItem value="anm">ANM (Auxiliary Nurse Midwife)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.specialization && (
                  <p className="text-sm text-destructive">{errors.specialization.message}</p>
                )}
              </div>

              {/* Work Location with Autocomplete */}
              <div className="space-y-2">
                <Label htmlFor="workLocation">Primary Work Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    {...register('workLocation', {
                      onChange: handleLocationInputChange
                    })}
                    ref={locationInputRef}
                    id="workLocation"
                    type="text"
                    placeholder="Start typing your city or district..."
                    className="pl-10"
                    value={locationInput}
                    onFocus={handleLocationInputFocus}
                    onBlur={handleLocationInputBlur}
                    autoComplete="off"
                  />
                  
                  {/* Autocomplete Suggestions */}
                  {showLocationSuggestions && filteredLocations.length > 0 && (
                    <div 
                      ref={suggestionsRef}
                      className="absolute top-full left-0 right-0 z-50 bg-white border border-border rounded-md shadow-lg max-h-60 overflow-y-auto mt-1"
                    >
                      {filteredLocations.slice(0, 8).map((location, index) => (
                        <div
                          key={`${location.city}-${location.district}-${index}`}
                          className="flex items-center justify-between p-3 hover:bg-muted cursor-pointer border-b border-border/50 last:border-b-0"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {location.city}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {location.district}, {location.state}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {location.type === 'city' ? 'City' : 'District'}
                          </div>
                        </div>
                      ))}
                      
                      {filteredLocations.length > 8 && (
                        <div className="p-2 text-center text-xs text-muted-foreground border-t">
                          {filteredLocations.length - 8} more locations available...
                        </div>
                      )}
                      
                      {locationInput.length > 2 && filteredLocations.length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          <MapPin className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                          <p>No locations found matching "{locationInput}"</p>
                          <p className="text-xs mt-1">Try searching for a city or district in Maharashtra</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {errors.workLocation && (
                  <p className="text-sm text-destructive">{errors.workLocation.message}</p>
                )}
                
                {/* Location Helper Text */}
                <p className="text-xs text-muted-foreground">
                  Select your primary work location from Maharashtra districts and cities
                </p>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  placeholder="Enter years of experience"
                  {...register('experience', { valueAsNumber: true })}
                />
                {errors.experience && (
                  <p className="text-sm text-destructive">{errors.experience.message}</p>
                )}
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Account Security
                </h3>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">{t("password_label")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className="pr-10"
                    {...register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("confirm_password_label")}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t("confirm_password_placeholder")}
                    className="pr-10"
                    {...register('confirmPassword')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-2">
              <Label htmlFor="preferredLanguage">{t("preferred_language_label")}</Label>
              <Select onValueChange={(value) => setValue('preferredLanguage', value as 'en' | 'hi' | 'mr')}>
                <SelectTrigger>
                  <SelectValue placeholder={t("select_language_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="mr">मराठी</SelectItem>
                </SelectContent>
              </Select>
              {errors.preferredLanguage && (
                <p className="text-sm text-destructive">{errors.preferredLanguage.message}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={watch('agreeToTerms')}
                  onCheckedChange={(checked) => {
                    setValue('agreeToTerms', !!checked);
                    trigger('agreeToTerms');
                  }}
                />
                <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                  , Privacy Policy, and Professional Code of Conduct for Health Workers
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-secondary hover:bg-secondary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>


          {/* Login Link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{' '}
            </span>
            <Link 
              to="/login" 
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>

          {/* Patient Registration Link */}
          <div className="text-center">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <User className="w-5 h-5 text-primary mr-2" />
                <span className="font-medium text-sm">Are you a Patient?</span>
              </div>
              <Link 
                to="/register" 
                className="text-primary hover:underline text-sm font-medium"
              >
                Register as Patient
              </Link>
            </div>
          </div>

          {/* Verification Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Application Review Process</p>
                <p>
                  Your health worker application will be reviewed by our verification team. 
                  You will receive an email confirmation once your credentials are verified 
                  and your account is approved.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthWorkerRegisterPage;
