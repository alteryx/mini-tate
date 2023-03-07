// Copyright (c) 2023 Alteryx, Inc. All rights reserved.

import { ThemeProvider } from '@mui/material';
import React from 'react';
import { Provider } from 'react-redux';

import { store } from '../store/store';

import { ImageAnnotator } from './ImageAnnotator';

import theme from '../theme';

export function ImageAnnotatorWrapper(props) {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <ImageAnnotator {...props} />
      </Provider>
    </ThemeProvider>
  );
}
