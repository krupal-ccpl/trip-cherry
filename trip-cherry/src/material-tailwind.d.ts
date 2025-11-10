declare module '@material-tailwind/react' {
  import { ComponentType, ReactNode } from 'react';

  export interface BaseProps {
    children?: ReactNode;
    className?: string;
    placeholder?: unknown;
    onPointerEnterCapture?: unknown;
    onPointerLeaveCapture?: unknown;
  }

  export const ThemeProvider: ComponentType<BaseProps>;
  export const Card: ComponentType<BaseProps & { color?: string; shadow?: boolean }>;
  export const CardBody: ComponentType<BaseProps>;
  export const Input: ComponentType<BaseProps & { 
    label?: string; 
    size?: string; 
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    required?: boolean;
    crossOrigin?: unknown;
    min?: string;
    max?: string;
    disabled?: boolean;
  }>;
  export const Checkbox: ComponentType<BaseProps & { 
    label?: ReactNode;
    crossOrigin?: unknown;
  }>;
  export const Button: ComponentType<BaseProps & { 
    type?: string;
    color?: string;
    variant?: string;
    onClick?: () => void;
  }>;
  export const Typography: ComponentType<BaseProps & { 
    variant?: string;
    color?: string;
  }>;
  export const Navbar: ComponentType<BaseProps & { 
    color?: string;
    fullWidth?: boolean;
  }>;
  export const IconButton: ComponentType<BaseProps & { 
    variant?: string;
    color?: string;
  }>;
  export const List: ComponentType<BaseProps>;
  export const ListItem: ComponentType<BaseProps>;
  export const ListItemPrefix: ComponentType<BaseProps>;
  export const Chip: ComponentType<BaseProps & { 
    size?: string;
    value?: string;
    color?: string;
  }>;
}
