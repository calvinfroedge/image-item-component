/*
 * ImageItemComponent
 *
 * Options:
 * {
 * }
 */
(function (module) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "file-upload"], function ($, FileUploadClientComponent) { 
          return module.component($, FileUploadClientComponent); 
        });
    } else {
        window.ImageItemComponent = module.component($, FileUploadClientComponent);
    }
}({
  component: function($, Upload){
    /*
     * Creates component and adds to page
     */
    var ImageItemComponent = function(opts){
      var els = {}

      var opts = opts || {};
      opts.events = opts.events || {};
      opts.sizer = opts.sizer || {};

      /*
       * Store the file which was uploaded in memory
       */ 
      var uploadedFile = opts.file || {};

      /*
       * Has the user applied a mask?
       */
      var fileMask = opts.mask || "";

      /*
       * Create parent node
       */
      els.container = $('<div class="image-item-component">');

      /*
       * Image item
       */
      els.item = $('<div class="image-item-container">');
      els.item.css({
        'overflow': 'hidden',
        'position': 'relative',
        'display': 'inline-block'
      });
      
      if(!opts.bounding || !opts.bounding.css){
        opts.bounding = opts.bounding || {};
        opts.bounding.css = {};
      }

			if(!opts.bounding.css.width) opts.bounding.css.width = '150px';

			if(!opts.bounding.css.height) opts.bounding.css.height = '150px';

      $.each(opts.bounding.css, function(key, rule){
        els.item.css(key, rule);
      });

      /*
       * Create the image element
       */
      var imageEl = function(type, item){
        els.item.empty();
        var img;
        if(type == 'file'){ //For files, we attach the image to the component, or to an element specified via opts.bindUploadedTo
          img = $('<img />');

					if(opts.bindUploadedTo){
						opts.bindUploadedTo.append(els.item);
					} else {
						els.container.append(els.item);
					}

          img.attr('src', item.src);
        } else if (type == 'dom'){ //For existing dom els (such as an existing image), we put the image item in the position of the current image
          img = item;
      		els.item.insertBefore(img);
        }

        img.css({
          'position': 'absolute',
        });

        els.item.append(img);
        els.img = img;
        els.item.show();
				var getWidth = setInterval(function(){ //Render does not necessarily happen immediately...
					var width = img.width();
					if(width > 0){
						clearInterval(getWidth);
						img.attr('data-width', img.width());
					}
				}, 1);
      }       

      /*
       * Get uploader instance
       */
			var Uploader = function(){
				return opts.uploader || new Upload({
					attachTo: els.container,
					events: {
						onUpload: function(files){
							els.upload.remove();
							if(els.controls) els.controls.show();
							handleUpload(files[0]);
						},
						onRender: function(container){
							els.upload = container;
						}
					}
				});
			}

      /*
       * Image controls
       */
      var controls = function(){
        if(els.controls) els.controls.remove();

        els.controls = $('<div class="image-item-controls">');

        //Helper function for parsing css values
        var val = function(v){
          if(v == 'auto') return 0;
          return (typeof v == 'string') ? parseInt(v.replace('px')) : v;
        }

        /*
         * Reupload control
         */
        var fileSrc = (opts.file && opts.file.name ? opts.file.name : false)
          || (uploadedFile && uploadedFile.name ? uploadedFile.name : false) 
          || (els.img && els.img.attr('src') ? els.img.attr('src').split('/').pop() : false);


				els.reupload = $('<div class="image-item-reupload">'+(fileSrc || 'image')+' <button>Reupload</button></div>');
				var reuploadBtn = els.reupload.find('button');

				reuploadBtn.on('click', function(){
					els.item.hide();
					els.controls.hide();
					Uploader();
					els.reupload.hide();
				});

				els.controls.append(els.reupload);

        /*
         * Sizing controls
         */
        els.sizer = $('<div class="image-item-controls-size"><p>Image Size</p><input type="range" name="image-item-points" min="0" max="10" value="5" /></div>');

        els.controls.append(els.sizer);

        var sizerControl = els.sizer.find('input');
        var sizerStart = sizerControl.attr('value');
        var numSizes = sizerControl.attr('max') - sizerControl.attr('min');

        sizerControl.on('change', function(e){
          var diff = $(this).val() - sizerStart;
          var originalWidth = els.img.attr('data-width');
          var change = diff * (originalWidth / numSizes) * (opts.sizer.scaleFactor || 1);
          var newWidth = parseInt(originalWidth) + change;
          els.img.width(newWidth);
          
          if(opts.events.onSizeChange) opts.events.onSizeChange({
            width: newWidth,
            height: els.img.height()
          });
        });

        /*
         * Positioning control
         */
        var startPos = {
          x: 0,
          y: 0
        };

        var changePos = {}

        var newPos = function(e){
          return {
            x: e.originalEvent.clientX - startPos.x,
            y: e.originalEvent.clientY - startPos.y
          }
        }

        els.img.on('dragstart', function(e){
          e.preventDefault(); //Prevents ghost image and drag handlers
        });

        els.img.on('mousedown.image-item', function(e){
          if(e.button !== 0) return;
          var startTop = val(els.img.css('top'));
          var startLeft = val(els.img.css('left'));

          startPos = {
            x: e.originalEvent.clientX,
            y: e.originalEvent.clientY
          }

          $(document).on('mousemove.image-item', function(e){
            var change = newPos(e);

            els.img.css('top', change.y + startTop);
            els.img.css('left', change.x + startLeft);
          });

          $(document).on('mouseup.image-item', function(e){
            $(document).off('mouseup.image-item');
            $(document).off('mousemove.image-item');

            if(opts.events.onPositionChange) opts.events.onPositionChange({
              x: val(els.img.css('left')),
              y: val(els.img.css('top'))
            });
          });
        });

        /*
         * Bounding Box Shape
         */
        els.bounding = $('<div class="image-item-bounding"><p>Image Shape</p><div class="bounding-control-square"></div><div class="bounding-control-circle"></div></div>');

        var square = els.bounding.find('.bounding-control-square');

        var circle = els.bounding.find('.bounding-control-circle');

        [square, circle].map(function(item){
          item.css({'background-color': '#ccc', 'width': '50px', 'height': '50px', 'display': 'inline-block'})
        });

        var maskFn = {
          square: function(){
            els.item.css({'border-radius': '0px'});
            fileMask = 'square';
            els.item.css('display', 'inline-block');
            els.img.css('display', 'inline-block');
          },
          circle: function(){
            var width = val(els.item.css('width'));
            els.item.css({'border-radius': width / 2});
            fileMask = 'circle';
            els.item.css('display', 'inline-block');
            els.img.css('display', 'inline-block');
          }
        }

        square.on('click', function(e){
          maskFn.square();
        });

        circle.css('border-radius', '25px');
        circle.on('click', function(e){
          maskFn.circle();
        });

        //Is there already a fileMake to apply?
        if(fileMask) maskFn[fileMask]();

        els.controls.append(els.bounding);

        var saveBtn = $('<button type="button" class="btn image-item-save">Save</button>');
        saveBtn.on('click', function(){
          if(opts.events.onSave) opts.events.onSave({
            position: {
              x: val(els.img.css('left')),
              y: val(els.img.css('top'))
            },
            size: {
              width: els.img.width(),
              height: els.img.height()
            },
            file: uploadedFile,
            mask: fileMask,
            bounding: opts.bounding
          });
        });

        els.controls.append(saveBtn);

        els.container.append(els.controls);
      }
  
      /*
       * Hide image viewer and controls if file is not provided
       */
      if(!opts.file){
        els.item.hide();
      } else { //File was given
        if(opts.file instanceof $){ 
          imageEl('dom', opts.file);
        } else {
          imageEl('file', opts.file);
        }
        controls();
      }

      /*
       * Handle the image upload
       */
      var handleUpload = function(file){
        if(
            (opts.formats || ["image/jpeg", "image/gif", "image/png"]).indexOf(file.type) == -1
        ){
          throw new Error("Image format "+file.type+" is not supported.");
        }

        //Create an image element and set the source
        imageEl('file', file);
        $.extend(uploadedFile, file);
        controls();
      }

			/*
			 * Attach file upload to container
			 */
			Uploader();
				
      /*
       * Uploader shouldn't be present when file is attached
       */
      if(opts.file){
        els.upload.hide();
      }

      /*
       * attach parent node to dom
       */
      if(opts.attachTo){
        if(opts.attachTo instanceof $){
          opts.attachTo.append(els.container);
        } else {
          opts.attachTo.appendChild(els.container);
        }

        if(opts.events.onRender){
          opts.events.onRender(els.container);
        }
      }

      //Public API for the component
      return {
        els: els,
        remove: function(){ //Detach the component and all listeners
          if(opts.events.onRemove) opts.events.onRemove();
          els.container.remove();
					els.item.remove();
        }
      }
    };

    return ImageItemComponent;

  }
}));
