import React from 'react';
import { action } from '@storybook/addon-actions';
import Button from '../resources/js/components/molecule/Button';

export default {
  title: 'Button',
};

export const PrimaryButton = () => (
  <Button text="My way" onClick={action('clicked')}/>
);
