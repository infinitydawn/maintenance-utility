import './globals.css'
import Link from 'next/link';
import { ModeProvider } from './ui/ModeContext';
import ModeToggle from './ui/ModeToggle';
import Nav from './ui/Nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ModeProvider>
          <Nav />
          <main>{children}</main>
        </ModeProvider>
      </body>
    </html>
  )
}