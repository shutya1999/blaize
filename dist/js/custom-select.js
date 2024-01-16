"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CLASS_NAME_SELECT = 'select';
var CLASS_NAME_ACTIVE = 'select_show';
var CLASS_NAME_SELECTED = 'select__option_selected';
var SELECTOR_ACTIVE = '.select_show';
var SELECTOR_DATA = '[data-select]';
var SELECTOR_DATA_TOGGLE = '[data-select="toggle"]';
var SELECTOR_OPTION_SELECTED = '.select__option_selected';
var CustomSelect = /*#__PURE__*/function () {
  function CustomSelect(target, params) {
    _classCallCheck(this, CustomSelect);
    this._elRoot = typeof target === 'string' ? document.querySelector(target) : target;
    this._params = params || {};
    if (this._params['options']) {
      this._elRoot.classList.add(CLASS_NAME_SELECT);
      this._elRoot.innerHTML = CustomSelect.template(this._elRoot, this._params);
    }
    this._elToggle = this._elRoot.querySelector(SELECTOR_DATA_TOGGLE);
    this._elHidden = this._elRoot.querySelector('input[type=hidden]');
    this._elRoot.addEventListener('click', this._onClick.bind(this, 'click'));
    this._elToggle.addEventListener('focus', this._onClick.bind(this, 'focus'));
    this._elToggle.addEventListener('focusout', this._onBlur.bind(this));
    if (this._params.search) this._oninput(this._elRoot, this._params);
    this.afterInit();
  }
  _createClass(CustomSelect, [{
    key: "_onBlur",
    value: function _onBlur(e) {
      if (e.relatedTarget !== null) {
        this.hide();
      }
    }
  }, {
    key: "_onClick",
    value: function _onClick(eventType, e) {
      var _this = this;
      if (eventType === 'focus') {
        setTimeout(function () {
          _this.show();
        }, 300);
      } else {
        var target = e.target;
        if (target.closest(SELECTOR_DATA) !== null) {
          var type = target.closest(SELECTOR_DATA).dataset.select;
          switch (type) {
            case 'toggle':
              this.toggle();
              break;
            case 'option':
              this._changeValue(target);
              break;
          }
        }
      }
    }
  }, {
    key: "_update",
    value: function _update(option) {
      var multiselect = this._params.multiselect;
      if (multiselect) {
        option = option.closest('.select__option');
        option.classList.toggle(CLASS_NAME_SELECTED);
        var selectedOptions = this._elRoot.querySelectorAll(SELECTOR_OPTION_SELECTED);
        var values = [];
        selectedOptions.forEach(function (selected) {
          values.push(selected.dataset.value);
        });
        this._elToggle.value = values.join(',');
      } else {
        option = option.closest('.select__option');
        var selected = this._elRoot.querySelector(SELECTOR_OPTION_SELECTED);
        if (selected) {
          selected.classList.remove(CLASS_NAME_SELECTED);
        }
        option.classList.add(CLASS_NAME_SELECTED);
        if (this._elToggle.dataset.type === 'search') {
          this._elToggle.value = option.textContent;
          this._elHidden.value = option.dataset['value'];
        } else {
          this._elToggle.textContent = option.textContent;
          this._elToggle.value = option.dataset['value'];
          this._elRoot.classList.add('_selected');
        }
        this._elToggle.dataset.index = option.dataset['index'];
        this._elRoot.dispatchEvent(new CustomEvent('select.change'));
        this._params.onSelected ? this._params.onSelected(this, option) : null;

        // Set value input hidden
        this._elHidden.value = this._elToggle.value;
        // console.log(this._elHidden.value);

        return option.dataset['value'];
      }
    }
  }, {
    key: "_reset",
    value: function _reset() {
      var selected = this._elRoot.querySelector(SELECTOR_OPTION_SELECTED);
      if (selected) {
        selected.classList.remove(CLASS_NAME_SELECTED);
      }
      this._elToggle.textContent = 'Выберите из списка';
      this._elToggle.value = '';
      this._elToggle.dataset.index = -1;
      this._elRoot.dispatchEvent(new CustomEvent('select.change'));
      this._params.onSelected ? this._params.onSelected(this, null) : null;
      return '';
    }
  }, {
    key: "_changeValue",
    value: function _changeValue(option) {
      var multiselect = this._params.multiselect;
      if (multiselect) {
        this._update(option);
        // this.hide();
      } else {
        if (option.classList.contains(CLASS_NAME_SELECTED)) {
          return;
        }
        this._update(option);
        this.hide();
      }
    }
  }, {
    key: "_oninput",
    value: function _oninput(elem, params) {
      var _this2 = this;
      this._elToggle.addEventListener('input', function () {
        var value = _this2._elToggle.value.trim();
        var items = [];
        if (value !== '') {
          params.options.forEach(function (option, index) {
            var hide = '_hide',
              text = option[1];
            if (text.toLowerCase().search(value.toLowerCase()) !== -1) {
              hide = '';
              text = _this2._insertMark(text, text.toLowerCase().search(value.toLowerCase()), value.length);
            }
            items.push("<li class=\"select__option ".concat(hide, "\" data-select=\"option\" data-value=\"").concat(option[0], "\" data-index=\"").concat(index, "\">").concat(text, "</li>"));
          });
          _this2._elRoot.querySelector('.select__options').innerHTML = items.join('');
        } else {
          var _items = [];
          params.options.forEach(function (option, index) {
            _items.push("<li class=\"select__option\" data-select=\"option\" data-value=\"".concat(option[0], "\" data-index=\"").concat(index, "\">").concat(option[1], "</li>"));
          });
          _this2._elRoot.querySelector('.select__options').innerHTML = _items.join('');
        }
        _this2._elRoot.dispatchEvent(new CustomEvent('select.input'));
      });
    }
  }, {
    key: "_insertMark",
    value: function _insertMark(string, pos, length) {
      return string.slice(0, pos) + '<mark>' + string.slice(pos, pos + length) + '</mark>' + string.slice(pos + length);
    }
    // __search_draw(options){
    //
    // }
  }, {
    key: "show",
    value: function show() {
      document.querySelectorAll(SELECTOR_ACTIVE).forEach(function (select) {
        select.classList.remove(CLASS_NAME_ACTIVE);
      });
      this._elRoot.classList.add(CLASS_NAME_ACTIVE);
    }
  }, {
    key: "hide",
    value: function hide() {
      this._elRoot.classList.remove(CLASS_NAME_ACTIVE);
    }
  }, {
    key: "toggle",
    value: function toggle() {
      if (this._elRoot.classList.contains(CLASS_NAME_ACTIVE)) {
        this.hide();
      } else {
        this.show();
      }
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this._elRoot.removeEventListener('click', this._onClick);
    }
  }, {
    key: "value",
    get: function get() {
      return this._elToggle.value;
    },
    set: function set(value) {
      var _this3 = this;
      var isExists = false;
      this._elRoot.querySelectorAll('.select__option').forEach(function (option) {
        if (option.dataset['value'] === value) {
          isExists = true;
          return _this3._update(option);
        }
      });
      if (!isExists) {
        return this._reset();
      }
    }
  }, {
    key: "selectedIndex",
    get: function get() {
      return this._elToggle.dataset['index'];
    },
    set: function set(index) {
      var option = this._elRoot.querySelector(".select__option[data-index=\"".concat(index, "\"]"));
      if (option) {
        return this._update(option);
      }
      return this._reset();
    }
  }, {
    key: "afterInit",
    value: function afterInit() {
      this._elToggle.addEventListener('focus', function (e) {
        if (e.isTrusted) {
          // this.show();
        }

        // this.toggle();
        // this.show();
        // let blurClick = new Event('click');
        // this._elRoot.dispatchEvent(blurClick);
        //     if (!this._elToggle.classList.contains('select_show')){
        //         this._elToggle.classList.add('select_show');
        //     }
      });
    }
  }]);
  return CustomSelect;
}();
CustomSelect.template = function (elRoot, params) {
  // console.log(params);
  var name = params['name'];
  var options = params['options'];
  var targetValue = params['targetValue'];
  var select_type;
  var items = [];
  var selectedIndex = -1;
  var selectedValue = '';
  var selectedContent = 'Выберите из списка';
  var placeholder = params.placeholder !== undefined ? params.placeholder : 'Оберіть із списку або введіть';
  options.forEach(function (option, index) {
    var selectedClass = '';
    if (option[0] === targetValue) {
      selectedClass = ' select__option_selected';
      selectedIndex = index;
      selectedValue = option[0];
      selectedContent = option[1];
    }
    items.push("<li class=\"select__option".concat(selectedClass, "\" data-select=\"option\" data-value=\"").concat(option[0], "\" data-index=\"").concat(index, "\">").concat(option[1], "</li>"));
  });

  // if (params.search){
  //     let input_trigger = `<input type="text" class="select__input" value="${selectedContent}" data-select="toggle" data-type="search" data-index="${selectedIndex}">`;
  //     if (selectedValue === '') {
  //         input_trigger = `<input type="text" class="select__input" placeholder="${placeholder}" data-select="toggle" data-type="search" data-index="${selectedIndex}">`;
  //     }
  //     select_type = `
  //         <div class="select__toggle">
  //             ${input_trigger}
  //             <input type="hidden" value="${selectedValue}" name="${name}">
  //         </div>
  //     `;
  // }else {
  //     select_type = `
  //         <div class="select__toggle">
  //             <button type="button" name="${name}" value="${selectedValue}" data-type="button" data-select="toggle" data-index="${selectedIndex}">${selectedContent}</button>
  //         </div>
  //     `;
  // }

  if (params.search) {
    var input_trigger = "<input type=\"text\" class=\"select__input\" placeholder=\"".concat(placeholder, "\" value=\"").concat(selectedContent, "\" data-select=\"toggle\" data-type=\"search\" data-index=\"").concat(selectedIndex, "\" onblur=\"selectHandlerBlur(this)\" autocomplete=\"none\">");
    if (selectedValue === '') {
      input_trigger = "<input type=\"text\" placeholder=\"".concat(placeholder, "\" class=\"select__input\" data-select=\"toggle\" data-type=\"search\" data-index=\"").concat(selectedIndex, "\" onblur=\"selectHandlerBlur(this)\" autocomplete=\"none\">");
    }
    select_type = "\n            <div class=\"select__toggle\">\n                ".concat(input_trigger, "\n                <input type=\"hidden\" value=\"").concat(selectedValue, "\" name=\"").concat(name, "\">\n            </div>\n        ");
  } else {
    select_type = "\n            <div class=\"select__toggle\">       \n                <label>\u0422\u0435\u0441\u0442</label>        \n                <button type=\"button\" name=\"".concat(name, "-btn\" value=\"").concat(selectedValue, "\" data-type=\"button\" data-select=\"toggle\" data-index=\"").concat(selectedIndex, "\" onblur=\"selectHandlerBlur(this)\">").concat(selectedContent, "</button>\n                <input type=\"hidden\" class=\"select-hidden\" name=\"").concat(name, "\">\n            </div>\n        ");
  }
  var block_error = '';
  if (elRoot.closest('.required')) {
    block_error = "<div class=\"help-block\">".concat(elRoot.dataset.i18Error, "</div>");
  } else {
    if (elRoot.dataset.i18Error !== undefined) {
      block_error = "<div class=\"help-block\">".concat(elRoot.dataset.i18Error, "</div>");
    } else {
      block_error = "<div class=\"help-block\"></div>";
    }
  }
  return "\n        ".concat(select_type, "\n        <div class=\"select__dropdown\">\n            <ul class=\"select__options\">").concat(items.join(''), "</ul>\n        </div>\n        ").concat(block_error, "\n    ");
};
document.addEventListener('click', function (e) {
  if (!e.target.closest('.select')) {
    document.querySelectorAll(SELECTOR_ACTIVE).forEach(function (select) {
      select.classList.remove(CLASS_NAME_ACTIVE);
    });
  }
});
var inputs = document.querySelectorAll('.select.required .select__input');
function selectHandlerBlur(input) {
  // console.log(input);
  if (input.closest('button')) {
    setTimeout(function () {
      validCustomSelect();
    }, 200);
  } else {
    setTimeout(function () {
      validCustomSelect();
    }, 500);
  }
  function validCustomSelect() {
    if (input.closest('.required')) {
      var select = input.closest('.select');
      var select_list = select.querySelector('.select__options .select__option.select__option_selected');

      // console.log(select_list);
      if (select_list !== null) {
        select.classList.remove('has-error');
      } else {
        select.classList.add('has-error');
      }
    }
  }
}