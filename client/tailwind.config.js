/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-main': 'var(--bg-main)',
        'bg-secondary': 'var(--bg-secondary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'dark-purple': 'var(--dark-purple)',
        'medium-purple': 'var(--medium-purple)',
        'primary': 'var(--primary)',
        secondary: '#FFB5D8',
        'light-pink': '#FFE4E1',
        'pale-yellow': '#FFF4D2',
        'soft-blue': '#D4F1F4',
        'lilac-purple': '#E8D5E4',
        'sky-blue': '#6BBBFF',
      },
      fontFamily: {
        'pacifico': ['Pacifico', 'cursive'],
        'quicksand': ['Quicksand', 'sans-serif'],
      },
      borderRadius: {
        'none': '0px',
        'sm': '4px',
        DEFAULT: '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        'full': '9999px',
        'button': '8px'
      },
      backgroundImage: {
        'hero-pattern': "url('https://readdy.ai/api/search-image?query=soft%2520lilac%2520background%2520with%2520delicate%2520plaid%2520pattern%2520and%2520scattered%2520tiny%2520bows%2520and%2520miniature%2520pastel%2520flowers.%2520The%2520left%2520side%2520is%2520lighter%2520and%2520clearer%2520for%2520text%2520placement%2C%2520while%2520the%2520right%2520side%2520has%2520more%2520decorative%2520elements.%2520The%20overall%20aesthetic%20is%20soft%2C%20dreamy%2C%20and%20feminine%20with%20a%20pastel%20color%20palette.&width=1200&height=600&seq=1&orientation=landscape')",
        'featured-pattern': "url('https://readdy.ai/api/search-image?query=extremely%20soft%20gradient%20background%20transitioning%20from%20very%20light%20pink%20to%20light%20blue%2C%20decorated%20with%20tiny%2C%20blurred%20bows%20and%20hearts%20scattered%20throughout.%20The%20pattern%20is%20very%20subtle%20and%20dreamy%2C%20creating%20an%20ethereal%20and%20delicate%20atmosphere.%20The%20hearts%20and%20bows%20are%20semi-transparent%20and%20barely%20visible%2C%20floating%20in%20a%20dreamy%20manner%20across%20the%20gentle%20gradient&width=1200&height=600&seq=4&orientation=landscape')",
        'arrivals-pattern': "url('https://readdy.ai/api/search-image?query=extremely%20soft%20and%20blurry%20miniature%20flowers%20scattered%20across%20a%20pure%20white%20background%2C%20creating%20a%20very%20subtle%20and%20delicate%20pattern.%20The%20flowers%20are%20in%20pastel%20lilac%2C%20pink%2C%20and%20blue%20tones%2C%20barely%20visible%20and%20creating%20an%20ethereal%2C%20dreamy%20effect.%20The%20overall%20look%20is%20very%20light%20and%20airy%20with%20minimal%20contrast&width=1200&height=600&seq=3&orientation=landscape')",
      }
    },
  },
  plugins: [],
}

