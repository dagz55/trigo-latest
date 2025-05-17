# Required Modules

## Core Dependencies
- next: ^14.2.28
- react: ^18
- react-dom: ^18
- typescript: ^5

## UI and Styling
- tailwindcss: ^3.4.17
- @radix-ui/* components:
  - react-accordion: ^1.2.2
  - react-alert-dialog: ^1.1.4
  - react-avatar: ^1.1.2
  - react-dialog: ^1.1.4
  - react-dropdown-menu: ^2.1.4
  - react-label: ^2.1.1
  - react-separator: ^1.1.1
  - react-slot: ^1.1.1
  - react-toast: ^1.2.4
- class-variance-authority: ^0.7.1
- clsx: ^2.1.1
- tailwind-merge: ^2.5.5
- tailwindcss-animate: ^1.0.7
- lucide-react: ^0.454.0

## Authentication and Database
- @supabase/ssr: ^0.6.1

## Form Handling and Validation
- react-hook-form: ^7.54.1
- @hookform/resolvers: ^3.9.1
- zod: ^3.24.1

## UI Components and Utilities
- next-themes: latest
- sonner: ^1.7.1
- date-fns: 4.1.0
- recharts: 2.15.0

## Development Dependencies
- @types/node: ^22
- @types/react: ^18
- @types/react-dom: ^18
- postcss: ^8
- autoprefixer: ^10.4.20

## Installation

```bash
# Install all dependencies
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

## Additional Setup Required

1. Configure Tailwind CSS:
   ```bash
   npx tailwindcss init -p
   ```

2. Setup next-themes provider in your layout:
   ```tsx
   import { ThemeProvider } from 'next-themes'
   
   export default function RootLayout({ children }) {
     return (
       <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
         {children}
       </ThemeProvider>
     )
   }
   ```

3. Configure Supabase environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```