"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ModeToggle from './ModeToggle';
import ThemeToggle from './ThemeToggle';

export default function Nav() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated) setUser(data);
      } catch (err) {
        console.error('Auth check failed', err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  // close mobile menu on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const panel = document.getElementById('mobile-nav-panel');
      const toggle = document.getElementById('mobile-nav-toggle');
      if (!panel) return;
      if (toggle && toggle.contains(target)) return;
      if (!panel.contains(target)) setMobileOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
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
      <nav className="bg-base-200 p-4">
        <div className="container mx-auto">Loading...</div>
      </nav>
    );
  }

  return (
    <nav className="bg-base-200 p-4 shadow-lg">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold">Maintenance</Link>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center space-x-6">
            <li>
              <Link href="/buildings" className="link link-hover">Buildings</Link>
            </li>
            <li>
              <Link href="/reports" className="link link-hover">Reports</Link>
            </li>
            {user?.is_admin && (
              <li>
                <Link href="/admin/users" className="link link-hover">Admin</Link>
              </li>
            )}
          </ul>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <div className="mr-2">
            <ThemeToggle />
          </div>

          <div className="hidden md:block">
            <ModeToggle />
          </div>

          {/* User menu (desktop) */}
          {user ? (
            <div className="relative hidden md:block">
              <div className="flex items-center gap-3">
                <span className="text-sm">{user.username}</span>
                {user.is_admin && <span className="text-xs opacity-70">(Admin)</span>}
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="btn btn-sm">Login</Link>
          )}

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button id="mobile-nav-toggle" aria-label="Toggle menu" className="btn btn-ghost btn-square" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      <div id="mobile-nav-panel" className={`md:hidden transition-max-h duration-200 overflow-hidden ${mobileOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="p-4 bg-base-100">
          <ul className="flex flex-col space-y-2">
            <li>
              <Link href="/buildings" className="block link link-hover" onClick={() => setMobileOpen(false)}>Buildings</Link>
            </li>
            <li>
              <Link href="/reports" className="block link link-hover" onClick={() => setMobileOpen(false)}>Reports</Link>
            </li>
            {user?.is_admin && (
              <li>
                <Link href="/admin/users" className="block link link-hover" onClick={() => setMobileOpen(false)}>Admin</Link>
              </li>
            )}
          </ul>

          <div className="mt-4">
            <ModeToggle />
          </div>

          {user && (
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-sm">{user.username}</div>
                {user.is_admin && <div className="text-xs opacity-70">Admin</div>}
              </div>
              <div>
                <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="btn btn-ghost btn-sm">Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

