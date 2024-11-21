import { toast } from 'sonner';
import { LucideIcon } from 'lucide-react';

interface NotificationProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
}

export const notifications = {
  success: ({ title, description, icon: Icon }: NotificationProps) => {
    toast.success(description || title, {
      className: 'bg-white border-2 border-green-500/10',
      position: 'top-right',
      duration: 3000,
      icon: Icon ? <Icon className="w-5 h-5 text-green-500" /> : undefined,
    });
  },

  error: ({ title, description, icon: Icon }: NotificationProps) => {
    toast.error(description || title, {
      className: 'bg-white border-2 border-red-500/10',
      position: 'top-right',
      duration: 5000,
      icon: Icon ? <Icon className="w-5 h-5 text-red-500" /> : undefined,
    });
  },

  info: ({ title, description, icon: Icon }: NotificationProps) => {
    toast.info(description || title, {
      className: 'bg-white border-2 border-blue-500/10',
      position: 'top-right',
      duration: 3000,
      icon: Icon ? <Icon className="w-5 h-5 text-blue-500" /> : undefined,
    });
  },

  loading: ({ title, description, icon: Icon }: NotificationProps) => {
    return toast.loading(description || title, {
      className: 'bg-white border-2 border-blue-500/10',
      position: 'top-right',
      icon: Icon ? <Icon className="w-5 h-5 text-blue-500 animate-spin" /> : undefined,
    });
  },
};