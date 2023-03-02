// Copyright (c) 2022 Alteryx, Inc. All rights reserved.

import CircleIcon from '@mui/icons-material/Circle';
import { ClickAwayListener } from '@mui/material';
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
          <CircleIcon
            data-testid="corner-tl"
            fontSize='small'
            onPointerDown={(e) => handleCornerPointerDown(e, corner.TOP_LEFT)}
            onPointerUp={handleCornerPointerUp}
            style={{
              position: 'absolute',
              marginTop: '-10px',
              marginLeft: '-10px',
              color: 'black',
            }}
          />
          <CircleIcon
            data-testid="corner-tr"
            fontSize='small'
            onPointerDown={(e) => handleCornerPointerDown(e, corner.TOP_RIGHT)}
            onPointerUp={handleCornerPointerUp}
            style={{
              position: 'absolute',
              marginTop: '-10px',
              marginLeft: `${pixelToNum(width) - 15}px`,
              color: 'black',
            }}
          />
          <CircleIcon
            data-testid="corner-bl"
            fontSize='small'
            onPointerDown={(e) =>
              handleCornerPointerDown(e, corner.BOTTOM_LEFT)
            }
            onPointerUp={handleCornerPointerUp}
            style={{
              position: 'absolute',
              marginTop: `${pixelToNum(height) - 15}px`,
              marginLeft: '-10px',
              color: 'black',
            }}
          />
          <CircleIcon
            data-testid="corner-br"
            fontSize='small'
            onPointerDown={(e) =>
              handleCornerPointerDown(e, corner.BOTTOM_RIGHT)
            }
            onPointerUp={handleCornerPointerUp}
            style={{
              position: 'absolute',
              marginTop: `${pixelToNum(height) - 15}px`,
              marginLeft: `${pixelToNum(width) - 15}px`,
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
