// Copyright (c) 2022 Alteryx, Inc. All rights reserved.

import { useEffect, useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store/store';
import { TImgRatio } from './types';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useCurrentImg = (): TImgRatio => {
  const [imgRect, setImgRect] = useState({ height: 0, width: 0 });
  useEffect(() => {
    const resizeListener = () => {
      let newImgRect = { height: 0, width: 0 };
      if (document.getElementById('anno-img')) {
        const { height, width } = document
          .getElementById('anno-img')
          .getBoundingClientRect();
        newImgRect = { height, width };
      }
      setImgRect(newImgRect);
    };
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);
  return imgRect;
};
