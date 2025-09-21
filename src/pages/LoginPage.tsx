import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/hooks/useLanguage";
import { useMockAuth } from "@/hooks/useMockAuth";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { Loader2, Mail, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const { t } = useLanguage();
  const { signIn, loading } = useMockAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'patient',
      rememberMe: false,
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
      
      // Redirect based on role
      if (data.role === 'patient') {
        navigate('/patient-dashboard');
      } else {
        navigate('/health-worker-dashboard');
      }
    } catch (error) {
      // Error is handled in the auth context
      console.error('Login error:', error);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
            <div className="text-white font-bold text-xl">आस</div>
          </div>
          <CardTitle className="text-2xl font-bold text-gov-navy">{t("login_title")}</CardTitle>
          <p className="text-muted-foreground text-sm">
            Welcome back to Aarogya Sahayak
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Your Role</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={selectedRole === 'patient' ? 'default' : 'outline'}
                onClick={() => setValue('role', 'patient')}
                className="h-12"
              >
                {t("role_patient")}
              </Button>
              <Button
                type="button"
                variant={selectedRole === 'health_worker' ? 'default' : 'outline'}
                onClick={() => setValue('role', 'health_worker')}
                className="h-12"
              >
                {t("role_health_worker")}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  placeholder="Enter your password"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  {...register('rememberMe')}
                />
                <Label htmlFor="rememberMe" className="text-sm">
                  Remember me
                </Label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                {t("forgot_password_link")}
              </Link>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                t("login_button")
              )}
            </Button>
          </form>


          {/* Register Link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {t("no_account_question")}{' '}
            </span>
            <Link 
              to="/register" 
              className="text-primary hover:underline font-medium"
            >
              {t("register_link")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
