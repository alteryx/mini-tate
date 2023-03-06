// Copyright (c) 2022 Alteryx, Inc. All rights reserved.
import React, { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector, useCurrentImg } from '../hooks';
import {
  selectCurrAnno,
  setSelectedAnno,
  setHeight,
  setLeft,
  setTop,
  setWidth,
  clearSelectedAnno,
} from '../store/reducers/currAnno';
import { selectCursor, setCoords } from '../store/reducers/cursor';
import { selectMode, setEdit } from '../store/reducers/modes';
import {
  corner,
  errorTypes,
  TAnnotation,
  TAnnotationRaw,
  TImgRatio,
  TOptions,
} from '../types';
import { cssToRawAnno, pixelToNum, rawToCSSAnno } from '../utils';
import debounce from 'lodash/debounce';

import AnnotationWrapper from './AnnotationWrapper';
import Form from './Form';
import './styles.css';

export type TProps = {
  imageSrc: string;
  annos?: TAnnotationRaw[];
  onChange?: (annos: TAnnotationRaw[]) => any;
  onError?: (error: string) => any;
  annotationTypes?: string[];
  options?: TOptions;
  rainbowMode?: boolean;
};

export function ImageAnnotator({
  imageSrc,
  annos,
  onChange,
  onError,
  annotationTypes,
  options = {},
  rainbowMode = false,
}: TProps) {
  const dispatch = useAppDispatch();
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRect = useCurrentImg();
  const { edit, drag, cornerDrag } = useAppSelector(selectMode);

  const { selectedAnno, selectedCorner, updatedCoords } =
    useAppSelector(selectCurrAnno);
  const { coords } = useAppSelector(selectCursor);

  const [drawingMode, setDrawingMode] = useState(false);
  const [boundary, setBoundary] = useState(null);
  const [origin, setOrigin] = useState([0, 0]);
  const [displayForm, setDisplayForm] = useState(false);
  const [annotations, setAnnotations] = useState<TAnnotation[]>([]);
  const [imgRatio, setImgRatio] = useState<TImgRatio>(imgRect);
  const [rawAnnos, setRawAnnos] = useState(annos || []);
  const debouncedPointerMove = useCallback(
    debounce((e: PointerEvent) => {
      const { clientX, clientY } = e;
      if (!cornerDrag && !drag) return;
      if (Number.isNaN(+clientX) || Number.isNaN(+clientY)) return;
      if (pointOutOfBounds(+clientX, +clientY)) return;
      if (cornerDrag) handleCornerPointerMove(e);
      if (drag) handleDrag(e);
    }, 0),
    [drag, cornerDrag]
  );

  useEffect(() => {
    if (imgRect.height !== 0 && imgRect.width !== 0) setImgRatio(imgRect);
  }, [imgRect]);

  useEffect(() => {
    if (imgLoaded && imgRatio.height > 0 && imgRatio.width > 0) {
      setAnnotations(rawToCSSAnno(rawAnnos, imgRatio.height, imgRatio.width));
    }
  }, [rawAnnos, imgLoaded, imgRatio.height, imgRatio.width]);

  useEffect(() => {
    const img = document.getElementById('anno-img');
    if (options.imgStyles && img) {
      const { height, width } = img.getBoundingClientRect();
      setImgRatio({ height, width });
    }
  }, [options.imgStyles]);

  useEffect(() => {
    if (annos) setRawAnnos(annos);
    dispatch(clearSelectedAnno());
    dispatch(setEdit(false));
  }, [annos]);

  const createNewBoundary = (x: number, y: number) => {
    const newBoundary = document.createElement('div');
    const image = document.getElementById('anno-img').getBoundingClientRect();
    newBoundary.style.top = `${y - image.y}px`;
    newBoundary.style.left = `${x - image.x}px`;
    newBoundary.style.borderWidth = '3px';
    newBoundary.style.borderStyle = 'solid';
    newBoundary.style.position = 'absolute';
    newBoundary.style.boxSizing = 'border-box';
    newBoundary.style.backgroundColor = 'rgba(255, 112, 130, .4)';
    newBoundary.setAttribute('data-testid', 'new-annotation');
    // user overrides default styles
    if (options.annoStyles) {
      Object.keys(options.annoStyles).forEach((key) => {
        newBoundary.style[key] = options.annoStyles[key];
      });
    }
    document.getElementById('anno-container').appendChild(newBoundary);
    setOrigin([x, y]);
    setBoundary(newBoundary);
    setDrawingMode(true);

    newBoundary.addEventListener('pointerup', () => {
      if (newBoundary.style.width === '') {
        newBoundary.remove();
        setDrawingMode(false);
        return;
      }
      setDrawingMode(false);
      setDisplayForm(true);
    });
  };

  const handleEditAnnotation = (name: string) => {
    const newSelectedAnno = annotations.find((a) => a.name === name);
    if (selectedAnno !== null && selectedAnno !== newSelectedAnno) {
      dispatch(clearSelectedAnno());
      dispatch(setEdit(false));
      return;
    }
    dispatch(setEdit(true));
    dispatch(setSelectedAnno(newSelectedAnno));
  };

  // expects screen coordinates (clientX and clientY from the event)
  // calculates if those screen coordinates are within the bounds of the visible image
  const pointOutOfBounds = (x: number, y: number) => {
    const imgBounds = document
      .getElementById('anno-img')
      .getBoundingClientRect();
    const containerBounds = (
      document.getElementById('anno-container').parentNode as HTMLElement
    ).getBoundingClientRect();
    const top = Math.max(imgBounds.top, containerBounds.top);
    const bottom = Math.min(imgBounds.bottom, containerBounds.bottom);
    const right = Math.min(imgBounds.right, containerBounds.right);
    const left = Math.max(imgBounds.left, containerBounds.left);
    return x < left || x > right || y < top || y > bottom;
  };

  const dragBoundary = (x: number, y: number) => {
    if (pointOutOfBounds(x, y)) return;
    const image = document.getElementById('anno-img').getBoundingClientRect();
    if (boundary) {
      if (x < origin[0]) {
        boundary.style.left = `${x - image.x}px`;
        boundary.style.width = `${origin[0] - x}px`;
      } else {
        boundary.style.width = `${x - origin[0]}px`;
      }

      if (y < origin[1]) {
        boundary.style.top = `${y - image.y}px`;
        boundary.style.height = `${origin[1] - y}px`;
      } else {
        boundary.style.height = `${y - origin[1]}px`;
      }
    }
  };

  const addAnnotation = (
    annotation: HTMLElement,
    { name, type }: TAnnotation
  ) => {
    const newAnnotation = {
      height: annotation.style.height,
      width: annotation.style.width,
      top: annotation.style.top,
      left: annotation.style.left,
      name,
      type,
    };
    if (annotations.find((a) => a.name === name)) {
      annotation.remove();
      if (onError) onError(errorTypes.DUPLICATE);
      return;
    }
    if (name === '') {
      annotation.remove();
      if (onError) onError(errorTypes.BLANK);
      return;
    }
    if (onChange)
      onChange(
        cssToRawAnno(
          [...annotations, newAnnotation],
          imgRatio.height,
          imgRatio.width
        )
      );
    setRawAnnos(
      cssToRawAnno(
        [...annotations, newAnnotation],
        imgRatio.height,
        imgRatio.width
      )
    );
    setAnnotations([...annotations, newAnnotation]);
    annotation.remove();
  };

  const removeAnnotation = (name: string) => {
    const newAnnotations = annotations.filter((a) => a.name !== name);
    setRawAnnos(cssToRawAnno(newAnnotations, imgRatio.height, imgRatio.width));
    setAnnotations(newAnnotations);
    dispatch(setEdit(false));
    dispatch(clearSelectedAnno());
    if (onChange)
      onChange(cssToRawAnno(newAnnotations, imgRatio.height, imgRatio.width));
  };

  const handleCancelEdit = () => {
    dispatch(setEdit(false));
    dispatch(clearSelectedAnno());
  };

  const handleSaveEdit = (
    { height, width, top, left, name, type }: TAnnotation,
    originalName: string
  ) => {
    if (name !== originalName && annotations.find((a) => a.name === name)) {
      if (onError) onError(errorTypes.DUPLICATE);
    } else if (name === '') {
      if (onError) onError(errorTypes.BLANK);
    } else {
      const updatedAnno = { height, width, top, left, name, type };
      const newAnnotations = annotations.map((a) => {
        if (a.name === selectedAnno.name) return updatedAnno;
        return a;
      });
      setAnnotations(newAnnotations);
      setRawAnnos(
        cssToRawAnno(newAnnotations, imgRatio.height, imgRatio.width)
      );
      if (onChange)
        onChange(cssToRawAnno(newAnnotations, imgRatio.height, imgRatio.width));
    }
    dispatch(setEdit(false));
    dispatch(clearSelectedAnno());
  };

  const handleCornerPointerMove = (e) => {
    if (!cornerDrag) return;
    const { clientX, clientY } = e;
    let newWidth: number;
    let newHeight: number;
    switch (selectedCorner) {
      case corner.TOP_LEFT:
        newWidth = coords[0] - clientX + pixelToNum(updatedCoords.width);
        newHeight = coords[1] - clientY + pixelToNum(updatedCoords.height);
        if (newWidth <= 0 || newHeight <= 0) return;
        dispatch(
          setLeft(`${pixelToNum(updatedCoords.left) + (clientX - coords[0])}px`)
        );
        dispatch(
          setTop(`${pixelToNum(updatedCoords.top) + (clientY - coords[1])}px`)
        );
        break;
      case corner.TOP_RIGHT:
        newWidth = clientX - coords[0] + pixelToNum(updatedCoords.width);
        newHeight = coords[1] - clientY + pixelToNum(updatedCoords.height);
        if (newWidth <= 0 || newHeight <= 0) return;
        dispatch(
          setTop(`${pixelToNum(updatedCoords.top) + (clientY - coords[1])}px`)
        );
        break;
      case corner.BOTTOM_LEFT:
        newWidth = coords[0] - clientX + pixelToNum(updatedCoords.width);
        newHeight = clientY - coords[1] + pixelToNum(updatedCoords.height);
        if (newWidth <= 0 || newHeight <= 0) return;
        dispatch(
          setLeft(`${pixelToNum(updatedCoords.left) + (clientX - coords[0])}px`)
        );
        break;
      case corner.BOTTOM_RIGHT:
        newWidth = clientX - coords[0] + pixelToNum(updatedCoords.width);
        newHeight = clientY - coords[1] + pixelToNum(updatedCoords.height);
        if (newWidth <= 0 || newHeight <= 0) return;
        break;
      default:
        return;
    }
    dispatch(setWidth(`${newWidth}px`));
    dispatch(setHeight(`${newHeight}px`));
    dispatch(setCoords([clientX, clientY]));
  };

  const handleDrag = (e) => {
    if (drag) {
      const { clientX, clientY } = e;
      const imgBounds = document
        .getElementById('anno-img')
        .getBoundingClientRect();
      const newLeft = pixelToNum(updatedCoords.left) + (clientX - coords[0]);
      const newTop = pixelToNum(updatedCoords.top) + (clientY - coords[1]);
      const screenX = newLeft + imgBounds.x;
      const screenY = newTop + imgBounds.y;
      if (pointOutOfBounds(screenX, screenY)) return;
      if (
        pointOutOfBounds(
          screenX + pixelToNum(updatedCoords.width),
          screenY + pixelToNum(updatedCoords.height)
        )
      )
        return;

      dispatch(setLeft(`${newLeft}px`));
      dispatch(setTop(`${newTop}px`));
      dispatch(setCoords([clientX, clientY]));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const { key } = e;
    if (
      !['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].find(
        (keyCode) => keyCode === key
      )
    )
      return;
    e.preventDefault();
    switch (key) {
      case 'ArrowRight':
        dispatch(setLeft(`${pixelToNum(updatedCoords.left) + 1}px`));
        break;
      case 'ArrowLeft':
        dispatch(setLeft(`${pixelToNum(updatedCoords.left) - 1}px`));
        break;
      case 'ArrowUp':
        dispatch(setTop(`${pixelToNum(updatedCoords.top) - 1}px`));
        break;
      case 'ArrowDown':
        dispatch(setTop(`${pixelToNum(updatedCoords.top) + 1}px`));
        break;
    }
  };

  return (
    <div
      data-testid="container"
      id="anno-container"
      onPointerDown={(e) => {
        if (drawingMode || edit || displayForm) return;
        setDrawingMode(true);
        createNewBoundary(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (drawingMode) dragBoundary(e.clientX, e.clientY);
      }}
      onPointerUp={() => {
        if (drawingMode) {
          setDrawingMode(false);
          setDisplayForm(true);
        }
      }}
      style={{
        touchAction: 'none',
        display: 'inline-block',
        position: 'relative',
      }}
    >
      <img
        alt=""
        draggable="false"
        id="anno-img"
        onLoad={(e) => {
          const { height, width } = (
            e.target as HTMLImageElement
          ).getBoundingClientRect();
          setImgRatio({ height, width });
          setImgLoaded(true);
        }}
        onPointerMove={(e) => debouncedPointerMove(e)}
        src={imageSrc}
        style={options.imgStyles ? options.imgStyles : {}}
      />
      {annotations.map((annotation) => (
        <AnnotationWrapper
          annotationTypes={annotationTypes}
          handleCancelEdit={handleCancelEdit}
          handleEditAnnotation={handleEditAnnotation}
          handleKeyPress={handleKeyPress}
          handlePointerMove={debouncedPointerMove}
          handleSaveEdit={handleSaveEdit}
          key={annotation.name}
          options={options}
          removeAnnotation={removeAnnotation}
          rainbowMode={rainbowMode}
          {...annotation}
        />
      ))}
      {displayForm && (
        <Form
          annotationTypes={annotationTypes}
          handleCancel={() => {
            boundary.remove();
            setDisplayForm(false);
          }}
          handleDelete={null}
          handleSave={(newAnnotation) => {
            setDisplayForm(false);
            addAnnotation(boundary, newAnnotation);
          }}
          height={boundary.style.height}
          labels={options.labels || {}}
          left={boundary.style.left}
          name=""
          top={boundary.style.top}
          type={annotationTypes.length ? annotationTypes[0] : ''}
          width={boundary.style.width}
        />
      )}
    </div>
  );
}

ImageAnnotator.defaultProps = {
  annos: null,
  annotationTypes: [],
  onChange: null,
  onError: null,
  options: [],
};
