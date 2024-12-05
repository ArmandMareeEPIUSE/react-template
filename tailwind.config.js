/** @type {import('tailwindcss').Config} */
import withMT from '@material-tailwind/react/utils/withMT';

export default withMT({
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      'eu-blue': '#041744',
      'eu-red': '#CE1443',
      'eu-heading': '#184586',
      'eu-body': '#000000',
    },
    extend: {},
  },
  plugins: [],
});
