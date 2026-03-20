'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, MessageSquare, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/fleet', label: 'Fleet', icon: LayoutDashboard },
    { href: '/maintenance', label: 'Maintenance', icon: LayoutDashboard },
    { href: '/optimization', label: 'Optimization', icon: LayoutDashboard },
    { href: '/analytics', label: 'Analytics', icon: LayoutDashboard },
    { href: '/copilot', label: 'AI Co-Pilot', icon: MessageSquare },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-card border-b border-border sticky top-0 z-50 px-4 h-16 overflow-x-auto">
        <Link href="/" className="flex items-center gap-2 mr-8 flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">⚡</span>
          </div>
          <span className="font-bold text-lg">WindFlow</span>
        </Link>

        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex-shrink-0">
                <Button
                  variant={isActive(item.href) ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2 text-xs"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        <Button variant="outline" size="sm" className="gap-2 flex-shrink-0">
          <Settings className="w-4 h-4" />
          <span className="hidden lg:inline">Settings</span>
        </Button>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-50 h-16 flex items-center px-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-muted rounded-lg"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link href="/" className="flex items-center gap-2 ml-4 flex-1">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">⚡</span>
          </div>
          <span className="font-bold">WindFlow</span>
        </Link>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-card border-b border-border p-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                <Button
                  variant={isActive(item.href) ? 'default' : 'ghost'}
                  className="w-full justify-start gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      )}

      {/* Mobile spacing */}
      <div className="md:hidden h-16" />
    </>
  );
}
