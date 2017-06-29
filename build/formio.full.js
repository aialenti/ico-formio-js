"use strict";

var _nativePromiseOnly = require("native-promise-only");

var _nativePromiseOnly2 = _interopRequireDefault(_nativePromiseOnly);

var _formio = require("./formio.wizard");

var _formio2 = _interopRequireDefault(_formio);

var _formio3 = require("./formio.form");

var _formio4 = _interopRequireDefault(_formio3);

var _formio5 = require("./formio");

var _formio6 = _interopRequireDefault(_formio5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Provided a form object, this will return the form instance.
 * @param element
 * @param form
 * @param options
 * @return {*}
 */
_formio6.default.formFactory = function (element, form, options) {
  var instance = null;
  if (form.display === 'wizard') {
    instance = new _formio2.default(element, options);
  } else {
    instance = new _formio4.default(element, options);
  }
  instance.form = form;
  return instance;
};

/**
 * Creates a new form based on the form parameter.
 *
 * @param element {HMTLElement} - The HTML Element to add this form to.
 * @param form {string|Object} - The src of the form, or a form object.
 * @param options {Object} - The options to create this form.
 *
 * @return {Promise} - When the form is instance is ready.
 */
_formio6.default.createForm = function (element, form, options) {
  if (typeof form === 'string') {
    return new _formio6.default(form).loadForm().then(function (formObj) {
      return _formio6.default.formFactory(element, formObj, options);
    });
  } else {
    return _nativePromiseOnly2.default.resolve(_formio6.default.formFactory(element, form, options));
  }
};

/**
 * Embed this form within the current page.
 * @param embed
 */
_formio6.default.embedForm = function (embed) {
  if (!embed || !embed.src) {
    return null;
  }
  var id = embed.id || 'formio-' + Math.random().toString(36).substring(7);
  var className = embed.class || 'formio-form-wrapper';
  var code = embed.styles ? '<link rel="stylesheet" href="' + embed.styles + '">' : '';
  code += '<div id="' + id + '" class="' + className + '"></div>';
  document.write(code);
  var formElement = document.getElementById(id);
  return _formio6.default.createForm(formElement, embed.src);
};

exports.Formio = _formio6.default;
exports.FormioForm = _formio4.default;
exports.FormioWizard = _formio2.default;