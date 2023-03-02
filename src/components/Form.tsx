// Copyright (c) 2022 Alteryx, Inc. All rights reserved.

import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  Input,
  InputLabel,
  NativeSelect,
} from '@mui/material';
import React, { useState } from 'react';

import { TAnnotation, TLabels } from '../types';
import { pixelToNum } from '../utils';

type Props = {
  name: string;
  type: string;
  top: string;
  left: string;
  height: string;
  width: string;
  handleSave: (annotation: TAnnotation, originalName: string) => void;
  handleCancel: () => void;
  handleDelete: ((name: string) => void) | null;
  annotationTypes: string[];
  labels: TLabels;
};

function Form({
  name,
  type,
  top,
  left,
  height,
  width,
  handleSave,
  handleCancel,
  handleDelete,
  annotationTypes,
  labels,
}: Props) {
  const [values, setValues] = useState({ name, type });
  const selectOptions = annotationTypes.map((opt) => ({
    value: opt,
    label: opt,
  }));

  const { nameLabel, typeLabel, saveLabel, cancelLabel, deleteLabel } = labels;

  const handleChange = (changeKey) => (event) => {
    setValues({ ...values, [changeKey]: event.target.value });
  };

  return (
    <Card
      style={{
        top: `${pixelToNum(top) + pixelToNum(height) + 10}px`,
        left,
        position: 'absolute',
        zIndex: '1',
      }}
    >
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <FormControl>
              <InputLabel>{nameLabel || 'Annotation Name'}</InputLabel>
              <Input
                id="annotation-name"
                onChange={handleChange('name')}
                value={values.name}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <InputLabel>{typeLabel || 'Annotation Type'}</InputLabel>
              <NativeSelect onChange={handleChange('type')} value={values.type}>
                {selectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          onClick={() =>
            handleSave(
              {
                top,
                left,
                height,
                width,
                name: values.name,
                type: values.type,
              },
              name
            )
          }
          variant="contained"
        >
          {saveLabel || 'Save'}
        </Button>
        <Button color="error" onClick={handleCancel} variant="contained">
          {cancelLabel || 'Cancel'}
        </Button>
        {handleDelete && (
          <Button
            id="removeAnnoBtn"
            onClick={() => handleDelete(name)}
            variant="contained"
          >
            {deleteLabel || 'Delete'}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default Form;
