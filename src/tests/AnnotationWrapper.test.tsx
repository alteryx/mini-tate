// Copyright (c) 2023 Alteryx, Inc. All rights reserved.

import { screen } from '@testing-library/react';
import React from 'react';

import AnnotationWrapper from '../components/AnnotationWrapper';
import '@testing-library/jest-dom/extend-expect';
import { render, renderEditableAnno } from '../testUtils';

describe('<AnnotationWrapper />', () => {
  test('renders static annotation if not selected', () => {
    const { getByTestId } = render(
      <AnnotationWrapper
        annotationTypes={['cat', 'dog']}
        handleCancelEdit={jest.fn()}
        handleEditAnnotation={jest.fn()}
        handleKeyPress={jest.fn()}
        handlePointerMove={jest.fn()}
        handleSaveEdit={jest.fn()}
        height="20px"
        left="20px"
        name="annotation of dog"
        options={{}}
        removeAnnotation={jest.fn()}
        top="20px"
        type="cat"
        width="20px"
        rainbowMode={false}
      />
    );

    expect(getByTestId('static-annotation')).toBeDefined();
  });

  test('renders annotation in edit mode if selected', () => {
    renderEditableAnno();
    expect(screen.getByTestId('editable-annotation')).toBeDefined();
  });
});
