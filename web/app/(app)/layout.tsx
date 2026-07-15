import { Header } from "@/components/layout/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-background">
      <Header />
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
