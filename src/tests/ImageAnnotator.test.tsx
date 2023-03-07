// Copyright (c) 2023 Alteryx, Inc. All rights reserved.

import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import { render } from '../testUtils';
import { ImageAnnotator } from '../components/ImageAnnotator';

const testAnnos = [
  {
    name: 'test',
    type: 'string',
    x: 0.2,
    y: 0.2,
    w: 0.2,
    h: 0.2,
  },
  {
    name: 'test2',
    type: 'string',
    x: 0.007936507936507936,
    y: 0.20422004521477016,
    w: 0.23412698412698413,
    h: 0.08590806330067823,
  },
];

const loadImg = () =>
  fireEvent.load(screen.getByRole('img'), {
    target: { getBoundingClientRect: () => ({ height: 100, width: 100 }) },
  });

describe('<ImmageAnnotator />', () => {
  test('renders image', () => {
    render(<ImageAnnotator imageSrc="" />);
    expect(screen.getByRole('img')).toBeDefined();
  });

  test('has no annotations to start', () => {
    render(<ImageAnnotator imageSrc="" />);
    expect(screen.queryByTestId('new-annotation')).toBeNull();
  });

  test('pointerDown creates new annotation', () => {
    render(<ImageAnnotator imageSrc="" />);
    fireEvent.pointerDown(screen.getByRole('img'));
    const el = screen.getByTestId('new-annotation');
    expect(el).not.toBeNull();
  });

  test('creating new annotation brings up form', () => {
    render(<ImageAnnotator imageSrc="" />);
    fireEvent.pointerDown(screen.getByRole('img'));
    for (let i = 1; i <= 20; i++) {
      fireEvent.pointerMove(screen.getByTestId('container'));
    }
    fireEvent.pointerUp(screen.getByRole('img'));
    // save and cancel
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  test('form is hidden by default', () => {
    render(<ImageAnnotator imageSrc="" />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  test('renders annotations if initialized with annos', () => {
    render(<ImageAnnotator annos={testAnnos} imageSrc="" />);
    loadImg();
    expect(screen.queryAllByTestId('static-annotation')).toHaveLength(2);
  });

  test('filling out form creates new static annotation', async () => {
    render(<ImageAnnotator imageSrc="" />);
    fireEvent.pointerDown(screen.getByRole('img'));
    for (let i = 1; i <= 100; i++) {
      fireEvent.pointerMove(screen.getByTestId('container'));
    }
    fireEvent.pointerUp(screen.getByRole('img'));
    const inputs = screen.getAllByRole('textbox');
    const textBox = inputs.find((input) => input.id === 'annotation-name');
    await userEvent.type(textBox, 'ANNOTATION NAME');
    fireEvent.click(screen.getByText('Save'));
    expect(screen.queryAllByTestId('static-annotation')).toHaveLength(1);
  });

  test('saving new annotation triggers onChange function', async () => {
    const mockOnChange = jest.fn();
    render(<ImageAnnotator imageSrc="" onChange={mockOnChange} />);
    fireEvent.pointerDown(screen.getByRole('img'));
    for (let i = 1; i <= 100; i++) {
      fireEvent.pointerMove(screen.getByTestId('container'));
    }
    fireEvent.pointerUp(screen.getByRole('img'));
    const inputs = screen.getAllByRole('textbox');
    const textBox = inputs.find((input) => input.id === 'annotation-name');
    await userEvent.type(textBox, 'ANNOTATION NAME');
    fireEvent.click(screen.getByText('Save'));
    expect(mockOnChange).toBeCalled();
  });

  test('hide form dropdown if there is no type array', () => {
    render(<ImageAnnotator imageSrc="" />);
    fireEvent.pointerDown(screen.getByRole('img'));
    fireEvent.pointerMove(screen.getByTestId('container'));
    fireEvent.pointerUp(screen.getByRole('img'));
    expect(screen.getAllByRole('textbox')).toHaveLength(1);
  });

  test('form dropdown defaults to first entry in type array when passed custom options', () => {
    render(
      <ImageAnnotator annotationTypes={['cat', 'dog', 'banana']} imageSrc="" />
    );
    fireEvent.pointerDown(screen.getByRole('img'));
    fireEvent.pointerMove(screen.getByTestId('container'));
    fireEvent.pointerUp(screen.getByRole('img'));
    expect(screen.getByDisplayValue('cat')).not.toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  test('clicking on static annotation puts it into edit mode', async () => {
    render(<ImageAnnotator annos={[testAnnos[0]]} imageSrc="" />);

    loadImg();
    const staticAnno = screen.getByTestId('static-annotation');
    await userEvent.click(staticAnno);
    expect(screen.getByTestId('editable-annotation')).toBeDefined();
  });

  test('editing name of created annotation updates the annotation name', async () => {
    const mockOnChange = jest.fn();
    render(
      <ImageAnnotator
        annos={[testAnnos[0]]}
        imageSrc=""
        onChange={mockOnChange}
      />
    );
    loadImg();

    const staticAnno = screen.getByTestId('static-annotation');

    await userEvent.click(staticAnno);

    const inputs = screen.getAllByRole('textbox');
    const textBox = inputs.find((input) => input.id === 'annotation-name');
    expect(textBox).toBeDefined();
    await userEvent.clear(textBox);
    await userEvent.type(textBox, 'UPDATED NAME');
    await userEvent.click(screen.getByText('Save'));

    const newAnno = {
      ...testAnnos[0],
      name: 'UPDATED NAME',
      h: 0.2,
      w: 0.2,
      x: 0.2,
      y: 0.2,
    };
    expect(mockOnChange).toHaveBeenNthCalledWith(1, [newAnno]);
  });

  test('deleting annotation removes it from list', async () => {
    const mockOnChange = jest.fn();
    render(
      <ImageAnnotator
        annos={[testAnnos[0]]}
        imageSrc=""
        onChange={mockOnChange}
      />
    );
    loadImg();

    const staticAnno = screen.getByTestId('static-annotation');

    await userEvent.click(staticAnno);

    const inputs = screen.getAllByRole('textbox');
    const textBox = inputs.find((input) => input.id === 'annotation-name');
    await userEvent.clear(textBox);
    await userEvent.type(textBox, 'UPDATED NAME');
    await userEvent.click(screen.getByText('Delete'));

    expect(mockOnChange).toHaveBeenNthCalledWith(1, []);
  });

  test('editing name of created annotation then cancelling does not update the annotation', async () => {
    const mockOnChange = jest.fn();
    render(
      <ImageAnnotator
        annos={[testAnnos[0]]}
        imageSrc=""
        onChange={mockOnChange}
      />
    );
    loadImg();

    const staticAnno = screen.getByTestId('static-annotation');

    await userEvent.click(staticAnno);

    const inputs = screen.getAllByRole('textbox');
    const textBox = inputs.find((input) => input.id === 'annotation-name');
    await userEvent.clear(textBox);
    await userEvent.type(textBox, 'UPDATED NAME');
    await userEvent.click(screen.getByText('Cancel'));

    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  test('reusing name calls onError function and does not create new annotation', async () => {
    const mockOnError = jest.fn();
    render(
      <ImageAnnotator annos={testAnnos} imageSrc="" onError={mockOnError} />
    );
    loadImg();

    fireEvent.pointerDown(screen.getByRole('img'));
    for (let i = 1; i <= 20; i++) {
      fireEvent.pointerMove(screen.getByTestId('container'));
    }
    fireEvent.pointerUp(screen.getByRole('img'));
    const inputs = screen.getAllByRole('textbox');
    const textBox = inputs.find((input) => input.id === 'annotation-name');
    await userEvent.clear(textBox);
    await userEvent.type(textBox, 'test');
    fireEvent.click(screen.getByText('Save'));

    expect(screen.getAllByTestId('static-annotation')).toHaveLength(2);
    expect(mockOnError).toBeCalled();
  });
});
