export interface LoginFormData {
  email: string;
  password: string;
  phoneNumber?: string;
  telco?: string;
  rememberMe?: boolean;
}

export interface OtpFormData {
  otp: string;
}

export interface LoginFormProps {
  role: string;
  route: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}