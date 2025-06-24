export interface ColorPalette {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  success: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };
  warning: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };
  error: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };
  info: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };
}

export interface Typography {
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

export interface Spacing {
  px: string;
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
  40: string;
  48: string;
  56: string;
  64: string;
}

export interface BorderRadius {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface Shadows {
  xs: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

export interface Theme {
  name: string;
  colors: {
    primary: Record<string, string>;
    secondary: Record<string, string>;
    neutral: Record<string, string>;
    success: Record<string, string>;
    warning: Record<string, string>;
    error: Record<string, string>;
  };
  isDark: boolean;
}

export interface ComponentVariant {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

export interface AccessibilityFeatures {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  focusVisible: boolean;
}

export class DesignSystem {
  private static currentTheme: Theme;
  private static accessibilitySettings: AccessibilityFeatures = {
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    focusVisible: true,
  };

  static readonly lightTheme: Theme = {
    name: 'light',
    isDark: false,
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      },
      secondary: {
        50: '#f8fafc',
        500: '#64748b',
        600: '#475569',
      },
      neutral: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        500: '#71717a',
        900: '#18181b',
      },
      success: {
        50: '#f0fdf4',
        500: '#22c55e',
        600: '#16a34a',
      },
      warning: {
        50: '#fffbeb',
        500: '#f59e0b',
        600: '#d97706',
      },
      error: {
        50: '#fef2f2',
        500: '#ef4444',
        600: '#dc2626',
      },
    },
  };

  static readonly darkTheme: Theme = {
    name: 'dark',
    isDark: true,
    colors: {
      primary: {
        50: '#1e3a8a',
        500: '#93c5fd',
        600: '#bfdbfe',
        700: '#dbeafe',
      },
      secondary: {
        50: '#0f172a',
        500: '#94a3b8',
        600: '#cbd5e1',
      },
      neutral: {
        50: '#18181b',
        100: '#27272a',
        200: '#3f3f46',
        500: '#a1a1aa',
        900: '#fafafa',
      },
      success: {
        50: '#14532d',
        500: '#22c55e',
        600: '#4ade80',
      },
      warning: {
        50: '#92400e',
        500: '#f59e0b',
        600: '#fbbf24',
      },
      error: {
        50: '#991b1b',
        500: '#ef4444',
        600: '#f87171',
      },
    },
  };

  static getCurrentTheme(): Theme {
    return this.darkTheme; // Always return dark theme
  }

  static setTheme(): void {
    // No-op function since theme is permanently dark
  }

  static toggleTheme(): void {
    // No-op function since theme is permanently dark
  }

  static getAccessibilitySettings(): AccessibilityFeatures {
    return { ...this.accessibilitySettings };
  }

  static updateAccessibilitySettings(settings: Partial<AccessibilityFeatures>): void {
    this.accessibilitySettings = { ...this.accessibilitySettings, ...settings };
    if (typeof window !== 'undefined') {
      localStorage.setItem('emma-accessibility', JSON.stringify(this.accessibilitySettings));
    }
  }
}

export default DesignSystem; 