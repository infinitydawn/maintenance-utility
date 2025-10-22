import './globals.css'
import Link from 'next/link';
import { ModeProvider } from './ui/ModeContext';
import ModeToggle from './ui/ModeToggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ModeProvider>
          <nav className="bg-gray-800 p-4 flex items-center">
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="text-white hover:text-gray-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white hover:text-gray-300">
                  About
                </Link>
              </li>
              <li>
                <Link href="/buildings" className="text-white hover:text-gray-300">
                  Buildings
                </Link>
              </li>
            </ul>
            <ModeToggle />
          </nav>
          <main>{children}</main>
        </ModeProvider>
      </body>
    </html>
  )
}