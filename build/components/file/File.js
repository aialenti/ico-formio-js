'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Base = require('../base/Base');

var _utils = require('../../utils');

var _utils2 = _interopRequireDefault(_utils);

var _formio = require('../../formio');

var _formio2 = _interopRequireDefault(_formio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FileComponent = exports.FileComponent = function (_BaseComponent) {
  _inherits(FileComponent, _BaseComponent);

  function FileComponent(component, options, data) {
    _classCallCheck(this, FileComponent);

    var _this = _possibleConstructorReturn(this, (FileComponent.__proto__ || Object.getPrototypeOf(FileComponent)).call(this, component, options, data));

    _this.support = {
      filereader: typeof FileReader != 'undefined',
      dnd: 'draggable' in document.createElement('span'),
      formdata: !!window.FormData,
      progress: "upload" in new XMLHttpRequest()
    };
    return _this;
  }

  _createClass(FileComponent, [{
    key: 'getValue',
    value: function getValue() {
      return this.data[this.component.key];
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.data[this.component.key] = value;
      this.refreshDOM();
    }
  }, {
    key: 'build',
    value: function build() {
      // Set default to empty array.
      this.setValue([]);

      this.createElement();
      this.createLabel(this.element);
      this.errorContainer = this.element;
      this.createErrorElement();
      this.listContainer = this.buildList();
      this.element.appendChild(this.listContainer);
      this.uploadContainer = this.buildUpload();
      this.element.appendChild(this.uploadContainer);
      this.addWarnings(this.element);
      this.buildUploadStatusList(this.element);
    }
  }, {
    key: 'refreshDOM',
    value: function refreshDOM() {
      // Don't refresh before the initial render.
      if (this.listContainer && this.uploadContainer) {
        // Refresh file list.
        var newList = this.buildList();
        this.element.replaceChild(newList, this.listContainer);
        this.listContainer = newList;

        // Refresh upload container.
        var newUpload = this.buildUpload();
        this.element.replaceChild(newUpload, this.uploadContainer);
        this.uploadContainer = newUpload;
      }
    }
  }, {
    key: 'buildList',
    value: function buildList() {
      if (this.component.image) {
        return this.buildImageList();
      } else {
        return this.buildFileList();
      }
    }
  }, {
    key: 'buildFileList',
    value: function buildFileList() {
      var _this2 = this;

      return this.ce('filelist', 'ul', { class: 'list-group list-group-striped' }, [this.ce('fileheader', 'li', { class: 'list-group-item list-group-header hidden-xs hidden-sm' }, this.ce('fileheaderrow', 'div', { class: 'row' }, [this.ce('deletecol', 'div', { class: 'col-md-1' }), this.ce('filecol', 'div', { class: 'col-md-9' }, this.ce('bold', 'strong', {}, 'File Name')), this.ce('sizecol', 'div', { class: 'col-md-2' }, this.ce('bold', 'strong', {}, 'Size'))])), this.data[this.component.key].map(function (fileInfo, index) {
        return _this2.createFileListItem(fileInfo, index);
      })]);
    }
  }, {
    key: 'createFileListItem',
    value: function createFileListItem(fileInfo, index) {
      var _this3 = this;

      return this.ce('fileinforow', 'li', { class: 'list-group-item' }, this.ce('fileheaderrow', 'div', { class: 'row' }, [this.ce('deletecol', 'div', { class: 'col-md-1' }, !this.disabled ? this.ce('deleteSpan', 'span', { class: 'glyphicon glyphicon-remove' }, null, {
        click: function click(event) {
          event.preventDefault();
          _this3.data[_this3.component.key].splice(index, 1);
          _this3.refreshDOM();
          _this3.triggerChange();
        }
      }) : null), this.ce('filecol', 'div', { class: 'col-md-9' }, this.createFileLink(fileInfo)), this.ce('sizecol', 'div', { class: 'col-md-2' }, this.fileSize(fileInfo.size))]));
    }
  }, {
    key: 'createFileLink',
    value: function createFileLink(file) {
      return this.ce('filelink', 'a', { href: file.url, target: '_blank' }, file.name, {
        click: this.getFile.bind(this, file)
      });
    }
  }, {
    key: 'buildImageList',
    value: function buildImageList() {
      var _this4 = this;

      return this.ce('imagelist', 'div', {}, this.data[this.component.key].map(function (fileInfo, index) {
        return _this4.createImageListItem(fileInfo, index);
      }));
    }
  }, {
    key: 'createImageListItem',
    value: function createImageListItem(fileInfo, index) {
      var _this5 = this;

      var image = void 0;
      if (this.options.formio) {
        this.options.formio.downloadFile(fileInfo).then(function (result) {
          image.src = result.url;
        });
      }
      return this.ce('imageinforow', 'div', {}, this.ce('span', 'span', {}, [image = this.ce('filecol', 'img', { src: '', alt: fileInfo.name, style: 'width:' + this.component.imageSize + 'px' }), !this.disabled ? this.ce('deleteSpan', 'span', { class: 'glyphicon glyphicon-remove' }, null, {
        click: function click(event) {
          event.preventDefault();
          _this5.data[_this5.component.key].splice(index, 1);
          _this5.refreshDOM();
          _this5.triggerChange();
        }
      }) : null]));
    }
  }, {
    key: 'buildUpload',
    value: function buildUpload() {
      var _this6 = this;

      // Drop event must change this pointer so need a reference to parent this.
      var element = this;
      // If this is disabled or a single value with a value, don't show the upload div.
      return this.ce('uploadwrapper', 'div', {}, !this.disabled && (this.component.multiple || this.data[this.component.key].length === 0) ? this.ce('upload', 'div', { class: 'fileSelector' }, [this.ce('icon', 'i', { class: 'glyphicon glyphicon-cloud-upload' }), this.text(' Drop files to attach, or '), this.ce('browse', 'a', false, 'browse', {
        click: function click(event) {
          event.preventDefault();
          // There is no direct way to trigger a file dialog. To work around this, create an input of type file and trigger
          // a click event on it.
          var input = _this6.ce('fileinput', 'input', { type: 'file' });
          // Trigger a click event on the input.
          if (typeof input.trigger === 'function') {
            input.trigger('click');
          } else {
            input.click();
          }
          input.addEventListener('change', function () {
            _this6.upload(input.files);
          });
        }
      })], {
        dragover: function dragover(event) {
          this.className = 'fileSelector fileDragOver';
          event.preventDefault();
        },
        dragleave: function dragleave(event) {
          this.className = 'fileSelector';
          event.preventDefault();
        },
        drop: function drop(event) {
          this.className = 'fileSelector';
          event.preventDefault();
          element.upload(event.dataTransfer.files);
          return false;
        }
      }) : this.ce('uploadwrapper', 'div'));
    }
  }, {
    key: 'buildUploadStatusList',
    value: function buildUploadStatusList(container) {
      var list = this.ce('uploadlist', 'div');
      this.uploadStatusList = list;
      container.appendChild(list);
    }
  }, {
    key: 'addWarnings',
    value: function addWarnings(container) {
      var hasWarnings = false;
      var warnings = this.ce('warnings', 'div', { class: 'alert alert-warning' });
      if (!this.component.storage) {
        hasWarnings = true;
        warnings.appendChild(this.ce('nostorage', 'p').appendChild(this.text('No storage has been set for this field. File uploads are disabled until storage is set up.')));
      }
      if (!this.support.dnd) {
        hasWarnings = true;
        warnings.appendChild(this.ce('nodnd', 'p').appendChild(this.text('FFile Drag/Drop is not supported for this browser.')));
      }
      if (!this.support.filereader) {
        hasWarnings = true;
        warnings.appendChild(this.ce('nofilereader', 'p').appendChild(this.text('File API & FileReader API not supported.')));
      }
      if (!this.support.formdata) {
        hasWarnings = true;
        warnings.appendChild(this.ce('noformdata', 'p').appendChild(this.text('XHR2\'s FormData is not supported.')));
      }
      if (!this.support.progress) {
        hasWarnings = true;
        warnings.appendChild(this.ce('noprogress', 'p').appendChild(this.text('XHR2\'s upload progress isn\'t supported.')));
      }
      if (hasWarnings) {
        container.appendChild(warnings);
      }
    }
  }, {
    key: 'fileSize',
    value: function fileSize(a, b, c, d, e) {
      return (b = Math, c = b.log, d = 1024, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2) + ' ' + (e ? 'kMGTPEZY'[--e] + 'B' : 'Bytes');
    }
  }, {
    key: 'createUploadStatus',
    value: function createUploadStatus(fileUpload) {
      var _this7 = this;

      var container = void 0;
      return container = this.ce('uploadstatus', 'div', { class: 'file' + (fileUpload.status === 'error' ? ' has-error' : '') }, [this.ce('filerow', 'div', { class: 'row' }, [this.ce('filecell', 'div', { class: 'fileName control-label col-sm-10' }, [fileUpload.name, this.ce('removefile', 'span', { class: 'glyphicon glyphicon-remove' }, undefined, {
        click: function click() {
          _this7.uploadStatusList.removeChild(container);
        }
      })]), this.ce('sizecell', 'div', { class: 'fileSize control-label col-sm-2 text-right' }, this.fileSize(fileUpload.size))]), this.ce('statusrow', 'div', { class: 'row' }, [this.ce('progresscell', 'div', { class: 'col-sm-12' }, [fileUpload.status === 'progress' ? this.ce('progresscell', 'div', { class: 'progress' }, this.ce('progressbar', 'div', {
        class: 'progress-bar',
        role: 'progressbar',
        'aria-valuenow': fileUpload.progress,
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        style: 'width:' + fileUpload.progress + '%'
      }, this.ce('srprogress', 'span', { class: 'sr-only' }, fileUpload.progress + '% Complete'))) : this.ce('messagecell', 'div', { class: 'bg-' + fileUpload.status }, fileUpload.message)])])]);
    }
  }, {
    key: 'upload',
    value: function upload(files) {
      var _this8 = this;

      // Only allow one upload if not multiple.
      if (!this.component.multiple) {
        files = Array.prototype.slice.call(files, 0, 1);
      }
      if (this.component.storage && files && files.length) {
        // files is not really an array and does not have a forEach method, so fake it.
        Array.prototype.forEach.call(files, function (file) {
          // Get a unique name for this file to keep file collisions from occurring.
          var fileName = _utils2.default.uniqueName(file.name);
          var fileUpload = {
            name: fileName,
            size: file.size,
            status: 'info',
            message: 'Starting upload'
          };
          var dir = _this8.interpolate(_this8.component.dir || '', { data: _this8.data, row: _this8.row });
          var formio = null;
          if (_this8.options.formio) {
            formio = _this8.options.formio;
          } else {
            fileUpload.status = 'error';
            fileUpload.message = 'File Upload URL not provided.';
          }

          var uploadStatus = _this8.createUploadStatus(fileUpload);
          _this8.uploadStatusList.appendChild(uploadStatus);

          if (formio) {
            formio.uploadFile(_this8.component.storage, file, fileName, dir, function (evt) {
              fileUpload.status = 'progress';
              fileUpload.progress = parseInt(100.0 * evt.loaded / evt.total);
              delete fileUpload.message;
              var originalStatus = uploadStatus;
              uploadStatus = _this8.createUploadStatus(fileUpload);
              _this8.uploadStatusList.replaceChild(uploadStatus, originalStatus);
            }, _this8.component.url).then(function (fileInfo) {
              _this8.uploadStatusList.removeChild(uploadStatus);
              _this8.data[_this8.component.key].push(fileInfo);
              _this8.refreshDOM();
              _this8.triggerChange();
            }).catch(function (response) {
              fileUpload.status = 'error';
              fileUpload.message = response;
              delete fileUpload.progress;
              var originalStatus = uploadStatus;
              uploadStatus = _this8.createUploadStatus(fileUpload);
              _this8.uploadStatusList.replaceChild(uploadStatus, originalStatus);
            });
          }
        });
      }
    }
  }, {
    key: 'getFile',
    value: function getFile(fileInfo, event) {
      if (!this.options.formio) {
        return alert('File URL not set');
      }
      this.options.formio.downloadFile(fileInfo).then(function (file) {
        if (file) {
          window.open(file.url, '_blank');
        }
      }).catch(function (response) {
        // Is alert the best way to do this?
        // User is expecting an immediate notification due to attempting to download a file.
        alert(response);
      });
      event.preventDefault();
    }
  }]);

  return FileComponent;
}(_Base.BaseComponent);