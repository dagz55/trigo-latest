"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginFormProps, LoginFormData, OtpFormData } from "@/lib/types";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

const phoneLoginSchema = z.object({
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[0-9\s-()]{10,15}$/, "Please enter a valid phone number"),
  telco: z.string().min(1, "Please select a telco provider"),
  rememberMe: z.boolean().optional(),
});

const otpSchema = z.object({
  otp: z.string()
    .length(6, "OTP must be 6 digits")
    .regex(/^[0-9]{6}$/, "OTP must contain only digits"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const createAccountSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Philippines telcos
const philippinesTelcos = [
  { id: 'globe', name: 'Globe', prefix: '0917' },
  { id: 'smart', name: 'Smart', prefix: '0918' },
  { id: 'tm', name: 'TM', prefix: '0926' },
  { id: 'sun', name: 'Sun', prefix: '0932' },
  { id: 'dito', name: 'DITO', prefix: '0991' },
  { id: 'gomo', name: 'GOMO', prefix: '0976' },
];

export default function LoginForm({ role, route }: LoginFormProps) {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [formMode, setFormMode] = useState<'login' | 'forgotPassword' | 'createAccount'>('login');
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    phoneNumber: "",
    telco: "globe", // Default to Globe
    rememberMe: false,
  });
  const [createAccountData, setCreateAccountData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const [otpFormData, setOtpFormData] = useState<OtpFormData>({
    otp: "",
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState<string>("");

  // Get the selected telco
  const selectedTelco = philippinesTelcos.find(t => t.id === formData.telco);

  // Format phone number based on selected telco
  useEffect(() => {
    if (formData.telco) {
      const selectedTelco = philippinesTelcos.find(t => t.id === formData.telco);
      if (selectedTelco && typeof formData.phoneNumber === 'string' && !formData.phoneNumber.startsWith(selectedTelco.prefix)) {
        setFormData(prev => ({
          ...prev,
          phoneNumber: selectedTelco.prefix
        }));
        setPhoneInput("");
      }
    }
  }, [formData.telco]);

  // OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isCountdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCountdownActive(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, isCountdownActive]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // For checkbox inputs
    const newValue = (e.target as HTMLInputElement).type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : value;
    
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    
    // Clear general login error
    if (loginError) {
      setLoginError(null);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    // Only allow digits
    const cleanValue = value.replace(/\D/g, '');
    
    setPhoneInput(cleanValue);
    
    // Update the full phone number by combining the prefix with the input
    const fullPhoneNumber = selectedTelco ? selectedTelco.prefix + cleanValue : cleanValue;
    setFormData(prev => ({ ...prev, phoneNumber: fullPhoneNumber }));
    
    // Clear errors when typing
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    }
    
    // Clear general login error
    if (loginError) {
      setLoginError(null);
    }
  };

  const handleCreateAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setCreateAccountData((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    
    // Clear general login error
    if (loginError) {
      setLoginError(null);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow digits and limit to 6 characters
    const cleanValue = value.replace(/\D/g, '').substring(0, 6);
    
    setOtpFormData((prev) => ({ ...prev, otp: cleanValue }));
    
    // Clear errors when typing
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: undefined }));
    }
    
    // Clear general login error
    if (loginError) {
      setLoginError(null);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    try {
      forgotPasswordSchema.parse({ email: formData.email });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }
    
    // Simulate API call to send password reset link
    setIsLoading(true);
    try {
      // In a real app, this would be an actual API call to send password reset email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage(`Password reset link sent to ${formData.email}. Please check your inbox.`);
      
      // Reset form after 3 seconds and go back to login
      setTimeout(() => {
        setSuccessMessage(null);
        setFormMode('login');
      }, 3000);
    } catch (error) {
      setLoginError("Failed to send password reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    try {
      createAccountSchema.parse(createAccountData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }
    
    // Simulate API call
    setIsLoading(true);
    try {
      // In a real app, this would be an actual API call to create account
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage("Account created successfully! You can now login.");
      
      // Reset form after 2 seconds and go back to login
      setTimeout(() => {
        setSuccessMessage(null);
        setFormMode('login');
        setFormData(prev => ({ ...prev, email: createAccountData.email }));
      }, 2000);
    } catch (error) {
      setLoginError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    try {
      phoneLoginSchema.parse(formData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }
    
    // Simulate API call to send OTP
    setIsLoading(true);
    try {
      // In a real app, this would be an actual API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsOtpSent(true);
      setCountdown(60);
      setIsCountdownActive(true);
    } catch (error) {
      setLoginError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate OTP
    try {
      otpSchema.parse(otpFormData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }
    
    // Simulate API call to verify OTP
    setIsLoading(true);
    try {
      // In a real app, this would be an actual API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, let's just navigate to the route
      router.push(route);
    } catch (error) {
      setLoginError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    setCountdown(60);
    setIsCountdownActive(true);
    
    // Simulate sending OTP again
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    try {
      loginSchema.parse(formData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }
    
    // Simulate API call
    setIsLoading(true);
    try {
      // In a real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, let's just navigate to the route
      router.push(route);
    } catch (error) {
      setLoginError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonColor = () => {
    switch(role) {
      case 'passenger': return 'bg-orange-500 hover:bg-orange-400 hover:shadow-orange-500/30';
      case 'trider': return 'bg-cyan-500 hover:bg-cyan-400 hover:shadow-cyan-500/30';
      case 'dispatcher': return 'bg-yellow-500 hover:bg-yellow-400 hover:shadow-yellow-500/30';
      case 'admin': return 'bg-green-500 hover:bg-green-400 hover:shadow-green-500/30';
      default: return 'bg-cyan-500 hover:bg-cyan-400 hover:shadow-cyan-500/30';
    }
  };

  const getTextLinkColor = () => {
    switch(role) {
      case 'passenger': return 'text-orange-400 hover:text-orange-300';
      case 'trider': return 'text-cyan-400 hover:text-cyan-300';
      case 'dispatcher': return 'text-yellow-400 hover:text-yellow-300';
      case 'admin': return 'text-green-400 hover:text-green-300';
      default: return 'text-cyan-400 hover:text-cyan-300';
    }
  };

  const renderForgotPasswordForm = () => (
    <form onSubmit={handleForgotPassword} className="flex flex-col space-y-4 w-full">
      <div>
        <label htmlFor={`${role}-forgot-email`} className="text-gray-100 text-sm block mb-1">
          Email
        </label>
        <input
          id={`${role}-forgot-email`}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full bg-gray-800/80 border ${
            errors.email ? 'border-red-500' : getBorderColor(role)
          } rounded-lg p-2 text-white focus:${getFocusBorderColor(role)} focus:outline-none focus:ring-1 focus:${getFocusRingColor(role)} transition-colors`}
          placeholder="your@email.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-red-400 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      
      {loginError && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 p-2 rounded text-sm">
          {loginError}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-900/30 border border-green-700 text-green-200 p-2 rounded text-sm">
          {successMessage}
        </div>
      )}
      
      <button
        type="submit"
        className={`${getButtonColor()} text-gray-900 font-bold py-2 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed`}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
            Sending email...
          </div>
        ) : (
          "Send Reset Link"
        )}
      </button>
      
      <button 
        type="button" 
        className={`${getTextLinkColor()} text-xs transition-colors`}
        onClick={() => {
          setFormMode('login');
          setLoginError(null);
          setSuccessMessage(null);
        }}
        disabled={isLoading}
      >
        Back to login
      </button>
    </form>
  );

  const renderCreateAccountForm = () => (
    <form onSubmit={handleCreateAccount} className="flex flex-col space-y-4 w-full">
      <div>
        <label htmlFor={`${role}-register-name`} className="text-gray-100 text-sm block mb-1">
          Full Name
        </label>
        <input
          id={`${role}-register-name`}
          name="fullName"
          type="text"
          value={createAccountData.fullName}
          onChange={handleCreateAccountChange}
          className={`w-full bg-gray-800/80 border ${
            errors.fullName ? 'border-red-500' : getBorderColor(role)
          } rounded-lg p-2 text-white focus:${getFocusBorderColor(role)} focus:outline-none focus:ring-1 focus:${getFocusRingColor(role)} transition-colors`}
          placeholder="John Doe"
          disabled={isLoading}
        />
        {errors.fullName && (
          <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label htmlFor={`${role}-register-email`} className="text-gray-100 text-sm block mb-1">
          Email
        </label>
        <input
          id={`${role}-register-email`}
          name="email"
          type="email"
          value={createAccountData.email}
          onChange={handleCreateAccountChange}
          className={`w-full bg-gray-800/80 border ${
            errors.email ? 'border-red-500' : getBorderColor(role)
          } rounded-lg p-2 text-white focus:${getFocusBorderColor(role)} focus:outline-none focus:ring-1 focus:${getFocusRingColor(role)} transition-colors`}
          placeholder="your@email.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-red-400 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      
      <div>
        <label htmlFor={`${role}-register-password`} className="text-gray-100 text-sm block mb-1">
          Password
        </label>
        <input
          id={`${role}-register-password`}
          name="password"
          type="password"
          value={createAccountData.password}
          onChange={handleCreateAccountChange}
          className={`w-full bg-gray-800/80 border ${
            errors.password ? 'border-red-500' : getBorderColor(role)
          } rounded-lg p-2 text-white focus:${getFocusBorderColor(role)} focus:outline-none focus:ring-1 focus:${getFocusRingColor(role)} transition-colors`}
          placeholder="••••••••"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-red-400 text-xs mt-1">{errors.password}</p>
        )}
      </div>
      
      <div>
        <label htmlFor={`${role}-confirm-password`} className="text-gray-100 text-sm block mb-1">
          Confirm Password
        </label>
        <input
          id={`${role}-confirm-password`}
          name="confirmPassword"
          type="password"
          value={createAccountData.confirmPassword}
          onChange={handleCreateAccountChange}
          className={`w-full bg-gray-800/80 border ${
            errors.confirmPassword ? 'border-red-500' : getBorderColor(role)
          } rounded-lg p-2 text-white focus:${getFocusBorderColor(role)} focus:outline-none focus:ring-1 focus:${getFocusRingColor(role)} transition-colors`}
          placeholder="••••••••"
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
        )}
      </div>
      
      {loginError && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 p-2 rounded text-sm">
          {loginError}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-900/30 border border-green-700 text-green-200 p-2 rounded text-sm">
          {successMessage}
        </div>
      )}
      
      <button
        type="submit"
        className={`${getButtonColor()} text-gray-900 font-bold py-2 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed`}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
            Creating account...
          </div>
        ) : (
          "Create Account"
        )}
      </button>
      
      <button 
        type="button" 
        className={`${getTextLinkColor()} text-xs transition-colors`}
        onClick={() => {
          setFormMode('login');
          setLoginError(null);
          setSuccessMessage(null);
        }}
        disabled={isLoading}
      >
        Back to login
      </button>
    </form>
  );

  // If we're in forgot password or create account mode, show appropriate form
  if (formMode === 'forgotPassword') {
    return renderForgotPasswordForm();
  }
  
  if (formMode === 'createAccount') {
    return renderCreateAccountForm();
  }

  return (
    <div className="w-full">
      {/* Login Method Toggle */}
      <div className="flex rounded-md overflow-hidden mb-4 bg-gray-700/50">
        <button
          type="button"
          className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
            loginMethod === 'email'
              ? `${getActiveTabStyle(role)}`
              : 'bg-transparent text-gray-300 hover:bg-gray-700'
          }`}
          onClick={() => {
            setLoginMethod('email');
            setIsOtpSent(false);
            setErrors({});
            setLoginError(null);
          }}
        >
          Email Login
        </button>
        <button
          type="button"
          className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
            loginMethod === 'phone'
              ? `${getActiveTabStyle(role)}`
              : 'bg-transparent text-gray-300 hover:bg-gray-700'
          }`}
          onClick={() => {
            setLoginMethod('phone');
            setIsOtpSent(false);
            setErrors({});
            setLoginError(null);
          }}
        >
          Phone OTP
        </button>
      </div>

      {loginMethod === 'email' && (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full">
          <div>
            <label htmlFor={`${role}-email`} className="text-gray-100 text-sm block mb-1">
              Email
            </label>
            <input
              id={`${role}-email`}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-gray-800/80 border ${
                errors.email ? 'border-red-500' : getBorderColor(role)
              } rounded-lg p-2 text-white focus:${getFocusBorderColor(role)} focus:outline-none focus:ring-1 focus:${getFocusRingColor(role)} transition-colors`}
              placeholder="your@email.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor={`${role}-password`} className="text-gray-100 text-sm block mb-1">
              Password
            </label>
            <input
              id={`${role}-password`}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full bg-gray-800/80 border ${
                errors.password ? 'border-red-500' : getBorderColor(role)
              } rounded-lg p-2 text-white focus:${getFocusBorderColor(role)} focus:outline-none focus:ring-1 focus:${getFocusRingColor(role)} transition-colors`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              id={`${role}-remember-me`}
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className={`h-4 w-4 ${getCheckboxColor(role)} border-gray-600 rounded bg-gray-700 focus:${getFocusRingColor(role)} focus:ring-offset-gray-800`}
            />
            <label htmlFor={`${role}-remember-me`} className="ml-2 text-sm text-gray-100">
              Remember me
            </label>
          </div>
          
          {loginError && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 p-2 rounded text-sm">
              {loginError}
            </div>
          )}
          
          <button
            type="submit"
            className={`${getButtonColor()} text-gray-900 font-bold py-2 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`
            )}
          </button>
          
          <div className="flex justify-between text-xs text-gray-400">
            <button 
              type="button" 
              className={`${getTextLinkColor()} transition-colors`}
              onClick={() => {
                setFormMode('forgotPassword');
                setLoginError(null);
              }}
              disabled={isLoading}
            >
              Forgot password?
            </button>
            <button 
              type="button" 
              className={`${getTextLinkColor()} transition-colors`}
              onClick={() => {
                setFormMode('createAccount');
                setLoginError(null);
                // Initialize create account data with current email if available
                setCreateAccountData(prev => ({
                  ...prev,
                  email: formData.email || ""
                }));
              }}
              disabled={isLoading}
            >
              Create account
            </button>
          </div>
        </form>
      )}

      {loginMethod === 'phone' && !isOtpSent && (
        <form onSubmit={handleSendOtp} className="flex flex-col space-y-4 w-full">
          <div className="space-y-2">
            <label htmlFor={`${role}-telco`} className="text-gray-100 text-sm block mb-1">
              Phone Number
            </label>

            {/* First input - Telco with prefix */}
            <select
              id={`${role}-telco`}
              name="telco"
              value={formData.telco}
              onChange={handleChange}
              className={`w-full bg-gray-800/80 border ${
                errors.telco ? 'border-red-500' : getBorderColor(role)
              } rounded-lg p-2 text-white focus:${getFocusBorderColor(role)} focus:outline-none focus:ring-1 focus:${getFocusRingColor(role)} transition-colors appearance-none mb-2`}
              disabled={isLoading}
            >
              {philippinesTelcos.map(telco => (
                <option key={telco.id} value={telco.id}>
                  {telco.name} ({telco.prefix})
                </option>
              ))}
            </select>
            
            {/* Second input - The rest of the phone number */}
            <input
              id={`${role}-phone`}
              name="phoneNumberInput"
              type="tel"
              value={phoneInput}
              onChange={handlePhoneNumberChange}
              className={`w-full bg-gray-800/80 border ${
                errors.phoneNumber ? 'border-red-500' : getBorderColor(role)
              } rounded-lg p-2 text-white focus:${getFocusBorderColor(role)} focus:outline-none focus:ring-1 focus:${getFocusRingColor(role)} transition-colors`}
              placeholder="Enter the rest of your phone number"
              disabled={isLoading}
            />
            
            {(errors.telco || errors.phoneNumber) && (
              <p className="text-red-400 text-xs mt-1">
                {errors.telco || errors.phoneNumber}
              </p>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              id={`${role}-remember-me-phone`}
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className={`h-4 w-4 ${getCheckboxColor(role)} border-gray-600 rounded bg-gray-700 focus:${getFocusRingColor(role)} focus:ring-offset-gray-800`}
            />
            <label htmlFor={`${role}-remember-me-phone`} className="ml-2 text-sm text-gray-100">
              Remember me
            </label>
          </div>
          
          {loginError && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 p-2 rounded text-sm">
              {loginError}
            </div>
          )}
          
          <button
            type="submit"
            className={`${getButtonColor()} text-gray-900 font-bold py-2 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending OTP...
              </div>
            ) : (
              "Send OTP"
            )}
          </button>
          
          <div className="text-center">
            <button 
              type="button" 
              className={`${getTextLinkColor()} text-xs transition-colors`}
              onClick={() => {
                setFormMode('createAccount');
                setLoginError(null);
              }}
              disabled={isLoading}
            >
              Create account
            </button>
          </div>
        </form>
      )}

      {loginMethod === 'phone' && isOtpSent && (
        <form onSubmit={handleVerifyOtp} className="flex flex-col space-y-4 w-full">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor={`${role}-otp`} className="text-gray-100 text-sm">
                Enter OTP
              </label>
              <span className="text-xs text-gray-300">Sent to {formData.phoneNumber}</span>
            </div>
            <div className="flex space-x-2">
              <input
                id={`${role}-otp`}
                name="otp"
                type="text"
                value={otpFormData.otp}
                onChange={handleOtpChange}
                className={`w-full bg-gray-800/80 border text-center tracking-widest ${
                  errors.otp ? 'border-red-500' : getBorderColor(role)
                } rounded-lg p-2 text-white focus:${getFocusBorderColor(role)} focus:outline-none focus:ring-1 focus:${getFocusRingColor(role)} transition-colors`}
                placeholder="⚫ ⚫ ⚫ ⚫ ⚫ ⚫"
                disabled={isLoading}
                maxLength={6}
              />
            </div>
            {errors.otp && (
              <p className="text-red-400 text-xs mt-1">{errors.otp}</p>
            )}
          </div>
          
          {loginError && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 p-2 rounded text-sm">
              {loginError}
            </div>
          )}
          
          <div className="flex flex-col space-y-2">
            <button
              type="submit"
              className={`${getButtonColor()} text-gray-900 font-bold py-2 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                "Verify & Sign In"
              )}
            </button>
            
            <button
              type="button"
              className={`${getTextLinkColor()} text-sm transition-colors`}
              onClick={() => setIsOtpSent(false)}
              disabled={isLoading}
            >
              Change phone number
            </button>
            
            <button
              type="button"
              className={`${getTextLinkColor()} text-sm transition-colors flex justify-center items-center`}
              onClick={handleResendOtp}
              disabled={isLoading || isCountdownActive}
            >
              {isCountdownActive ? (
                <span>Resend OTP in {countdown}s</span>
              ) : isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></div>
                  Resending...
                </div>
              ) : (
                "Resend OTP"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// Helper functions for role-specific styling
function getActiveTabStyle(role: string): string {
  switch(role) {
    case 'passenger': return 'bg-orange-600 text-white';
    case 'trider': return 'bg-cyan-600 text-white';
    case 'dispatcher': return 'bg-yellow-600 text-white';
    case 'admin': return 'bg-green-600 text-white';
    default: return 'bg-cyan-600 text-white';
  }
}

function getBorderColor(role: string): string {
  switch(role) {
    case 'passenger': return 'border-orange-700';
    case 'trider': return 'border-cyan-700';
    case 'dispatcher': return 'border-yellow-700';
    case 'admin': return 'border-green-700';
    default: return 'border-cyan-700';
  }
}

function getFocusBorderColor(role: string): string {
  switch(role) {
    case 'passenger': return 'border-orange-400';
    case 'trider': return 'border-cyan-400';
    case 'dispatcher': return 'border-yellow-400';
    case 'admin': return 'border-green-400';
    default: return 'border-cyan-400';
  }
}

function getFocusRingColor(role: string): string {
  switch(role) {
    case 'passenger': return 'ring-orange-400';
    case 'trider': return 'ring-cyan-400';
    case 'dispatcher': return 'ring-yellow-400';
    case 'admin': return 'ring-green-400';
    default: return 'ring-cyan-400';
  }
}

function getCheckboxColor(role: string): string {
  switch(role) {
    case 'passenger': return 'text-orange-500';
    case 'trider': return 'text-cyan-500';
    case 'dispatcher': return 'text-yellow-500';
    case 'admin': return 'text-green-500';
    default: return 'text-cyan-500';
  }
}