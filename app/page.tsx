import Logo from "@/components/Logo";
import RoleSelection from "@/components/RoleSelection";
import BackgroundAnimation from "@/components/BackgroundAnimation";

export default function Home() {
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