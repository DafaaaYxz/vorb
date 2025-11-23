export interface Message {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface StatItem {
  label: string;
  value: string;
  icon: string;
}

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}