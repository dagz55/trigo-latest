import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRoleBasedRedirectPath(role: string | null | undefined): string {
  switch (role?.toLowerCase()) {
    case 'passenger':
      return '/passenger/dashboard';
    case 'trider':
      return '/trider/dashboard';
    case 'dispatcher':
      return '/dispatcher/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      // Fallback route if role is unknown or null
      // Could be the main landing page, a role selection page, or a generic dashboard
      console.warn(`Unknown or missing role: ${role}, redirecting to /`);
      return '/'; // Or perhaps '/roles' or '/dashboard'
  }
}
