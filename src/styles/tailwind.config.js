const plugin = require('tailwindcss/plugin');

function pxToRem(size) {
  return `${size / 16}rem`;
}

module.exports = {
  purge: {
    content: [
      './src/site/**/*.njk',
      './src/scripts/**/*.ts',
      './src/functions/**/*.js'
    ],
    options: {
      safelist: [],
    },
  },
  theme: {
    borderWidth: {
      0: '0px',
      1: '1px',
      2: '2px',
      3: '3px',
      4: '4px',
      5: '5px',
      6: '6px',
      7: '7px',
      8: '8px',
      9: '9px',
      10: '10px',
    },
    borderRadius: {
      0: '0px',
      1: '1px',
      2: '2px',
      3: '3px',
      4: '4px',
      5: '5px',
      full: '50%'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      tertiary: 'var(--color-tertiary)',
      background: 'var(--color-background)',
      foreground: 'var(--color-foreground)',
      danger: 'var(--color-danger)',
      success: 'var(--color-success)',
      grey: {
        DEFAULT: 'var(--color-grey)',
        fade: 'var(--color-grey-fade)',
        light: 'var(--color-grey-light)',
        border: 'var(--color-grey-border)',
        neutral: 'var(--color-grey-neutral)'
      },
      hover: {
        secondary: '#ffd98a'
      }
    },
    letterSpacing: {
      1: '1px',
      2: '2px',
      3: '3px'
    },
    lineHeight: {
      xxs: `clamp(${pxToRem(21)}, 1.641vw, ${pxToRem(23)})`,
      xs: `clamp(${pxToRem(23)}, 2.109vw, ${pxToRem(28)})`,
      sm: `clamp(${pxToRem(25)}, 2.266vw, ${pxToRem(32)})`,
      base: pxToRem(28),
      md: `clamp(${pxToRem(32)}, 2.813vw, ${pxToRem(36)})`,
      lg: `clamp(${pxToRem(36)}, 3.750vw, ${pxToRem(48)})`,
      xl: `clamp(${pxToRem(48)}, 4.375vw, ${pxToRem(56)})`,
    },
    minWidth: {
      1.5: '1.5rem',
      4: '4rem',
      6: '6rem',
      16: '16rem',
      24: '24rem',
      38: '38rem',
      full: '100%'
    },
    maxWidth: {
      18: '18rem',
      22: '22rem',
      32: '32rem',
      45: '45rem'
    },
    maxHeight: {
      10: '10rem',
      28: '28rem',
      40: '40rem',
      '70vh': '70vh'
    },
    outline: {
      transparent: '3px solid transparent',
      primary: '3px solid var(--color-primary)'
    },
    flex: {
      auto: '1 1 auto',
      initial: '0 1 auto',
      none: 'none',
      1: '1 1 0%',
      2: '2 2 0%',
      3: '3 3 0%'
    },
    fontSize: {
      xxs: `clamp(${pxToRem(12)}, 1.094vw, ${pxToRem(14)})`,
      xs: `clamp(${pxToRem(14)}, 1.250vw, ${pxToRem(16)})`,
      sm: `clamp(${pxToRem(16)}, 1.563vw, ${pxToRem(20)})`,
      base: pxToRem(16),
      md: `clamp(${pxToRem(20)}, 1.953vw, ${pxToRem(25)})`,
      lg: `clamp(${pxToRem(20)}, 2.344vw, ${pxToRem(30)})`,
      xl: `clamp(${pxToRem(30)}, 2.578vw, ${pxToRem(33)})`,
    },
    screens: {
      xs: '23.375rem',
      sm: '37.5rem',
      md: '48rem',
      lg: '62rem',
      xl: '87.5rem'
    },
    spacing: {
      0: 0,
      2: pxToRem(2),
      4: pxToRem(4),
      8: pxToRem(8),
      12: pxToRem(12),
      16: pxToRem(16),
      20: pxToRem(20),
      24: pxToRem(24),
      28: pxToRem(28),
      32: pxToRem(32),
      36: pxToRem(36),
      40: pxToRem(40),
      44: pxToRem(44),
      48: pxToRem(48),
      52: pxToRem(52),
      56: pxToRem(56),
      60: pxToRem(60),
      64: pxToRem(64),
      68: pxToRem(68),
      72: pxToRem(72),
      76: pxToRem(76),
      80: pxToRem(80),
      84: pxToRem(84),
      88: pxToRem(88),
      92: pxToRem(92),
      96: pxToRem(96),
      100: pxToRem(100),
      '5vw': '5vw',
      '50vh': '50vh'
    },
    transformOrigin: {
      '5-11': '5px 11px',
      '5-27': '5px 27px',
    },
    zIndex: {
      10: 10,
      20: 20,
      30: 30,
      40: 40,
      50: 50,
      60: 60,
      70: 70,
      80: 80,
      90: 90,
      100: 100,
      110: 110,
      120: 120
    },
    extend: {
      backgroundSize: {
        link: '0 2px',
        'link-full': '100% 2px'
      },
      backgroundPosition: {
        link: '0 100%'
      },
      cursor: {
        'zoom-in': 'zoom-in'
      },
      height: {
        1: pxToRem(1)
      },
      transitionProperty: {
        'background-size': 'background-size',
        height: 'height',
        width: 'width',
        visibility: 'visibility'
      },
      rotate: {
        135: '135deg'
      },
      screens: {
        hov: { 'raw': '(hover)' }
      },
      width: {
        search: 'calc(100% + 5vw)'
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['before', 'after', 'checked'],
      backgroundSize: ['focus', 'hover'],
      cursor: ['responsive'],
      display: ['before', 'after', 'empty'],
      height: ['before', 'after'],
      inset: ['before', 'after'],
      opacity: ['before', 'after'],
      position: ['before', 'after'],
      scale: ['group-hover'],
      transitionDuration: ['before', 'after'],
      transitionProperty: ['before', 'after'],
      transitionTimingFunction: ['before', 'after'],
      visibility: ['before', 'after', 'group-hover'],
      width: ['before', 'after', 'hover', 'hover_before'],
      zIndex: ['before', 'after']
    }
  },
  plugins: [
    plugin(({ addVariant, e }) => {
      addVariant('before', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`before${separator}${className}`)}::before`;
        })
      });
      addVariant('after', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`after${separator}${className}`)}::after`;
        })
      });
      addVariant('hover_before', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`hover${separator}before${separator}${className}`)}:hover::before`
        })
      });
      addVariant('empty', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`empty${separator}${className}`)}:empty`;
        })
      });
    })
  ],
};
