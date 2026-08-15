/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 主色调 - 奶油橙（品牌色 #d97757 落在 500）。首页 / 登录页 / 控制台同源。
        // 600 起满足小字 4.5:1，所以 text-primary-600 与 bg-primary-600 配白字都可用；
        // 500 是品牌原色，只用于描边、focus ring 与大号元素。
        primary: {
          50: '#fdf7f4',
          100: '#fbeae3',
          200: '#f6d5c8',
          300: '#eeb69f',
          400: '#e39471',
          500: '#d97757',
          600: '#b5562f',
          700: '#9c4726',
          800: '#7c3a20',
          900: '#5e2d19',
          950: '#33170d'
        },
        // 辅助色 - 暖中性灰，与 gray 同一支
        accent: {
          50: '#faf9f5',
          100: '#f4f1ea',
          200: '#e7e2d8',
          300: '#d3cdc0',
          400: '#a8a196',
          500: '#6f6a60',
          600: '#57534b',
          700: '#44403a',
          800: '#2c2a27',
          900: '#1c1b19',
          950: '#131211'
        },
        // 中性灰 - 暖色（偏 stone），与首页 #faf9f5 / #191817 / #6f6a60 同源。
        // 覆盖 Tailwind 默认的冷灰，全站 text-gray-* / bg-gray-* 一并转暖。
        gray: {
          50: '#faf9f5',
          100: '#f4f1ea',
          200: '#e7e2d8',
          300: '#d3cdc0',
          400: '#a8a196',
          500: '#6f6a60',
          600: '#57534b',
          700: '#44403a',
          800: '#2c2a27',
          900: '#1c1b19',
          950: '#131211'
        },
        // 深色模式色阶 - 逐档对应首页深色令牌：
        // 950 = --bg、900 = --surface、800 = --surface-2、700 = --border、
        // 600 = --border-2、400 = --dim、300 = --muted
        dark: {
          50: '#faf9f5',
          100: '#f4f1ea',
          200: '#e7e2d8',
          300: '#a8a29a',
          400: '#837d74',
          500: '#5c574f',
          600: '#454037',
          700: '#35322e',
          800: '#2c2a27',
          900: '#232220',
          950: '#1a1917'
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'SF Pro Display',
          'PingFang SC',
          'Hiragino Sans GB',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Microsoft YaHei',
          'sans-serif'
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.08)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.06)',
        glow: '0 0 20px rgba(217, 119, 87, 0.22)',
        'glow-lg': '0 0 40px rgba(217, 119, 87, 0.30)',
        card: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 40px rgba(0, 0, 0, 0.08)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #d97757 0%, #b5562f 100%)',
        'gradient-dark': 'linear-gradient(135deg, #27272a 0%, #18181b 100%)',
        'gradient-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'mesh-gradient':
          'radial-gradient(at 40% 20%, rgba(9, 9, 11, 0.06) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(9, 9, 11, 0.04) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(9, 9, 11, 0.05) 0px, transparent 50%)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(9, 9, 11, 0.18)' },
          '100%': { boxShadow: '0 0 30px rgba(9, 9, 11, 0.28)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
}
