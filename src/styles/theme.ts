// Premium Pure Black Theme with Neon Accents
export const premiumBlackTheme = {
  colors: {
    // Pure black base with neon accents
    primary: {
      50: '#00ffff',   // Bright cyan
      100: '#00e6e6',  // Light cyan
      200: '#00cccc',  // Medium cyan
      300: '#00b3b3',  // Darker cyan
      400: '#009999',  // Deep cyan
      500: '#008080',  // Teal cyan
      600: '#006666',  // Dark teal
      700: '#004d4d',  // Very dark teal
      800: '#003333',  // Almost black teal
      900: '#001a1a',  // Black with cyan tint
    },
    // Pure black hierarchy
    dark: {
      50: '#ffffff',   // Pure white
      100: '#f0f0f0',  // Very light gray
      200: '#d0d0d0',  // Light gray
      300: '#a0a0a0',  // Medium gray
      400: '#707070',  // Dark gray
      500: '#404040',  // Very dark gray
      600: '#2a2a2a',  // Almost black
      700: '#1a1a1a',  // Very black
      800: '#0d0d0d',  // Pure black+
      900: '#000000',  // Absolute black
    },
    // Background variations - Pure black system
    bg: {
      primary: '#000000',                      // Absolute black
      secondary: '#0a0a0a',                   // Slight black lift
      tertiary: 'rgba(0, 0, 0, 0.95)',       // Semi-transparent black
      elevated: 'rgba(0, 255, 255, 0.05)',   // Black with cyan hint
      glass: 'rgba(0, 0, 0, 0.8)',          // Glass black
      card: 'rgba(0, 0, 0, 0.6)',           // Card background
      modal: 'rgba(0, 0, 0, 0.9)',          // Modal background
    },
    // Text colors - Neon system
    text: {
      primary: '#ffffff',     // Pure white
      secondary: '#00ffff',   // Neon cyan
      tertiary: '#cccccc',    // Light gray
      muted: '#808080',       // Muted gray
      accent: '#ff00ff',      // Neon magenta
      gradient: 'linear-gradient(90deg, #00ffff 0%, #ff00ff 100%)',
    },
    // Neon accent colors
    neon: {
      cyan: '#00ffff',
      magenta: '#ff00ff',
      purple: '#8a2be2',
      blue: '#0066ff',
      green: '#00ff00',
      pink: '#ff1493',
      orange: '#ff4500',
    },
    // Status colors - Neon versions
    success: {
      light: '#00ff88',
      main: '#00cc66',
      dark: '#009944',
      neon: '#00ff00',
    },
    warning: {
      light: '#ffaa00',
      main: '#ff8800',
      dark: '#cc6600',
      neon: '#ffff00',
    },
    error: {
      light: '#ff4444',
      main: '#ff0000',
      dark: '#cc0000',
      neon: '#ff0040',
    },
    info: {
      light: '#00ccff',
      main: '#00aaff',
      dark: '#0088cc',
      neon: '#00ffff',
    },
    // Premium gradient combinations
    gradients: {
      primary: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
      secondary: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      success: 'linear-gradient(135deg, #00ff00 0%, #00cc88 100%)',
      warning: 'linear-gradient(135deg, #ffaa00 0%, #ff6600 100%)',
      error: 'linear-gradient(135deg, #ff0040 0%, #cc0030 100%)',
      purple: 'linear-gradient(135deg, #8a2be2 0%, #ff00ff 100%)',
      cyber: 'linear-gradient(45deg, #000000 0%, #00ffff 25%, #ff00ff 50%, #00ffff 75%, #000000 100%)',
      matrix: 'linear-gradient(180deg, #000000 0%, #003300 50%, #000000 100%)',
      neon: 'linear-gradient(90deg, #00ffff 0%, #ff00ff 50%, #00ffff 100%)',
    }
  },
  // Premium typography system
  typography: {
    fontFamily: {
      sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      display: ['Orbitron', 'Inter', 'sans-serif'], // Futuristic font for headers
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
      '6xl': '3.75rem',
      '7xl': '4.5rem',
    },
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    }
  },
  // Spacing system
  spacing: {
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  // Modern border radius
  borderRadius: {
    none: '0',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '50%',
  },
  // Premium shadows with neon effects
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
    glass: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
    // Neon glow effects
    neonCyan: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
    neonMagenta: '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff',
    neonPurple: '0 0 10px #8a2be2, 0 0 20px #8a2be2, 0 0 30px #8a2be2',
    neonGreen: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00',
    softGlow: '0 0 20px rgba(0, 255, 255, 0.3)',
    strongGlow: '0 0 40px rgba(0, 255, 255, 0.6)',
    cardGlow: '0 4px 20px rgba(0, 255, 255, 0.15)',
  },
  // Animation and effects
  animations: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '1000ms',
    },
    easings: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    }
  }
}

// Export theme as default for consistency
export const darkTheme = premiumBlackTheme;

// CSS variables for premium black theming
export const cssVars = `
  :root {
    /* Background colors */
    --color-bg-primary: ${premiumBlackTheme.colors.bg.primary};
    --color-bg-secondary: ${premiumBlackTheme.colors.bg.secondary};
    --color-bg-tertiary: ${premiumBlackTheme.colors.bg.tertiary};
    --color-bg-elevated: ${premiumBlackTheme.colors.bg.elevated};
    --color-bg-glass: ${premiumBlackTheme.colors.bg.glass};
    --color-bg-card: ${premiumBlackTheme.colors.bg.card};
    --color-bg-modal: ${premiumBlackTheme.colors.bg.modal};
    
    /* Text colors */
    --color-text-primary: ${premiumBlackTheme.colors.text.primary};
    --color-text-secondary: ${premiumBlackTheme.colors.text.secondary};
    --color-text-tertiary: ${premiumBlackTheme.colors.text.tertiary};
    --color-text-muted: ${premiumBlackTheme.colors.text.muted};
    --color-text-accent: ${premiumBlackTheme.colors.text.accent};
    --color-text-gradient: ${premiumBlackTheme.colors.text.gradient};
    
    /* Primary colors */
    --color-primary: ${premiumBlackTheme.colors.primary[500]};
    --color-primary-hover: ${premiumBlackTheme.colors.primary[600]};
    --color-primary-light: ${premiumBlackTheme.colors.primary[400]};
    --color-primary-dark: ${premiumBlackTheme.colors.primary[700]};
    
    /* Neon colors */
    --color-neon-cyan: ${premiumBlackTheme.colors.neon.cyan};
    --color-neon-magenta: ${premiumBlackTheme.colors.neon.magenta};
    --color-neon-purple: ${premiumBlackTheme.colors.neon.purple};
    --color-neon-green: ${premiumBlackTheme.colors.neon.green};
    --color-neon-blue: ${premiumBlackTheme.colors.neon.blue};
    --color-neon-pink: ${premiumBlackTheme.colors.neon.pink};
    
    /* Status colors */
    --color-success: ${premiumBlackTheme.colors.success.main};
    --color-success-neon: ${premiumBlackTheme.colors.success.neon};
    --color-warning: ${premiumBlackTheme.colors.warning.main};
    --color-warning-neon: ${premiumBlackTheme.colors.warning.neon};
    --color-error: ${premiumBlackTheme.colors.error.main};
    --color-error-neon: ${premiumBlackTheme.colors.error.neon};
    --color-info: ${premiumBlackTheme.colors.info.main};
    --color-info-neon: ${premiumBlackTheme.colors.info.neon};
    
    /* Gradients */
    --gradient-primary: ${premiumBlackTheme.colors.gradients.primary};
    --gradient-secondary: ${premiumBlackTheme.colors.gradients.secondary};
    --gradient-success: ${premiumBlackTheme.colors.gradients.success};
    --gradient-warning: ${premiumBlackTheme.colors.gradients.warning};
    --gradient-error: ${premiumBlackTheme.colors.gradients.error};
    --gradient-purple: ${premiumBlackTheme.colors.gradients.purple};
    --gradient-cyber: ${premiumBlackTheme.colors.gradients.cyber};
    --gradient-matrix: ${premiumBlackTheme.colors.gradients.matrix};
    --gradient-neon: ${premiumBlackTheme.colors.gradients.neon};
    
    /* Shadows */
    --shadow-sm: ${premiumBlackTheme.shadows.sm};
    --shadow-md: ${premiumBlackTheme.shadows.md};
    --shadow-lg: ${premiumBlackTheme.shadows.lg};
    --shadow-xl: ${premiumBlackTheme.shadows.xl};
    --shadow-2xl: ${premiumBlackTheme.shadows['2xl']};
    --shadow-glass: ${premiumBlackTheme.shadows.glass};
    --shadow-neon-cyan: ${premiumBlackTheme.shadows.neonCyan};
    --shadow-neon-magenta: ${premiumBlackTheme.shadows.neonMagenta};
    --shadow-neon-purple: ${premiumBlackTheme.shadows.neonPurple};
    --shadow-neon-green: ${premiumBlackTheme.shadows.neonGreen};
    --shadow-soft-glow: ${premiumBlackTheme.shadows.softGlow};
    --shadow-strong-glow: ${premiumBlackTheme.shadows.strongGlow};
    --shadow-card-glow: ${premiumBlackTheme.shadows.cardGlow};
    
    /* Animation durations */
    --duration-fast: ${premiumBlackTheme.animations.durations.fast};
    --duration-normal: ${premiumBlackTheme.animations.durations.normal};
    --duration-slow: ${premiumBlackTheme.animations.durations.slow};
    --duration-slower: ${premiumBlackTheme.animations.durations.slower};
    
    /* Animation easings */
    --ease-in-out: ${premiumBlackTheme.animations.easings.easeInOut};
    --ease-out: ${premiumBlackTheme.animations.easings.easeOut};
    --ease-in: ${premiumBlackTheme.animations.easings.easeIn};
    --ease-bounce: ${premiumBlackTheme.animations.easings.bounce};
  }
  
  /* Global base styles for premium black theme */
  body {
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    font-family: ${premiumBlackTheme.typography.fontFamily.sans.join(', ')};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  * {
    box-sizing: border-box;
  }
  
  /* Custom scrollbar for premium theme */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--color-bg-secondary);
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--color-neon-cyan);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-neon-magenta);
  }
`
