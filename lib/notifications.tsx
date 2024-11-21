'use client';

import { toast } from 'sonner';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface NotificationProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
}

const IconWrapper = ({ Icon }: { Icon: LucideIcon }) => (
  <Icon className="w-5 h-5" />
);

export const notifications = {
  success: ({ title, description, icon: Icon }: NotificationProps) => {
    toast.success(description || title, {
      className: 'bg-white border-2 border-green-500/10',
      position: 'top-right',
      duration: 3000,
      icon: Icon && <IconWrapper Icon={Icon} />,
    });
  },

  error: ({ title, description, icon: Icon }: NotificationProps) => {
    toast.error(description || title, {
      className: 'bg-white border-2 border-red-500/10',
      position: 'top-right',
      duration: 5000,
      icon: Icon && <IconWrapper Icon={Icon} />,
    });
  },

  info: ({ title, description, icon: Icon }: NotificationProps) => {
    toast.info(description || title, {
      className: 'bg-white border-2 border-blue-500/10',
      position: 'top-right',
      duration: 3000,
      icon: Icon && <IconWrapper Icon={Icon} />,
    });
  },

  loading: ({ title, description, icon: Icon }: NotificationProps) => {
    return toast.loading(description || title, {
      className: 'bg-white border-2 border-blue-500/10',
      position: 'top-right',
      icon: Icon && (
        <div className="animate-spin">
          <IconWrapper Icon={Icon} />
        </div>
      ),
    });
  },
};