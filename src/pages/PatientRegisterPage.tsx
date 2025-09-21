import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import { useMockAuth } from "@/hooks/useMockAuth";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { Loader2, Mail, Eye, EyeOff, User, Shield } from "lucide-react";

const PatientRegisterPage = () => {
  const { t } = useLanguage();
  const { signUp } = useMockAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'patient',
      preferredLanguage: 'en',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      const user = await signUp(data.email, data.password, data.fullName, 'patient');
      
      if (user) {
        // User will be signed out until they verify email
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please check your email to verify your account before signing in.' 
          }
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-lg shadow-elevated">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gov-navy">
            {t("patient_registration_title")}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Join Aarogya Sahayak as a Patient
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
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

            {/* Preferred Language */}
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
                  {t("agree_to_terms")}{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    {t("terms_of_service_link")}
                  </Link>
                  {' '}and Privacy Policy
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                t("register_button")
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

          {/* Health Worker Registration Link */}
          <div className="text-center">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Shield className="w-5 h-5 text-primary mr-2" />
                <span className="font-medium text-sm">Are you a Health Worker?</span>
              </div>
              <Link 
                to="/health-worker-register" 
                className="text-primary hover:underline text-sm font-medium"
              >
                Register as Health Worker
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRegisterPage;
