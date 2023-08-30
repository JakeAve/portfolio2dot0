import { Options } from "$fresh/plugins/twind.ts";
import * as colors from "twind/colors";

export default {
  selfURL: import.meta.url,
  theme: {
    fontFamily: {
      'display': ['Raleway Dots', 'cursive'],
      'retro': ['Monoton', 'cursive'],
      'techno': ['Handjet', 'cursive'],
      'sans': ['Lato', 'sans-serif'],
      'serif': ['Belgrano', 'serif']
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
    }
  }
} as Options;
