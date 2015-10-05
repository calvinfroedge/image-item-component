#ImageItemComponent

This component creates an image picker with uploading, repositioning, resizing, and masking. Everything is done client side.

Here is a basic example:
```
  var c = new ImageItemComponent({
    attachTo: $('#container'),
    sizer: {
      scaleFactor: 1.5
    },
    bounding: {
      css: {
        width: '300px',
        height: '300px'
      }
    },
    events: {
      onSave: function(saved){
        console.log('saved!', saved);
      }
    }
  });
```

This provides and upload form. As soon as the user uploads the image, they will see the image.

#Options

- attachTo: $('#domElement')
This targets the element the image picker should be attached to.

- sizer: {scaleFactor: 1.5}
This determines how much the size slider should scale the image with each movement. The default is 1, which results in a 10% change for each position. Thus, the range of sizes using the standard scaling factor is 50-150% of original image size, on 10% intervals.

- bounding: {css: {width: '300px', height: '300px'}}
The dimensions of the image container. The default is 150x150.

- mask: "circle"
A clipping mask to apply to the image. Currently, only circles and squares are supported, but more shapes will eventually be supported. Currently working out bugs with SVG.

- events
Event callbacks.

#Events

- onSave(imageObj)
Called when the image is uploaded and the save button is clicked. Provides position, size, file, mask, and bounding.

- onRender(container)
Called when the component is rendered.

- onSizeChange
Called when the image is resized

TODO:
- Incorporate image filtering with http://camanjs.com/
