// Copyright (c) 2022 Alteryx, Inc. All rights reserved.

import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import { render, genCustomEvt } from '../testUtils';
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

const renderAnnoAndSelect = () => {
  render(<ImageAnnotator annos={[testAnnos[0]]} imageSrc="fake.png" />, {});
  screen.getByRole('img').getBoundingClientRect = () => ({
    width: 100,
    height: 100,
    bottom: 100,
    left: 0,
    top: 0,
    right: 100,
    x: 0,
    y: 0,
    toJSON: null,
  });
  (
    screen.getByTestId('container').parentNode as HTMLElement
  ).getBoundingClientRect = () => ({
    width: 100,
    height: 100,
    bottom: 100,
    left: 0,
    top: 0,
    right: 100,
    x: 0,
    y: 0,
    toJSON: null,
  });

  fireEvent.load(screen.getByRole('img'));
  fireEvent.click(screen.getByTestId('static-annotation'));
};

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
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  test('form is hidden by default', () => {
    render(<ImageAnnotator imageSrc="" />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  test('renders annotations if initialized with annos', () => {
    render(<ImageAnnotator annos={testAnnos} imageSrc="" />);
    fireEvent.load(screen.getByRole('img'));
    expect(screen.queryAllByTestId('static-annotation')).toHaveLength(2);
  });

  test('filling out form creates new static annotation', () => {
    render(<ImageAnnotator imageSrc="" />);
    fireEvent.pointerDown(screen.getByRole('img'));
    for (let i = 1; i <= 100; i++) {
      fireEvent.pointerMove(screen.getByTestId('container'));
    }
    fireEvent.pointerUp(screen.getByRole('img'));
    const inputs = screen.getAllByRole('textbox');
    const textBox = inputs.find((input) => input.id === 'annotation-name');
    userEvent.type(textBox, 'ANNOTATION NAME');
    fireEvent.click(screen.getByText('Save'));
    expect(screen.queryAllByTestId('static-annotation')).toHaveLength(1);
  });

  test('saving new annotation triggers onChange function', () => {
    const mockOnChange = jest.fn();
    render(<ImageAnnotator imageSrc="" onChange={mockOnChange} />);
    fireEvent.pointerDown(screen.getByRole('img'));
    for (let i = 1; i <= 100; i++) {
      fireEvent.pointerMove(screen.getByTestId('container'));
    }
    fireEvent.pointerUp(screen.getByRole('img'));
    const inputs = screen.getAllByRole('textbox');
    const textBox = inputs.find((input) => input.id === 'annotation-name');
    userEvent.type(textBox, 'ANNOTATION NAME');
    fireEvent.click(screen.getByText('Save'));
    expect(mockOnChange).toBeCalled();
  });

  test('form dropdown defaults to first entry in type array', () => {
    render(<ImageAnnotator imageSrc="" />);
    fireEvent.pointerDown(screen.getByRole('img'));
    fireEvent.pointerMove(screen.getByTestId('container'));
    fireEvent.pointerUp(screen.getByRole('img'));
    expect(screen.getByText('string')).not.toBeNull();
  });

  test('form dropdown defaults to first entry in type array even when passed custom options', () => {
    render(
      <ImageAnnotator annotationTypes={['cat', 'dog', 'banana']} imageSrc="" />
    );
    fireEvent.pointerDown(screen.getByRole('img'));
    fireEvent.pointerMove(screen.getByTestId('container'));
    fireEvent.pointerUp(screen.getByRole('img'));
    expect(screen.getByText('cat')).not.toBeNull();
  });

  test('clicking on static annotation puts it into edit mode', () => {
    render(<ImageAnnotator imageSrc="" />);

    fireEvent.pointerDown(screen.getByRole('img'));
    for (let i = 1; i <= 100; i++) {
      fireEvent.pointerMove(screen.getByTestId('container'));
    }
    fireEvent.pointerUp(screen.getByRole('img'));
    const inputs = screen.getAllByRole('textbox');
    const textBox = inputs.find((input) => input.id === 'annotation-name');
    userEvent.type(textBox, 'ANNOTATION NAME');
    fireEvent.click(screen.getByText('Save'));

    const staticAnno = screen.getByTestId('static-annotation');
    userEvent.click(staticAnno);
    expect(screen.getByTestId('editable-annotation')).toBeDefined();
  });

  test('editing name of created annotation updates the annotation name', () => {
    const mockOnChange = jest.fn();
    render(
      <ImageAnnotator
        annos={[testAnnos[0]]}
        imageSrc=""
        onChange={mockOnChange}
      />
    );
    fireEvent.load(screen.getByRole('img'));

    const staticAnno = screen.getByTestId('static-annotation');

    userEvent.click(staticAnno);

    const inputs = screen.getAllByRole('textbox');
    const textBox = inputs.find((input) => input.id === 'annotation-name');
    userEvent.clear(textBox);
    userEvent.type(textBox, 'UPDATED NAME');
    userEvent.click(screen.getByText('Save'));

    const newAnno = {
      ...testAnnos[0],
      name: 'UPDATED NAME',
      h: NaN,
      w: NaN,
      x: NaN,
      y: NaN,
    };
    expect(mockOnChange).toHaveBeenNthCalledWith(1, [newAnno]);
  });

  test('deleting annotation removes it from list', () => {
    const mockOnChange = jest.fn();
    render(
      <ImageAnnotator
        annos={[testAnnos[0]]}
        imageSrc=""
        onChange={mockOnChange}
      />
    );
    fireEvent.load(screen.getByRole('img'));

    const staticAnno = screen.getByTestId('static-annotation');

    userEvent.click(staticAnno);

    const inputs = screen.getAllByRole('textbox');
    const textBox = inputs.find((input) => input.id === 'annotation-name');
    userEvent.clear(textBox);
    userEvent.type(textBox, 'UPDATED NAME');
    userEvent.click(screen.getByText('Delete'));

    expect(mockOnChange).toHaveBeenNthCalledWith(1, []);
  });

  test('editing name of created annotation then cancelling does not update the annotation', () => {
    const mockOnChange = jest.fn();
    render(
      <ImageAnnotator
        annos={[testAnnos[0]]}
        imageSrc=""
        onChange={mockOnChange}
      />
    );
    fireEvent.load(screen.getByRole('img'));

    const staticAnno = screen.getByTestId('static-annotation');

    userEvent.click(staticAnno);

    const inputs = screen.getAllByRole('textbox');
    const textBox = inputs.find((input) => input.id === 'annotation-name');
    userEvent.clear(textBox);
    userEvent.type(textBox, 'UPDATED NAME');
    userEvent.click(screen.getByText('Cancel'));

    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  test('reusing name calls onError function and does not create new annotation', () => {
    const mockOnError = jest.fn();
    render(
      <ImageAnnotator annos={testAnnos} imageSrc="" onError={mockOnError} />
    );
    fireEvent.load(screen.getByRole('img'));

    fireEvent.pointerDown(screen.getByRole('img'));
    for (let i = 1; i <= 20; i++) {
      fireEvent.pointerMove(screen.getByTestId('container'));
    }
    fireEvent.pointerUp(screen.getByRole('img'));
    const inputs = screen.getAllByRole('textbox');
    const textBox = inputs.find((input) => input.id === 'annotation-name');
    userEvent.clear(textBox);
    userEvent.type(textBox, 'test');
    fireEvent.click(screen.getByText('Save'));

    expect(screen.getAllByTestId('static-annotation')).toHaveLength(2);
    expect(mockOnError).toBeCalled();
  });

  test('dragging annotation moves the coordinates', () => {
    renderAnnoAndSelect();

    const ANNO = 'editable-annotation';
    const pointerDownEvt = genCustomEvt(
      screen.getByTestId(ANNO),
      'pointerDown',
      20,
      20
    );
    fireEvent(screen.getByTestId(ANNO), pointerDownEvt);
    for (let i = 20; i <= 50; i++) {
      const pointerMoveEvt = genCustomEvt(
        screen.getByTestId(ANNO),
        'pointerMove',
        i,
        i
      );
      fireEvent(screen.getByTestId(ANNO), pointerMoveEvt);
    }

    expect(screen.getByTestId('editable-annotation')).toHaveStyle(`left: 50px`);
  });

  test('dragging corner of annotation adjusts the width', () => {
    renderAnnoAndSelect();

    const ANNO = 'editable-annotation';
    const CORNER = 'corner-tl';

    const pointerDownEvt = genCustomEvt(
      screen.getByTestId(CORNER),
      'pointerDown',
      20,
      20
    );
    fireEvent(screen.getByTestId(CORNER), pointerDownEvt);
    for (let i = 20; i >= 0; i--) {
      const pointerMoveEvt = genCustomEvt(
        screen.getByTestId(ANNO),
        'pointerMove',
        i,
        20
      );
      fireEvent(screen.getByTestId(ANNO), pointerMoveEvt);
    }

    expect(screen.getByTestId(ANNO)).toHaveStyle(`width: 40px`);
  });

  test('dragging top left corner of annotation adjusts the height', () => {
    renderAnnoAndSelect();

    const ANNO = 'editable-annotation';
    const CORNER = 'corner-tl';

    const pointerDownEvt = genCustomEvt(
      screen.getByTestId(CORNER),
      'pointerDown',
      20,
      20
    );
    fireEvent(screen.getByTestId(CORNER), pointerDownEvt);
    for (let i = 20; i >= 0; i--) {
      const pointerMoveEvt = genCustomEvt(
        screen.getByTestId(ANNO),
        'pointerMove',
        20,
        i
      );
      fireEvent(screen.getByTestId(ANNO), pointerMoveEvt);
    }

    expect(screen.getByTestId(ANNO)).toHaveStyle(`height: 40px`);
  });

  test('dragging top right corner of annotation adjusts the width', () => {
    renderAnnoAndSelect();

    const ANNO = 'editable-annotation';
    const CORNER = 'corner-tr';

    const pointerDownEvt = genCustomEvt(
      screen.getByTestId(CORNER),
      'pointerDown',
      20,
      20
    );
    fireEvent(screen.getByTestId(CORNER), pointerDownEvt);
    for (let i = 20; i <= 50; i++) {
      const pointerMoveEvt = genCustomEvt(
        screen.getByTestId(ANNO),
        'pointerMove',
        i,
        20
      );
      fireEvent(screen.getByTestId(ANNO), pointerMoveEvt);
    }

    expect(screen.getByTestId(ANNO)).toHaveStyle(`width: 50px`);
  });

  test('dragging bottom right corner of annotation adjusts the height', () => {
    renderAnnoAndSelect();

    const ANNO = 'editable-annotation';
    const CORNER = 'corner-br';

    const pointerDownEvt = genCustomEvt(
      screen.getByTestId(CORNER),
      'pointerDown',
      20,
      20
    );
    fireEvent(screen.getByTestId(CORNER), pointerDownEvt);
    for (let i = 20; i <= 50; i++) {
      const pointerMoveEvt = genCustomEvt(
        screen.getByTestId(ANNO),
        'pointerMove',
        20,
        i
      );
      fireEvent(screen.getByTestId(ANNO), pointerMoveEvt);
    }

    expect(screen.getByTestId(ANNO)).toHaveStyle(`height: 50px`);
  });

  test('dragging bottom left corner of annotation adjusts the height', () => {
    renderAnnoAndSelect();

    const ANNO = 'editable-annotation';
    const CORNER = 'corner-bl';

    const pointerDownEvt = genCustomEvt(
      screen.getByTestId(CORNER),
      'pointerDown',
      20,
      20
    );
    fireEvent(screen.getByTestId(CORNER), pointerDownEvt);
    for (let i = 20; i <= 60; i++) {
      const pointerMoveEvt = genCustomEvt(
        screen.getByTestId(ANNO),
        'pointerMove',
        20,
        i
      );
      fireEvent(screen.getByTestId(ANNO), pointerMoveEvt);
    }

    expect(screen.getByTestId(ANNO)).toHaveStyle(`height: 60px`);
  });

  test('pointerUp on annotation stops drag event', () => {
    renderAnnoAndSelect();

    const ANNO = 'editable-annotation';

    const pointerDownEvt = genCustomEvt(
      screen.getByTestId(ANNO),
      'pointerDown',
      20,
      20
    );
    fireEvent(screen.getByTestId(ANNO), pointerDownEvt);

    const pointerUpEvt = genCustomEvt(
      screen.getByTestId(ANNO),
      'pointerUp',
      20,
      20
    );
    fireEvent(screen.getByTestId(ANNO), pointerUpEvt);

    for (let i = 20; i <= 50; i++) {
      const pointerMoveEvt = genCustomEvt(
        screen.getByTestId(ANNO),
        'pointerMove',
        i,
        i
      );
      fireEvent(screen.getByTestId(ANNO), pointerMoveEvt);
    }

    expect(screen.getByTestId('editable-annotation')).toHaveStyle(`left: 20px`);
  });

  test('pointerUp on corner stops corner drag event', () => {
    renderAnnoAndSelect();

    const ANNO = 'editable-annotation';
    const CORNER = 'corner-bl';

    const pointerDownEvt = genCustomEvt(
      screen.getByTestId(CORNER),
      'pointerDown',
      20,
      20
    );
    fireEvent(screen.getByTestId(CORNER), pointerDownEvt);

    const pointerUpEvt = genCustomEvt(
      screen.getByTestId(CORNER),
      'pointerUp',
      20,
      20
    );
    fireEvent(screen.getByTestId(CORNER), pointerUpEvt);
    for (let i = 20; i <= 60; i++) {
      const pointerMoveEvt = genCustomEvt(
        screen.getByTestId(ANNO),
        'pointerMove',
        20,
        i
      );
      fireEvent(screen.getByTestId(ANNO), pointerMoveEvt);
    }

    expect(screen.getByTestId(ANNO)).toHaveStyle(`height: 20px`);
  });
});
