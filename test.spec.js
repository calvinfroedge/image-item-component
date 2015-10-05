describe('component', function(){
  var Component = window.ImageItemComponent;
  var el = $('body');
	var cp;

	console.log('component is', Component);

  describe('Should render', function(){
    it('Should get rendered as an upload view when no image is given', function(){
      cp = new Component({attachTo: el});
      expect($('.image-item-component').length).toEqual(1);
			expect($('.file-upload-client-component:visible').length).toEqual(1);
    });

		it('Should get rendered in an editor view when an existing image is given', function(){
			cp = new Component({
				attachTo: el,
				file: {"src": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAP/2Q==", "name":"test.JPG","lastModified":1443928277000,"lastModifiedDate":"2015-10-    04T03:11:17.000Z","webkitRelativePath":"","size":242340,"type":"image/jpeg"}
			});

			expect($('.image-item-controls').length).toBeGreaterThan(0);
		});

		it('Should get rendered in an editor view when a dom image is given', function(){
      cp = new Component({attachTo: el, file: $('<img src="circle.jpg" />')});
			expect($('.image-item-controls').length).toBeGreaterThan(0);
		});
	});

	afterEach(function(){
		cp.remove();
	});
});
