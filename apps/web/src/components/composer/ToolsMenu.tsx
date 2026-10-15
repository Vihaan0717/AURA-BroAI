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
  Check,
} from 'lucide-react';

interface ToolsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeMode: SearchMode;
  onSelectMode: (mode: SearchMode) => void;
}

interface MenuGroup {
  groupName: string;
  items: {
    id: SearchMode;
    label: string;
    icon: React.ReactNode;
  }[];
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

  // Grouped logically according to Milestone 2 Section 7 requirements
  const menuGroups: MenuGroup[] = [
    {
      groupName: 'Research',
      items: [
        {
          id: 'search',
          label: 'General Search',
          icon: <Globe className="w-3.5 h-3.5" />,
        },
        {
          id: 'deep_research',
          label: 'Deep Research (Multi-Source)',
          icon: <Sparkles className="w-3.5 h-3.5" />,
        },
        {
          id: 'images',
          label: 'Images Only (Web Photos)',
          icon: <ImageIcon className="w-3.5 h-3.5" />,
        },
      ],
    },
    {
      groupName: 'Personal Assistant',
      items: [
        {
          id: 'chat',
          label: 'AI Chat & Planning',
          icon: <MessageSquare className="w-3.5 h-3.5" />,
        },
      ],
    },
    {
      groupName: 'Specialized Tasks',
      items: [
        {
          id: 'shopping',
          label: 'Shopping Comparisons',
          icon: <ShoppingBag className="w-3.5 h-3.5" />,
        },
        {
          id: 'entertainment',
          label: 'Movies & Streaming',
          icon: <Film className="w-3.5 h-3.5" />,
        },
      ],
    },
    {
      groupName: 'Device & Safety',
      items: [
        {
          id: 'companion',
          label: 'Antigravity Companion',
          icon: <Laptop className="w-3.5 h-3.5" />,
        },
        {
          id: 'privacy',
          label: 'Privacy & Isolation',
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
        },
      ],
    },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute bottom-full mb-3 left-0 sm:left-4 w-[260px] sm:w-[280px] liquid-menu rounded-2xl p-2 z-50 animate-scale-in max-h-[420px] overflow-y-auto no-scrollbar shadow-2xl"
      role="menu"
      aria-label="Intelligence workflow tools"
    >
      <div className="space-y-2">
        {menuGroups.map((group, gIdx) => (
          <div key={group.groupName} className={gIdx > 0 ? 'pt-1 border-t border-black/5 dark:border-white/5' : ''}>
            <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-2.5 py-1">
              {group.groupName}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isSelected = activeMode === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectMode(item.id);
                      onClose();
                    }}
                    role="menuitem"
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all text-left ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={isSelected ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
