// Copyright (c) 2023 Alteryx, Inc. All rights reserved.

import React, { useEffect } from 'react';

import EditableAnnotation from './EditableAnnotation';
import StaticAnnotation from './StaticAnnotation';
import { TAnnotation, TOptions } from '../types';
import { setDrag, setCornerDrag } from '../store/reducers/modes';
import { useAppSelector, useAppDispatch } from '../hooks';
import {
  selectCurrAnno,
  setSelectedCorner,
  setHeight,
  setLeft,
  setTop,
  setWidth,
} from '../store/reducers/currAnno';
import { setCoords } from '../store/reducers/cursor';

type Props = {
  name: string;
  type: string | null;
  top: string;
  left: string;
  height: string;
  width: string;
  handleEditAnnotation: (name: string) => void;
  handleCancelEdit: () => void;
  handleKeyPress: (e: React.KeyboardEvent, name: string) => void;
  handlePointerMove: (event: React.PointerEvent) => void;
  handleSaveEdit: (annotation: TAnnotation, originalName: string) => void;
  removeAnnotation: (name: string) => void;
  annotationTypes: string[];
  options: TOptions;
  rainbowMode: boolean;
};

function AnnotationWrapper({
  handleEditAnnotation,
  name,
  height,
  width,
  top,
  left,
  handleCancelEdit,
  handleKeyPress,
  handlePointerMove,
  handleSaveEdit,
  removeAnnotation,
  type,
  annotationTypes,
  options,
  rainbowMode,
}: Props) {
  const dispatch = useAppDispatch();

  const { selectedAnno, updatedCoords } = useAppSelector(selectCurrAnno);

  const editMode = name === selectedAnno?.name;

  useEffect(() => {
    dispatch(setWidth(width));
    dispatch(setHeight(height));
    dispatch(setTop(top));
    dispatch(setLeft(left));
  }, [top, left, height, width]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(setDrag(true));
    dispatch(setCoords([e.clientX, e.clientY]));
  };

  const handlePointerUp = () => {
    dispatch(setDrag(false));
  };

  const handleCornerPointerDown = (e, selectedCorner: string) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setCornerDrag(true));
    dispatch(setCoords([e.clientX, e.clientY]));
    dispatch(setSelectedCorner(selectedCorner));
  };

  const handleCornerPointerUp = (e) => {
    e.stopPropagation();
    dispatch(setCornerDrag(false));
    dispatch(setSelectedCorner(''));
  };

  const AnnotationToEdit = React.forwardRef(() => (
    <EditableAnnotation
      annotationTypes={annotationTypes}
      handleCancelEdit={() => {
        handleCancelEdit();
        dispatch(setTop(top));
        dispatch(setWidth(width));
        dispatch(setLeft(left));
        dispatch(setHeight(height));
      }}
      handleCornerPointerDown={handleCornerPointerDown}
      handleCornerPointerUp={handleCornerPointerUp}
      handleKeyPress={handleKeyPress}
      handlePointerDown={handlePointerDown}
      handlePointerMove={handlePointerMove}
      handlePointerUp={handlePointerUp}
      handleSaveEdit={(anno, originalName) => {
        handleSaveEdit(
          {
            ...anno,
            height: updatedCoords.height || '',
            width: updatedCoords.width || '',
            top: updatedCoords.top || '',
            left: updatedCoords.left || '',
          },
          originalName
        );
        dispatch(setDrag(false));
        dispatch(setCornerDrag(false));
        dispatch(setSelectedCorner(''));
      }}
      height={updatedCoords.height || ''}
      left={updatedCoords.left || ''}
      name={name}
      options={options}
      removeAnnotation={removeAnnotation}
      top={updatedCoords.top || ''}
      type={type}
      width={updatedCoords.width || ''}
    />
  ));

  if (editMode) return <AnnotationToEdit />;
  return (
    <StaticAnnotation
      height={height}
      left={left}
      onClick={() => handleEditAnnotation(name)}
      options={options}
      top={top}
      width={width}
      name={name}
      types={annotationTypes}
      type={type}
      rainbowMode={rainbowMode}
    />
  );
}

export default AnnotationWrapper;
