"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ModeToggle from './ModeToggle';
import ThemeToggle from './ThemeToggle';

export default function Nav() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated) {
          setUser(data);
        }
      } catch (err) {
        console.error('Auth check failed', err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

  if (loading) {
    return (
      <nav className="bg-base-200 p-4 flex items-center justify-between">
        <div className="flex space-x-6">
          <span>Loading...</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-base-200 p-4 flex items-center justify-between shadow-lg">
      <ul className="flex space-x-6">
        <li>
          <Link href="/buildings" className="link link-hover">
            Buildings
          </Link>
        </li>
        <li>
          <Link href="/reports" className="link link-hover">
            Reports
          </Link>
        </li>
        {user?.is_admin && (
          <li>
            <Link href="/admin/users" className="link link-hover">
              Admin
            </Link>
          </li>
        )}
      </ul>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <ModeToggle />
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm">
              {user.username}
              {user.is_admin && <span className="ml-1 text-xs opacity-70">(Admin)</span>}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-ghost"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
