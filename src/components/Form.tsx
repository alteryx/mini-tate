// Copyright (c) 2022 Alteryx, Inc. All rights reserved.

import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  TextField,
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

  console.log(left)
  const [values, setValues] = useState({ name, type });

  const { nameLabel, typeLabel, saveLabel, cancelLabel, deleteLabel } = labels;

  const handleChange = (changeKey) => (event) => {
    setValues({ ...values, [changeKey]: event.target.value });
  };

  const calculateFormPosition = () => {
    const leftCoord = pixelToNum(left) + pixelToNum(width) - 350;
    if (leftCoord < pixelToNum(left)) return left;
    return `${leftCoord}px`
  }

  return (
    <Card
      style={{
        top: `${pixelToNum(top) + pixelToNum(height) + 10}px`,
        left: `${calculateFormPosition()}`,
        position: 'absolute',
        zIndex: '1',
        width: 350
      }}
    >
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                id="annotation-name"
                onChange={handleChange('name')}
                value={values.name}
                label={nameLabel || 'Annotation Name'}
                InputLabelProps={{
                  shrink: true,
                }}
                size='small'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Autocomplete
                id="combo-box-demo"
                options={annotationTypes}
                renderInput={(params) => (
                  <TextField
                    {...params}
                  InputLabelProps={{
                    shrink: true,
                  }}
                    label={typeLabel || 'Annotation Type'}
                  />
                )}
                size="small"
              />
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', borderTop: '1px solid rgba(0, 0, 0, 0.1)', display: 'flex', 'justifyContent': 'right' }}>
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
        <Button color="secondary" onClick={handleCancel} variant="contained">
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
