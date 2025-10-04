// Modern Dark Theme Configuration
export const darkTheme = {
    colors: {
        // Primary brand colors
        primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
        },
        // Dark theme base colors
        dark: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
        },
        // Background variations
        bg: {
            primary: '#0f172a',
            secondary: '#1e293b',
            tertiary: '#334155',
            elevated: '#475569',
            glass: 'rgba(15, 23, 42, 0.8)',
        },
        // Text colors
        text: {
            primary: '#f8fafc',
            secondary: '#e2e8f0',
            tertiary: '#94a3b8',
            muted: '#64748b',
        },
        // Status colors
        success: {
            light: '#10b981',
            main: '#059669',
            dark: '#047857',
        },
        warning: {
            light: '#f59e0b',
            main: '#d97706',
            dark: '#b45309',
        },
        error: {
            light: '#ef4444',
            main: '#dc2626',
            dark: '#b91c1c',
        },
        info: {
            light: '#06b6d4',
            main: '#0891b2',
            dark: '#0e7490',
        },
        // Gradient combinations
        gradients: {
            primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            purple: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        }
    },
    // Typography scale
    typography: {
        fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
        },
        fontWeight: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            extrabold: '800',
        }
    },
    // Spacing system
    spacing: {
        px: '1px',
        0.5: '0.125rem',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        6: '1.5rem',
        8: '2rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        32: '8rem',
    },
    // Border radius
    borderRadius: {
        none: '0',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '50%',
    },
    // Shadows
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    }
};
// CSS variables for dynamic theming
export const cssVars = `
  :root {
    --color-bg-primary: ${darkTheme.colors.bg.primary};
    --color-bg-secondary: ${darkTheme.colors.bg.secondary};
    --color-bg-tertiary: ${darkTheme.colors.bg.tertiary};
    --color-bg-elevated: ${darkTheme.colors.bg.elevated};
    --color-bg-glass: ${darkTheme.colors.bg.glass};
    
    --color-text-primary: ${darkTheme.colors.text.primary};
    --color-text-secondary: ${darkTheme.colors.text.secondary};
    --color-text-tertiary: ${darkTheme.colors.text.tertiary};
    --color-text-muted: ${darkTheme.colors.text.muted};
    
    --color-primary: ${darkTheme.colors.primary[500]};
    --color-primary-hover: ${darkTheme.colors.primary[600]};
    
    --gradient-primary: ${darkTheme.colors.gradients.primary};
    --gradient-success: ${darkTheme.colors.gradients.success};
    --gradient-warning: ${darkTheme.colors.gradients.warning};
    --gradient-purple: ${darkTheme.colors.gradients.purple};
  }
`;
