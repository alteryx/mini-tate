// Copyright (c) 2022 Alteryx, Inc. All rights reserved.

import { CircleFilled } from '@alteryx/icons';
import { ClickAwayListener } from '@alteryx/ui';
import React from 'react';

import Form from './Form';
import { corner, TAnnotation, TOptions } from '../types';
import { pixelToNum } from '../utils';

type Props = {
  name: string;
  type: string;
  top: string;
  left: string;
  height: string;
  width: string;
  handleCancelEdit: () => void;
  handleSaveEdit: (annotation: TAnnotation, originalName: string) => void;
  removeAnnotation: (name: string) => void;
  handleCornerPointerDown: (
    e: React.PointerEvent<SVGElement>,
    corner: string
  ) => void;
  handleCornerPointerUp: (e: React.PointerEvent<SVGElement>) => void;
  handlePointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerMove: (event: any) => void;
  handlePointerUp: () => void;
  annotationTypes: string[];
  options: TOptions;
};

function EditableAnnotation({
  height,
  width,
  top,
  left,
  name,
  type,
  handleCancelEdit,
  handleCornerPointerDown,
  handleCornerPointerUp,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handleSaveEdit,
  removeAnnotation,
  annotationTypes,
  options,
}: Props) {
  const styles = options.editStyles || {};

  return (
    <ClickAwayListener
      onClickAway={() =>
        handleSaveEdit({ height, width, top, left, name, type }, name)
      }
    >
      <div>
        <div
          className="editableAnno"
          data-testid="editable-annotation"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            ...styles,
            top,
            left,
            height,
            width,
          }}
        >
          <CircleFilled
            data-testid="corner-tl"
            onPointerDown={(e) => handleCornerPointerDown(e, corner.TOP_LEFT)}
            onPointerUp={handleCornerPointerUp}
            style={{
              position: 'absolute',
              marginTop: '-10px',
              marginLeft: '-10px',
              color: 'black',
            }}
          />
          <CircleFilled
            data-testid="corner-tr"
            onPointerDown={(e) => handleCornerPointerDown(e, corner.TOP_RIGHT)}
            onPointerUp={handleCornerPointerUp}
            style={{
              position: 'absolute',
              marginTop: '-10px',
              marginLeft: `${pixelToNum(width) - 12}px`,
              color: 'black',
            }}
          />
          <CircleFilled
            data-testid="corner-bl"
            onPointerDown={(e) =>
              handleCornerPointerDown(e, corner.BOTTOM_LEFT)
            }
            onPointerUp={handleCornerPointerUp}
            style={{
              position: 'absolute',
              marginTop: `${pixelToNum(height) - 10}px`,
              marginLeft: '-10px',
              color: 'black',
            }}
          />
          <CircleFilled
            data-testid="corner-br"
            onPointerDown={(e) =>
              handleCornerPointerDown(e, corner.BOTTOM_RIGHT)
            }
            onPointerUp={handleCornerPointerUp}
            style={{
              position: 'absolute',
              marginTop: `${pixelToNum(height) - 10}px`,
              marginLeft: `${pixelToNum(width) - 12}px`,
              color: 'black',
            }}
          />
        </div>
        <Form
          annotationTypes={annotationTypes}
          handleCancel={handleCancelEdit}
          handleDelete={removeAnnotation}
          handleSave={handleSaveEdit}
          height={height}
          labels={options.labels || {}}
          left={left}
          name={name}
          top={top}
          type={type}
          width={width}
        />
      </div>
    </ClickAwayListener>
  );
}

export default EditableAnnotation;
