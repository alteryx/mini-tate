// Copyright (c) 2022 Alteryx, Inc. All rights reserved.

import React from 'react';
import { Provider } from 'react-redux';

import { store } from '../store/store';

import { ImageAnnotator } from './ImageAnnotator';

export function ImageAnnotatorWrapper(props) {
  return (
    <Provider store={store}>
      <ImageAnnotator {...props} />
    </Provider>
  );
}
