import { Theme } from '@react-navigation/native';

export const NAV_THEME = {
  light: {
    background: 'hsl(0 0% 100%)', // background
    border: 'hsl(0 0% 89.8%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(0 84.2% 60.2%)', // destructive
    primary: 'hsl(0 0% 9%)', // primary
    text: 'hsl(240 10% 3.9%)', // foreground
    secondary: 'hsl(0 0% 96.1%)', //secondary
  },
  dark: {
    background: 'hsl(240 10% 3.9%)', // background
    border: 'hsl(0 0% 14.9%)', // border
    card: 'hsl(240 10% 3.9%)', // card
    notification: 'hsl(0 72% 51%)', // destructive
    primary: 'hsl(0 0% 98%)', // primary
    text: 'hsl(0 0% 98%)', // foreground
    secondary: 'hsl(0 0% 14.9%)', //secondary
  },
};

export const LIGHT_THEME: Theme & { colors: { secondary: string } } = {
  dark: false,
  colors: NAV_THEME.light,
};

export const DARK_THEME: Theme & { colors: { secondary: string } } = {
  dark: true,
  colors: NAV_THEME.dark,
};
