'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormioWizard = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _nativePromiseOnly = require('native-promise-only');

var _nativePromiseOnly2 = _interopRequireDefault(_nativePromiseOnly);

var _formio = require('./formio.form');

var _formio2 = _interopRequireDefault(_formio);

var _formio3 = require('./formio');

var _formio4 = _interopRequireDefault(_formio3);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

var _jsonLogicJs = require('json-logic-js');

var _jsonLogicJs2 = _interopRequireDefault(_jsonLogicJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormioWizard = exports.FormioWizard = function (_FormioForm) {
  _inherits(FormioWizard, _FormioForm);

  function FormioWizard(element, options) {
    _classCallCheck(this, FormioWizard);

    var _this = _possibleConstructorReturn(this, (FormioWizard.__proto__ || Object.getPrototypeOf(FormioWizard)).call(this, element, options));

    _this.wizard = null;
    _this.pages = [];
    _this.page = 0;
    _this.history = [];
    _this._nextPage = 1;
    return _this;
  }

  _createClass(FormioWizard, [{
    key: 'setPage',
    value: function setPage(num) {
      if (num >= 0 && num < this.pages.length) {
        this.page = num;
        return _get(FormioWizard.prototype.__proto__ || Object.getPrototypeOf(FormioWizard.prototype), 'setForm', this).call(this, this.currentPage());
      }
      return _nativePromiseOnly2.default.reject('Page not found');
    }
  }, {
    key: 'getNextPage',
    value: function getNextPage(data, currentPage) {
      var form = this.pages[currentPage];
      // Check conditional nextPage
      if (form) {
        var page = ++currentPage;
        if (form.nextPage) {
          // Allow for script execution.
          if (typeof form.nextPage === 'string') {
            try {
              eval(form.nextPage.toString());
              if (!isNaN(parseInt(page, 10)) && isFinite(page)) {
                return page;
              }
              if (typeof page !== 'string') {
                return page;
              }

              // Assume they passed back the key of the page to go to.
              return this.getPageIndexByKey(page);
            } catch (e) {
              console.warn('An error occurred in a custom nextPage function statement for component ' + form.key, e);
              return page;
            }
          }
          // Or use JSON Logic.
          else {
              var result = _jsonLogicJs2.default.apply(form.nextPage, {
                data: data,
                page: page,
                form: form
              });
              var newPage = parseInt(result, 10);
              if (!isNaN(parseInt(newPage, 10)) && isFinite(newPage)) {
                return newPage;
              }

              return this.getPageIndexByKey(result);
            }
        }

        return page;
      }

      return null;
    }
  }, {
    key: 'getPreviousPage',
    value: function getPreviousPage() {
      var prev = this.history.pop();
      if (typeof prev !== 'undefined') {
        return prev;
      }

      return this.page - 1;
    }
  }, {
    key: 'nextPage',
    value: function nextPage() {
      var _this2 = this;

      // Validate the form builed, before go to the next page
      if (this.checkValidity(this.submission.data, true)) {
        this.checkData(this.submission.data, true);
        return this.beforeNext().then(function () {
          _this2.history.push(_this2.page);
          return _this2.setPage(_this2.getNextPage(_this2.submission.data, _this2.page)).then(function () {
            _this2._nextPage = _this2.getNextPage(_this2.submission.data, _this2.page);
            _this2.emit('nextPage', { page: _this2.page, submission: _this2.submission });
          });
        });
      } else {
        return _nativePromiseOnly2.default.reject(this.showErrors());
      }
    }
  }, {
    key: 'prevPage',
    value: function prevPage() {
      var _this3 = this;

      var prevPage = this.getPreviousPage();
      return this.setPage(prevPage).then(function () {
        _this3.emit('prevPage', { page: _this3.page, submission: _this3.submission });
      });
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      _get(FormioWizard.prototype.__proto__ || Object.getPrototypeOf(FormioWizard.prototype), 'cancel', this).call(this);
      this.history = [];
      return this.setPage(0);
    }
  }, {
    key: 'getPageIndexByKey',
    value: function getPageIndexByKey(key) {
      var pageIndex = 0;
      (0, _each2.default)(this.pages, function (_page, index) {
        if (_page.key === key) {
          pageIndex = index;
          return false;
        }
      });
      return pageIndex;
    }
  }, {
    key: 'getPage',
    value: function getPage(pageNum) {
      if (pageNum >= 0 && pageNum < this.pages.length) {
        return this.pages[pageNum];
      }
      return this.pages.length ? this.pages[0] : { components: [] };
    }
  }, {
    key: 'currentPage',
    value: function currentPage() {
      return this.getPage(this.page);
    }
  }, {
    key: 'buildPages',
    value: function buildPages(form) {
      var _this4 = this;

      this.pages = [];
      (0, _each2.default)(form.components, function (component) {
        if (component.type === 'panel') {
          // Ensure that this page can be seen.
          if (_utils2.default.checkCondition(component, _this4.data, _this4.data)) {
            _this4.pages.push(component);
          }
        }
      });
      this.buildWizardHeader();
      this.buildWizardNav();
    }
  }, {
    key: 'setForm',
    value: function setForm(form) {
      this.wizard = form;
      this.buildPages(this.wizard);
      return this.setPage(this.page);
    }
  }, {
    key: 'build',
    value: function build() {
      var _this5 = this;

      _get(FormioWizard.prototype.__proto__ || Object.getPrototypeOf(FormioWizard.prototype), 'build', this).call(this);
      this.formReady.then(function () {
        _this5.buildWizardHeader();
        _this5.buildWizardNav();
      });
    }
  }, {
    key: 'hasButton',
    value: function hasButton(name) {
      if (name === 'previous') {
        return this.page > 0;
      }
      var nextPage = this.getNextPage(this.submission.data, this.page);
      if (name === 'next') {
        return nextPage !== null && nextPage < this.pages.length;
      }
      if (name === 'submit') {
        return nextPage === null || this.page === this.pages.length - 1;
      }
      return true;
    }
  }, {
    key: 'buildWizardHeader',
    value: function buildWizardHeader() {
      var _this6 = this;

      var currentPage = this.currentPage();
      currentPage.breadcrumb = currentPage.breadcrumb || 'default';
      if (currentPage.breadcrumb.toLowerCase() === 'none') {
        return;
      }

      if (this.wizardHeader) {
        this.wizardHeader.innerHTML = '';
      }

      this.wizardHeader = this.ce('wizardHeader', 'ul', {
        class: 'pagination'
      });

      // Add the header to the beginning.
      if (this.element.parentNode) {
        this.element.parentNode.insertBefore(this.wizardHeader, this.element);
      }

      var showHistory = currentPage.breadcrumb.toLowerCase() === 'history';
      (0, _each2.default)(this.pages, function (page, i) {
        // See if this page is in our history.
        if (showHistory && _this6.page !== i && _this6.history.indexOf(i) === -1) {
          return;
        }

        var pageButton = _this6.ce('pageButton', 'li', {
          class: i === _this6.page ? 'active' : '',
          style: i === _this6.page ? '' : 'cursor: pointer;'
        });

        // Navigate to the page as they click on it.
        if (_this6.page !== i) {
          _this6.addEventListener(pageButton, 'click', function (event) {
            event.preventDefault();
            _this6.setPage(i);
          });
        }

        var pageLabel = _this6.ce('pageLabel', 'span');
        var pageTitle = page.title;
        if (currentPage.breadcrumb.toLowerCase() === 'condensed') {
          pageTitle = i === _this6.page || showHistory ? page.title : i + 1;
          if (!pageTitle) {
            pageTitle = i + 1;
          }
        }

        pageLabel.appendChild(_this6.text(pageTitle));
        pageButton.appendChild(pageLabel);
        _this6.wizardHeader.appendChild(pageButton);
      });
    }
  }, {
    key: 'pageId',
    value: function pageId(page) {
      if (page.key) {
        return page.key;
      } else if (page.components && page.components.length > 0) {
        return this.pageId(page.components[0]);
      } else {
        return page.title;
      }
    }
  }, {
    key: 'onSubmissionChange',
    value: function onSubmissionChange(changed) {
      var _this7 = this;

      _get(FormioWizard.prototype.__proto__ || Object.getPrototypeOf(FormioWizard.prototype), 'onSubmissionChange', this).call(this, changed);

      // Only rebuild if there is a page change.
      var pageIndex = 0;
      var rebuild = false;
      (0, _each2.default)(this.wizard.components, function (component) {
        if (component.type !== 'panel') {
          return;
        }

        if (_utils2.default.hasCondition(component)) {
          var hasPage = _this7.pages && _this7.pages[pageIndex] && _this7.pageId(_this7.pages[pageIndex]) === _this7.pageId(component);
          var shouldShow = _utils2.default.checkCondition(component, _this7.data, _this7.data);
          if (shouldShow && !hasPage || !shouldShow && hasPage) {
            rebuild = true;
            return false;
          }
          if (shouldShow) {
            pageIndex++;
          }
        } else {
          pageIndex++;
        }
      });

      if (rebuild) {
        this.setForm(this.wizard);
      }

      // Update Wizard Nav
      var nextPage = this.getNextPage(this.submission.data, this.page);
      if (this._nextPage != nextPage) {
        this.element.removeChild(this.wizardNav);
        this.buildWizardNav();
        this.emit('updateWizardNav', { oldpage: this._nextPage, newpage: nextPage, submission: this.submission });
        this._nextPage = nextPage;
      }
    }
  }, {
    key: 'buildWizardNav',
    value: function buildWizardNav() {
      var _this8 = this;

      if (this.wizardNav) {
        this.wizardNav.innerHTML = '';
      }
      this.wizardNav = this.ce('wizardNav', 'ul', {
        class: 'list-inline'
      });
      this.element.appendChild(this.wizardNav);
      (0, _each2.default)([{ name: 'cancel', method: 'cancel', class: 'btn btn-default' }, { name: 'previous', method: 'prevPage', class: 'btn btn-primary' }, { name: 'next', method: 'nextPage', class: 'btn btn-primary' }, { name: 'submit', method: 'submit', class: 'btn btn-primary' }], function (button) {
        if (!_this8.hasButton(button.name)) {
          return;
        }
        var buttonWrapper = _this8.ce('wizardNavButton', 'li');
        var buttonProp = button.name + 'Button';
        _this8[buttonProp] = _this8.ce(buttonProp, 'button', {
          class: button.class + ' btn-wizard-nav-' + button.name
        });
        _this8[buttonProp].appendChild(_this8.text(_this8.t(button.name)));
        _this8.addEventListener(_this8[buttonProp], 'click', function (event) {
          event.preventDefault();
          _this8[button.method]();
        });
        buttonWrapper.appendChild(_this8[buttonProp]);
        _this8.wizardNav.appendChild(buttonWrapper);
      });
    }
  }]);

  return FormioWizard;
}(_formio2.default);

FormioWizard.setBaseUrl = _formio4.default.setBaseUrl;
FormioWizard.setApiUrl = _formio4.default.setApiUrl;
FormioWizard.setAppUrl = _formio4.default.setAppUrl;

module.exports = global.FormioWizard = FormioWizard;