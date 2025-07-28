'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useRouter, usePathname } from 'next/navigation';
import {
  BarChart3,
  Target,
  Users,
  TrendingUp,
  Settings,
  HelpCircle,
  Home,
  Calendar,
  FileText,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Overview', icon: Home, href: '/' },
  { name: 'Analytics', icon: BarChart3, href: '/analytics' },
  { name: 'Campaigns', icon: Target, href: '/campaigns' },
  { name: 'Audience', icon: Users, href: '/audience' },
  { name: 'Performance', icon: TrendingUp, href: '/performance' },
  { name: 'Calendar', icon: Calendar, href: '/calendar' },
  { name: 'Reports', icon: FileText, href: '/reports' },
];

const secondaryNavigation = [
  { name: 'Settings', icon: Settings },
  { name: 'Help', icon: HelpCircle },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose(); // Close mobile sidebar after navigation
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">ADmyBRAND</h1>
            <p className="text-xs text-muted-foreground">Insights</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto md:hidden"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-10 px-3",
                  isActive && "bg-secondary text-secondary-foreground"
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            );
          })}
        </nav>

        <div className="mt-8 pt-4 border-t">
          <nav className="space-y-1">
            {secondaryNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="w-full justify-start h-10 px-3"
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-card border-r">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}