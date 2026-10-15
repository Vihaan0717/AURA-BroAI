import React, { useEffect, useRef } from 'react';
import { SearchMode } from '@private-browser/shared';
import {
  Globe,
  Sparkles,
  ShoppingBag,
  Film,
  Image as ImageIcon,
  MessageSquare,
  Laptop,
  ShieldCheck,
  Code,
  Lightbulb,
  Check,
} from 'lucide-react';

interface ToolsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeMode: SearchMode;
  onSelectMode: (mode: SearchMode) => void;
}

export const ToolsMenu: React.FC<ToolsMenuProps> = ({
  isOpen,
  onClose,
  activeMode,
  onSelectMode,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !target.closest?.('[data-tools-trigger="true"]')
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Exact menu items modeled after Reference Image 4
  const menuItems: {
    id: SearchMode;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'images',
      label: 'Create an image',
      icon: <ImageIcon className="w-4 h-4" />,
    },
    {
      id: 'search',
      label: 'Search the web',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      id: 'companion',
      label: 'Write code & Antigravity',
      icon: <Code className="w-4 h-4" />,
    },
    {
      id: 'deep_research',
      label: 'Run deep research',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'chat',
      label: 'Think longer',
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      id: 'shopping',
      label: 'Shopping comparisons',
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      id: 'entertainment',
      label: 'Movies & entertainment',
      icon: <Film className="w-4 h-4" />,
    },
    {
      id: 'privacy',
      label: 'Privacy & zero telemetry',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute bottom-full mb-3 left-0 sm:left-4 w-[250px] sm:w-[270px] liquid-menu rounded-2xl p-2 z-50 animate-scale-in"
      role="menu"
      aria-label="Intelligence workflow tools"
    >
      <div className="space-y-1">
        {menuItems.map((item) => {
          const isSelected = activeMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectMode(item.id);
                onClose();
              }}
              role="menuitem"
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                isSelected
                  ? 'bg-white text-zinc-950 shadow-md font-semibold ring-1 ring-black/5 dark:ring-white/20'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={isSelected ? 'text-zinc-950' : 'text-zinc-500 dark:text-zinc-400'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-zinc-950 flex-shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
