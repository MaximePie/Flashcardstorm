import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.js$/), module);
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free';
