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
  const [values, setValues] = useState({ name, type });

  const { nameLabel, typeLabel, saveLabel, cancelLabel, deleteLabel } = labels;

  const calculateFormPosition = () => {
    const leftCoord = pixelToNum(left) + pixelToNum(width) - 350;
    if (leftCoord < pixelToNum(left)) return left;
    return `${leftCoord}px`;
  };

  return (
    <Card
      style={{
        top: `${pixelToNum(top) + pixelToNum(height) + 10}px`,
        left: `${calculateFormPosition()}`,
        position: 'absolute',
        zIndex: '1',
        width: 350,
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
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
          );
        }}
      >
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  id="annotation-name"
                  onChange={(e) => setValues({...values, name: e.target.value})}
                  value={values.name}
                  label={nameLabel || 'Annotation Name'}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                />
              </FormControl>
            </Grid>
            { annotationTypes.length ? 
            (<Grid item xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  id="combo-box-demo"
                  options={annotationTypes}
                  onChange={(_, newValue, reason) => { 
                    if (reason === 'clear' && annotationTypes.length) setValues({...values, type: annotationTypes[0]})
                    else setValues({...values, type: newValue})
                  }}
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
                  value={values.type}
                />
              </FormControl>
            </Grid>) : null }
          </Grid>
        </CardContent>
        <CardActions
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'right',
          }}
        >
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
            type="submit"
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
      </form>
    </Card>
  );
}

export default Form;
