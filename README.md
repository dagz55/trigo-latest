# TriGo - Authentication Module

TriGo is a flexible, modern, and fully-featured authentication module that can be easily integrated into any existing web application. It provides a beautiful, role-based login experience with multiple authentication methods (email/password and phone OTP).

![TriGo Login](https://i.imgur.com/tGzNxZa.png)

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Styling**: Tailwind CSS
- **Components**: Modern UI with role-based authentication
- **Icons**: Lucide React
- **Form Validation**: Zod
- **Animation**: Canvas-based background and CSS animations
- **Typescript**: Full type safety throughout

## Features

- **Role-based Authentication**: Separate login flows for different user types
- **Multiple Auth Methods**: 
  - Email/Password login
  - Phone OTP verification
- **Modern UI/UX**: 
  - Beautiful animated background
  - Interactive role cards with flip effect
  - Responsive design for all devices
- **Form Validation**: 
  - Real-time validation feedback
  - Error handling for all form inputs
- **Account Management**:
  - Password reset workflow
  - Account creation flow

## Installation Requirements

### Prerequisites

- Node.js 18.17.0 or later
- npm 9.6.7 or later

### Dependencies

```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.9.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.446.0",
    "next": "13.5.1",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-hook-form": "^7.53.0",
    "tailwind-merge": "^2.5.2",
    "tailwindcss": "3.3.3",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.23.8"
  }
}
```

### Installation

1. Clone the repository or copy the required files
2. Install dependencies:

```bash
npm install
```

3. Add custom configuration if needed
4. Start the development server:

```bash
npm run dev
```

## Integration Guide

### Adding to an Existing React/Next.js Application

#### 1. Copy Required Files

Start by copying these key component directories and files to your project:

- `components/Logo.tsx`
- `components/LoginForm.tsx`
- `components/RoleCard.tsx`
- `components/RoleSelection.tsx`
- `components/BackgroundAnimation.tsx`
- `lib/constants.ts`
- `lib/types.ts`
- `lib/utils.ts`

#### 2. Update Dependencies

Ensure your project has the necessary dependencies:

```bash
npm install lucide-react zod clsx tailwind-merge
```

#### 3. Configure Tailwind CSS

Make sure your `tailwind.config.js` includes the necessary configuration:

```js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Copy the custom animations and other theme extensions
    }
  }
}
```

#### 4. Customize User Roles

Edit the roles in `lib/constants.ts` to match your application's user types:

```typescript
export const roles: Role[] = [
  { 
    id: 'customer', 
    name: 'Customer',
    icon: User, 
    route: '/customer/dashboard',
    description: 'Access your account and orders',
  },
  // Add additional roles as needed
];
```

#### 5. Connect Authentication Logic

Update the login form handlers in `components/LoginForm.tsx` to connect with your authentication service:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate form data with zod
  try {
    loginSchema.parse(formData);
    setErrors({});
  } catch (error) {
    // Handle validation errors
  }
  
  // Connect to your authentication API
  setIsLoading(true);
  try {
    // Replace with your API call
    const response = await yourAuthService.login(formData);
    
    // Handle successful login
    router.push(route);
  } catch (error) {
    setLoginError("Login failed. Please check your credentials.");
  } finally {
    setIsLoading(false);
  }
};
```

#### 6. Add the Login Page

Create a page component that uses the TriGo authentication:

```tsx
import Logo from "@/components/Logo";
import RoleSelection from "@/components/RoleSelection";
import BackgroundAnimation from "@/components/BackgroundAnimation";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full relative flex flex-col items-center justify-center overflow-hidden py-12">
      <BackgroundAnimation />
      
      <div className="container mx-auto px-4 py-8 z-10 max-w-7xl">
        <Logo />
        <RoleSelection />
      </div>
    </main>
  );
}
```

### Integration with Non-React Applications

For non-React applications, you have two options:

#### Option 1: Embed as a Standalone Application

1. Build the TriGo authentication module as a standalone Next.js app
2. Embed it in your application using an iframe or redirect users to it
3. Use cookies or localStorage to maintain session state between applications

#### Option 2: Convert to Your Framework

1. Use the design and logic as a reference
2. Recreate the components in your framework of choice (Vue, Angular, etc.)
3. Adapt the form handling and validation logic to your framework's patterns

## Customization

### Themes and Colors

Customize the color scheme by modifying the role-specific styling functions in `components/RoleCard.tsx` and `components/LoginForm.tsx`:

```typescript
function getRoleButtonBg(roleId: string): string {
  switch(roleId) {
    case 'passenger': return 'bg-orange-500/20';
    case 'trider': return 'bg-cyan-500/20'; 
    // Modify with your custom colors
    default: return 'bg-cyan-500/20';
  }
}
```

### Branding

To customize the branding:

1. Update the `Logo.tsx` component with your own logo and branding
2. Modify the color schemes in the CSS variables
3. Update the background animation colors in `BackgroundAnimation.tsx`

## Best Practices for Integration

1. **Authentication State Management**: Use a global state management solution (React Context, Redux, Zustand) to manage authentication state
2. **Route Protection**: Implement route guards to protect authenticated routes
3. **Token Management**: Securely store and refresh authentication tokens
4. **Error Handling**: Provide clear error messages for authentication failures
5. **Accessibility**: Ensure all components meet WCAG accessibility standards
6. **Responsive Design**: Test on various screen sizes to ensure proper display

## License

MIT