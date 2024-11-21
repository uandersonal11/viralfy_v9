import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ViralFy - Dashboard',
  description: 'Transforme seu canal com IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen bg-[#101214]">
            <Sidebar />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster 
            theme="light"
            closeButton
            richColors
            toastOptions={{
              className: 'rounded-xl shadow-lg border-2',
              style: {
                background: 'white',
                border: '2px solid rgba(0,0,0,0.05)',
              }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}