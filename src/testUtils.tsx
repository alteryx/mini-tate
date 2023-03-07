// Copyright (c) 2023 Alteryx, Inc. All rights reserved.

import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import modeReducer from './store/reducers/modes';
import currAnnoReducer from './store/reducers/currAnno';
import cursorReducer from './store/reducers/cursor';
import AnnotationWrapper from './components/AnnotationWrapper';

export const testAnno = {
  name: 'test',
  type: 'cat',
  top: '20px',
  left: '20px',
  width: '20px',
  height: '20px',
};

export const renderEditableAnno = () =>
  render(
    <AnnotationWrapper
      annotationTypes={['cat', 'dog']}
      handleCancelEdit={jest.fn()}
      handleEditAnnotation={jest.fn()}
      handleKeyPress={jest.fn()}
      handlePointerMove={jest.fn()}
      handleSaveEdit={jest.fn()}
      height="20px"
      left="20px"
      name={testAnno.name}
      options={{}}
      removeAnnotation={jest.fn()}
      top="20px"
      type="cat"
      width="20px"
      rainbowMode={false}
    />,
    {
      preloadedState: {
        currAnno: {
          selectedAnno: testAnno,
          updatedCoords: {
            width: testAnno.width,
            height: testAnno.height,
            top: testAnno.top,
            left: testAnno.left,
          },
        },
      },
    }
  );

export const render = (
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        mode: modeReducer,
        currAnno: currAnnoReducer,
        cursor: cursorReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) => {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
