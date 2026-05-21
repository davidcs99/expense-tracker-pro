import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'expenseTrackerTheme',
    themes: {
      expenseTrackerTheme: {
        dark: false,
        colors: {
          primary: '#4aa3df',
          secondary: '#8aa4bf',
          info: '#8ac6ea',
          success: '#6fa8d6',
          warning: '#8aa4bf',
          error: '#7f95ab',
          background: '#f5f7fc',
          surface: '#ffffff',
        },
      },
    },
  },
});
