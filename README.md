# mini-tate

A small React library that provides annotation utilities for marking images.

<img src="./assets/minitate_demo1.png" alt="mini-tate name on hover" width="500"/>

<img src="./assets/minitate_demo2.png" alt="mini-tate annotation form" width="500"/>

## Features

- Mousedown and drag to create a new annotation.
- Form for inputting name and, optionally, type of annotation.
- Edit annotations by clicking and dragging to move, pulling on the corners to resize, using the arrow keys to reposition, and editing the form to update the metadata.
- Custom `onChange` callback can be supplied to have control over the annotations as they change.
- Custom `onError` callback can be supplied to have control over errors as they occur.
- Pass in custom CSS.
- Pass in custom labels (supports localization).
- Optional color-coded annotations based on annotation types.

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
      rainbowMode
    />
  );
}
```

### Props

- `imageSrc`: source of the image to be used as "src" in `img` element. Required.
- `annos`: annotations to be rendered.
- `onChange`: callback to be triggered whenever the annotations update.
- `onError`: callback to be triggered whenever there is an error with the annotations.
- `annotationTypes`: values to populate the "annotation type" input dropdown. Defaults to `[]` and dropdown will be hidden.
- `options`: object to pass in custom styles or labels. More details below.
- `rainbowMode`: optional boolean (defaults to false) that when set to true will color-code the annotations based on annotation type (limited to 4 colors). :rainbow:

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
