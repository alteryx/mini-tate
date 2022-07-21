# mini-tate

A small React library that provides annotation utilities for marking images.

## Features

- Mousedown and drag to create a new annotation.
- Form for inputting name and type of annotation (type dropdown is customizable).
- Edit annotations by clicking and dragging to move, pulling on the corners to resize, and editing the form to update the metadata.
- Custom `onChange` callback can be supplied to have control over the annotations as they change.
- Custom `onError` callback can be supplied to have control over errors as they occur.
- Pass in custom CSS.
- Pass in custom labels (supports localization).

## Installation

`npm i @alteryx/mini-tate`

## Example Usage

### Basic Usage

```
function App() {
  const handleChange = newAnnos => {
    console.log(newAnnos);
  };

  const onError = error => {
    console.log(error);
  };

  return <ImageAnnotator imageSrc="./imgs/yourImageFileHere.jpeg" onChange={handleChange} onError={onError} />;
}
```

### More Complicated Usage

```
function App() {
  const startingAnnos = [
    {
      name: 'header',
      type: 'label',
      x: 0.03,
      y: 0.05,
      w: 0.95,
      h: 0.06
    }
  ];
  const annotationTypes = ['comment', 'label', 'tag'];

  const handleChange = newAnnos => {
    console.log(newAnnos);
  };

  const onError = error => {
    console.log(error);
  };

  return (
    <ImageAnnotator
      annos={startingAnnos}
      annotationTypes={annotationTypes}
      imageSrc="./imgs/yourImageFileHere.jpeg"
      onChange={handleChange}
      onError={onError}
      options={{
        annoStyles: { borderColor: 'green' },
        labels: { nameLabel: 'Name' }
      }}
    />
  );
}
```

### Props

- `imageSrc`: source of the image to be used as "src" in `img` element. Required.
- `annos`: annotations to be rendered.
- `onChange`: callback to be triggered whenever the annotations update.
- `onError`: callback to be triggered whenever there is an error with the annotations.
- `annotationTypes`: values to populate the "annotation type" input dropdown. Defaults to "string", "image", and "table".
- `options`: object to pass in custom styles or labels. More details below.

### Options

The options object provides three properties:

- `annoStyles`: styles to apply to annotations.
- `editStyles`: styles to apply to an annotation that is being edited.
- `imgStyles`: styles to apply to the image being rendered.
- `labels`: custom labels to support localization.
  - `nameLabel`: default is "Annotation Name".
  - `typeLabel`: default is "Annotation Type".
  - `saveLabel`: default is "Save".
  - `cancelLabel`: default is "Cancel".
  - `deleteLabel`: default is "Delete".
