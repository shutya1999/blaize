"use strict";

var header = document.querySelector('header');
var recalcAccordionHeight;
window.addEventListener('load', function () {
  // Custom VH
  var vh = window.innerHeight * 0.01;
  var vw = document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
  document.documentElement.style.setProperty('--vw', "".concat(vw, "px"));
  window.addEventListener('resize', function () {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
    var vw = document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--vw', "".concat(vw, "px"));
  });
  document.documentElement.style.setProperty('--header-height', "".concat(header.getBoundingClientRect().height, "px"));

  // Accordion height
  var accordion_items = document.querySelectorAll('.js-accordion');
  if (accordion_items.length > 0) {
    accordion_items.forEach(function (item) {
      var btn = item.querySelector('.js-accordion-btn'),
        content = item.querySelector('.js-accordion-content');
      if (btn) {
        btn.addEventListener('click', function () {
          item.classList.toggle('active');
        });
      }
      if (content) {
        item.style.setProperty('--height', "".concat(content.clientHeight, "px"));
        item.classList.add('_init');
      }
    });
  }
  recalcAccordionHeight = function recalcAccordionHeight(accordion) {
    console.log(accordion);
    var content_wrapper = accordion.querySelector('.js-accordion-content .accordion-content__wrapper');
    if (content_wrapper) {
      accordion.style.setProperty('--height', "".concat(content_wrapper.clientHeight, "px"));
      accordion.classList.add('_init');
    }
  };
});

// Remove class
function removeClass(nodes, className) {
  nodes.forEach(function (node) {
    node.classList.remove(className);
  });
}
function addClass(nodes, className) {
  nodes.forEach(function (node) {
    node.classList.add(className);
  });
}
var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
var btns_anchor = document.querySelectorAll('._js-anchor');
btns_anchor.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    var href = btn.dataset.anchor;
    var target = document.querySelector("#".concat(href));
    var topOffset = target.offsetTop - document.querySelector('nav').clientHeight - 20;
    window.scrollTo({
      top: topOffset,
      behavior: "smooth"
    });
    if (btn.closest('.nav') && btn.closest('.nav').classList.contains('active')) {
      btn.closest('.nav').classList.remove('active');
    }
  });
});
var burger = document.querySelector('.burger');
burger.addEventListener('click', function () {
  header.classList.toggle('active');
  closeAllModal();
  bodyLockToggle();
});
// Tabs
var tabBlocks = document.querySelectorAll('._js-tab');
if (tabBlocks.length > 0) {
  var buttonsOffset = function buttonsOffset(tabBlock, btn) {
    var _window$getComputedSt, _window$getComputedSt2;
    var block_wrapper = tabBlock.querySelector('.tabs-buttons');
    console.log(block_wrapper);
    var paddingLeft = (_window$getComputedSt = window.getComputedStyle(block_wrapper, null).getPropertyValue('padding-left')) !== null && _window$getComputedSt !== void 0 ? _window$getComputedSt : 0;
    var paddingRight = (_window$getComputedSt2 = window.getComputedStyle(block_wrapper, null).getPropertyValue('padding-right')) !== null && _window$getComputedSt2 !== void 0 ? _window$getComputedSt2 : 0;
    if (paddingLeft !== '') {
      paddingLeft = +paddingLeft.replace('px', '') * 3;
    }
    if (paddingRight !== '') {
      paddingRight = +paddingRight.replace('px', '') * 3;
    }
    var btn_pos = btn.getBoundingClientRect(),
      block_wrapper_pos = block_wrapper.getBoundingClientRect();
    var need_scroll = false;
    var scroll = 0;
    // Виходе за правий край екрану
    if (btn_pos.right > block_wrapper_pos.right) {
      scroll = block_wrapper.scrollLeft + (btn_pos.right - block_wrapper_pos.right);

      // У випадку якщо таб більший ніж розмір екрану і якщо він після скролу буде виходити за лівий край
      if (btn_pos.width > block_wrapper_pos.width && btn_pos.left - scroll < block_wrapper_pos.left) {
        scroll = scroll - (btn_pos.left - scroll - block_wrapper_pos.left) * -1;
      }
      scroll = scroll + paddingRight;
      need_scroll = true;
    }

    // Виходе за лівий край екрану
    if (btn_pos.left < block_wrapper_pos.left) {
      scroll = block_wrapper.scrollLeft - (btn_pos.left * -1 + block_wrapper_pos.left);
      need_scroll = true;
      scroll = scroll - paddingLeft;
    }
    if (need_scroll) {
      block_wrapper.scrollTo({
        left: scroll,
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  tabBlocks.forEach(function (tabBlock) {
    var btns = tabBlock.querySelectorAll('._js-tab-btn'),
      tabItems = tabBlock.querySelectorAll('._js-tab-item');
    if (btns.length > 1) {
      if (tabBlock.classList.contains('animation')) {
        var activeBlock = tabBlock.querySelector('._js-tab-item.active .tab-item__wrapper');
        tabBlock.querySelector('.tab-content').style.height = "".concat(activeBlock.clientHeight, "px");
      }
      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var activeBlock = tabBlock.querySelector("._js-tab-item[data-id='".concat(btn.dataset.id, "']"));
          removeClass(btns, 'active');
          removeClass(tabItems, 'active');
          btn.classList.add('active');
          activeBlock.classList.add('active');

          // If block have animation
          if (tabBlock.classList.contains('animation')) {
            var _activeBlock = tabBlock.querySelector('._js-tab-item.active .tab-item__wrapper');
            tabBlock.querySelector('.tab-content').style.height = "".concat(_activeBlock.clientHeight, "px");
          } else {
            // If block have swiper
            if (tabBlock.querySelector('.swiper-tabs')) {
              initSwiperTabs();
            }
          }

          // Скролл якщо елемент виходе за рамки екрану
          buttonsOffset(tabBlock, btn);
        });
      });
    } else {
      tabBlock.classList.add('inactive');
    }
  });
}
function fadeToggle(elem) {
  var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  elem.classList.remove('fade-in');
  elem.classList.remove('fade-out');
  if (elem.classList.contains('active')) {
    elem.classList.add('fade-out');
    setTimeout(function () {
      elem.classList.remove('active');
    }, speed);
  } else {
    elem.classList.add('active');
    elem.classList.add('fade-in');
  }
}
function fadeIn(elem) {
  var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  console.log('fade in');
  elem.classList.remove('fade-in');
  elem.classList.remove('fade-out');
  elem.classList.add('active');
  elem.classList.add('fade-in');
}
function fadeOut(elem) {
  var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  console.log('fade out');
  elem.classList.remove('fade-in');
  elem.classList.remove('fade-out');
  elem.classList.add('fade-out');
  setTimeout(function () {
    elem.classList.remove('active');
  }, speed);
}

// Заблокувати cкрол та прибрати стрибок
var bodyLockStatus = true;
function bodyLockToggle() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
  if (document.documentElement.classList.contains('lock')) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
}
function bodyUnlock() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  console.log('body unlock');
  var body = document.querySelector("body");
  if (bodyLockStatus) {
    var lock_padding = document.querySelectorAll("[data-lp]");
    setTimeout(function () {
      for (var index = 0; index < lock_padding.length; index++) {
        var el = lock_padding[index];
        el.style.paddingRight = '0px';
      }
      body.style.paddingRight = '0px';
      document.documentElement.classList.remove("lock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
}
function bodyLock() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var body = document.querySelector("body");
  if (bodyLockStatus) {
    var lock_padding = document.querySelectorAll("[data-lp]");
    for (var index = 0; index < lock_padding.length; index++) {
      var el = lock_padding[index];
      el.style.paddingRight = window.innerWidth - document.querySelector('.main').offsetWidth + 'px';
    }
    body.style.paddingRight = window.innerWidth - document.querySelector('.main').offsetWidth + 'px';
    document.documentElement.classList.add("lock");
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
}
var overlayModal = document.querySelector('.overlay-modal');
if (overlayModal) {
  overlayModal.addEventListener('click', function () {
    closeAllModal();
    bodyUnlock();
  });
}
function closeAllModal() {
  //fadeOut(overlayModal);
  // bodyUnlock();
  overlayModal.classList.remove('active');
  document.querySelectorAll('._js-modal').forEach(function (modal) {
    modal.classList.remove('active');
  });
}

// Show modal
var btnsOpenModal = document.querySelectorAll('._js-btn-show-modal'),
  btnsCloseModal = document.querySelectorAll('._js-btn-close-modal');
if (btnsOpenModal.length) {
  btnsOpenModal.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal = btn.dataset.modal;
      if (modal !== '' && modal !== undefined) {
        var modal_node = document.querySelector(".js-modal-".concat(modal));
        if (modal_node) {
          // Якщо необхідно кліком на одну й ту ж саму кнопку показувати/ховати модалку
          if (modal_node.dataset.toggle === '') {
            document.querySelectorAll('._js-modal').forEach(function (modal1) {
              if (modal1 !== modal_node) {
                modal1.classList.remove('active');
              }
            });
            if (modal_node.classList.contains('active')) {
              modal_node.classList.remove('active');
              bodyUnlock();

              // If need show blur overlay
              if (modal_node.dataset.overlay === '') {
                console.log(3);
                overlayModal.classList.remove('active');
                //fadeOut(overlayModal);
              }
            } else {
              modal_node.classList.add('active');
              bodyLock();

              // If need show blur overlay
              if (modal_node.dataset.overlay === '') {
                console.log(4);
                overlayModal.classList.add('active');
                //fadeIn(overlayModal);
              }
            }
          } else {
            closeAllModal();
            modal_node.classList.add('active');
            bodyLock();

            // If need show blur overlay

            if (modal_node.dataset.overlay === '') {
              console.log(1);
              overlayModal.classList.add('active');
              //fadeIn(overlayModal);
            }
          }
          if (modal === 'filters') {
            eventOpenFilters();
          }
        }
      }
    });
  });
}
if (btnsCloseModal.length > 0) {
  btnsCloseModal.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal = btn.closest('._js-modal');
      console.log(modal);
      if (modal) {
        modal.classList.remove('active');
      }
      bodyUnlock();
      // If need show blur overlay
      if (modal.dataset.overlay === '') {
        console.log(2);
        overlayModal.classList.remove('active');
        //fadeOut(overlayModal);
      }
    });
  });
}
document.querySelector('.button[type="submit"].active');
// Related blocks
var related_blocks = document.querySelectorAll('.js-related-block');
if (related_blocks.length > 0) {
  related_blocks.forEach(function (block) {
    block.addEventListener('change', function () {
      var id = block.dataset.relatedId;
      var child = document.querySelectorAll(".js-related-block[data-related-id='".concat(id, "__child']"));
      if (block.checked && child.length > 0) {
        addClass(child, 'active');
      } else {
        removeClass(child, 'active');
      }
    });
  });
}

// Init custom select
var defaultCustomSelects = document.querySelectorAll('._js-custom-select[data-default]');
if (defaultCustomSelects.length) {
  defaultCustomSelects.forEach(function (selectNode) {
    var select = new CustomSelect(selectNode, {});
  });
}

// Mask Email
function initMaskEmail() {
  var mask_email = document.querySelectorAll('._js-mask-email');
  if (mask_email.length !== 0) {
    mask_email.forEach(function (email) {
      var mask = new Inputmask({
        showMaskOnHover: false,
        mask: "*{1,100}[.*{1,100}][.*{1,100}][.*{1,100}]@*{1,50}[.*{2,20}][.*{1,20}]",
        placeholder: " ",
        greedy: false,
        onBeforePaste: function onBeforePaste(pastedValue, opts) {
          pastedValue = pastedValue.toLowerCase();
          return pastedValue.replace("mailto:", "");
        },
        definitions: {
          '*': {
            validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
            casing: "lower"
          }
        }
      });
      mask.mask(email);
    });
  }
}
if (document.querySelector('#maskinput-script')) {
  document.querySelector('#maskinput-script').addEventListener('load', function () {
    initMaskPhone();
    initMaskEmail();
  });
}

// Validate inputs
var form_groups_required = document.querySelectorAll('.form-group.required, .form-group.valid-not-required');
form_groups_required.forEach(function (form_group) {
  return validate(form_group);
});
var formGroups = document.querySelectorAll('.form-group');
if (formGroups.length) {
  formGroups.forEach(function (formGroup) {
    var btnClear = formGroup.querySelector('.btn-clear'),
      input = formGroup.querySelector('.form-input');
    if (btnClear) {
      input.addEventListener('input', function () {
        if (input.value.trim() !== '' && !formGroup.classList.contains('_show-btn-clear') && !formGroup.classList.contains('has-error')) {
          formGroup.classList.add('_show-btn-clear');
        } else if (input.value.trim() === '') {
          formGroup.classList.remove('_show-btn-clear');
        }
      });
      input.addEventListener('blur', function () {
        setTimeout(function () {
          formGroup.classList.remove('_show-btn-clear');
        }, 100);
      });
      btnClear.addEventListener('click', function () {
        input.value = '';
        formGroup.classList.remove('_show-btn-clear');
      });
    }
  });
}
function validate(form_group) {
  var valid_type_arr = form_group.dataset.valid.split(',');
  if (valid_type_arr.length > 0) {
    var error_count = 0;
    var _loop = function _loop(i) {
      var valid_type = valid_type_arr[i];
      if (valid_type_arr[i].indexOf('maxlength') !== -1) {
        valid_type = 'maxlength';
      }
      switch (valid_type) {
        case 'empty':
          {
            form_group.querySelector('input, textarea').addEventListener('blur', function () {
              if (form_group.classList.contains('required')) {
                if (i === 0) {
                  error_count = +!validateField(form_group, valid_type);
                } else {
                  if (error_count === 0) {
                    error_count = +!validateField(form_group, valid_type);
                  }
                }
              }
            });
            break;
          }
        case 'mask':
          {
            form_group.querySelector('input').addEventListener('blur', function () {
              if (form_group.classList.contains('required')) {
                if (i === 0) {
                  error_count = +!validateField(form_group, valid_type);
                } else {
                  if (error_count === 0) {
                    error_count = +!validateField(form_group, valid_type);
                  }
                }
              }
            });
            break;
          }
        case 'checkbox':
          {
            form_group.querySelector('input').addEventListener('change', function () {
              if (form_group.classList.contains('required')) {
                if (i === 0) {
                  error_count = +!validateField(form_group, valid_type);
                } else {
                  if (error_count === 0) {
                    error_count = +!validateField(form_group, valid_type);
                  }
                }
              }
            });
            break;
          }
        case 'maxlength':
          {
            form_group.querySelector('input, textarea').addEventListener('blur', function () {
              if (i === 0) {
                error_count = +!validateField(form_group, valid_type_arr[i]);
              } else {
                if (error_count === 0) {
                  error_count = +!validateField(form_group, valid_type_arr[i]);
                }
              }
            });
            break;
          }
        case 'cyrillic':
          {
            form_group.querySelector('input, textarea').addEventListener('blur', function () {
              if (i === 0) {
                error_count = +!validateField(form_group, valid_type);
              } else {
                if (error_count === 0) {
                  error_count = +!validateField(form_group, valid_type);
                }
              }
            });
            break;
          }
        case 'number':
          {
            form_group.querySelector('input, textarea').addEventListener('blur', function () {
              if (i === 0) {
                error_count = +!validateField(form_group, valid_type);
              } else {
                if (error_count === 0) {
                  error_count = +!validateField(form_group, valid_type);
                }
              }
            });
            break;
          }
      }
    };
    for (var i = 0; i < valid_type_arr.length; i++) {
      _loop(i);
    }
  }
}
function validateField(form_group, valid_type) {
  var maxlength;
  if (valid_type.indexOf('maxlength') !== -1) {
    maxlength = valid_type.split('-')[1];
    valid_type = 'maxlength';
  }
  switch (valid_type) {
    case 'empty':
      {
        var input = form_group.querySelector('input, textarea');
        if (input.value.trim() === "") {
          form_group.classList.add('has-error');
          form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.empty;
          return false;
        } else {
          form_group.classList.remove('has-error');
        }
        return true;
      }
    case 'mask':
      {
        var _input = form_group.querySelector('input');
        if (_input.inputmask.isComplete()) {
          form_group.classList.remove('has-error');
        } else {
          form_group.classList.add('has-error');
          form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.empty;
          return false;
        }
        return true;
      }
    case 'checkbox':
      {
        var _input2 = form_group.querySelector('input');
        if (_input2.checked) {
          form_group.classList.remove('has-error');
        } else {
          form_group.classList.add('has-error');
          form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.empty;
          return false;
        }
        return true;
      }
    case 'select':
      {
        var select_target = form_group.querySelector('[data-select]');
        var val = '';
        if (select_target.dataset.type === 'button') {
          val = form_group.querySelector('button').value.trim();
        } else {
          val = form_group.querySelector('input[type="hidden"]').value.trim();
        }
        if (val === '') {
          form_group.classList.add('has-error');
          return false;
        } else {
          form_group.classList.remove('has-error');
        }
        return true;
      }
    case 'maxlength':
      {
        var _input3 = form_group.querySelector('input, textarea');
        if (_input3.value.length > maxlength) {
          form_group.classList.add('has-error');
          form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.maxlength;
          return false;
        } else {
          form_group.classList.remove('has-error');
        }
        return true;
      }
    case 'cyrillic':
      {
        var _input4 = form_group.querySelector('input, textarea');
        // let regex = /^[а-яіїє' -]+$/gi;
        var regex = /^([а-яіїє' -]+)?$/gi;
        if (!regex.test(_input4.value)) {
          form_group.classList.add('has-error');
          form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.cyrillic;
          return false;
        } else {
          form_group.classList.remove('has-error');
        }
        return true;
      }
    case 'number':
      {
        var _input5 = form_group.querySelector('input, textarea');
        // let regex = /^[а-яіїє' -]+$/gi;
        var _regex = /^\d+$/;
        if (!_regex.test(_input5.value)) {
          form_group.classList.add('has-error');
          form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.number;
          return false;
        } else {
          form_group.classList.remove('has-error');
        }
        return true;
      }
  }
}
function validateForm(form) {
  var required_fields = form.querySelectorAll('.required');
  var errors = 0;
  var errors_fields = [];
  required_fields.forEach(function (form_group) {
    var valid_type_arr = form_group.dataset.valid.split(',');
    var error_valid_count = 0;
    for (var i = 0; i < valid_type_arr.length; i++) {
      var valid_type = valid_type_arr[i];
      if (valid_type_arr[i].indexOf('maxlength') !== -1) {
        valid_type = 'maxlength';
      }
      if (i === 0) {
        // error_valid_count = ;
        if (!validateField(form_group, valid_type_arr[i])) {
          error_valid_count = 1;
          errors += 1;
          errors_fields.push(form_group);
        } else {
          error_valid_count = 0;
        }
      } else {
        if (error_valid_count === 0) {
          if (!validateField(form_group, valid_type_arr[i])) {
            error_valid_count = 1;
            errors += 1;
            errors_fields.push(form_group);
          } else {
            error_valid_count = 0;
          }
        }
      }

      // if (!validateField(form_group, valid_type_arr[i])) {
      //     errors += 1;
      // }
    }
  });
  if (errors === 0) {
    return true;
  } else {
    errors_fields[0].scrollIntoView({
      behavior: 'smooth',
      block: "center"
    });
    return false;
  }
}
function resetForm(form) {
  form.reset();
  var form_groups = form.querySelectorAll('.form-group');
  form_groups.forEach(function (form_group) {
    form_group.classList.remove('focus');
  });
}

// Анимация при скроле
function animation() {
  var animItems = document.querySelectorAll('._anim-items');
  if (animItems.length > 0) {
    var animScroll = function animScroll() {
      for (var index = 0; index < animItems.length; index++) {
        var animItem = animItems[index],
          animItemHeight = animItem.offsetHeight,
          animItemOffset = offset(animItem).top,
          animStart = animItem.dataset.start !== undefined ? +animItem.dataset.start : 2;
        var animItemPoint = window.innerHeight - animItemHeight / animStart;
        if (animItemHeight > window.innerHeight) {
          animItemPoint = window.innerHeight - window.innerHeight / animStart;
        }
        if (pageYOffset > animItemOffset - animItemPoint && pageYOffset < animItemOffset + animItemHeight) {
          animItem.classList.add('_active');
        } else {
          if (!animItem.classList.contains('_anim-no-hide')) {
            animItem.classList.remove('_active');
          }
        }
      }
    };
    var offset = function offset(el) {
      var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
      };
    };
    window.addEventListener('scroll', animScroll);
    animScroll();
  }
}
animation();
function hideHeader() {
  var last_scroll = 0;
  var header = document.querySelector('header'),
    defaultOffset = 100;
  var scrollPosition = function scrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
  };
  var containHide = function containHide() {
    return header.classList.contains('hold');
  };
  window.addEventListener('scroll', function () {
    if (scrollPosition() > last_scroll && !containHide() && scrollPosition() > defaultOffset) {
      header.classList.add('hold');
    } else if (scrollPosition() < last_scroll && containHide()) {
      header.classList.remove('hold');
    }
    last_scroll = scrollPosition();
  });
}
hideHeader();

// Swiper CEO
if (document.querySelector('.swiper-ceo')) {
  new Swiper('.swiper-ceo', {
    slidesPerView: 1.1,
    spaceBetween: 20
  });
}

// Swiper Team
if (document.querySelector('.team-swiper')) {
  new Swiper('.team-swiper', {
    slidesPerView: 1.45,
    freeMode: {
      enabled: true,
      sticky: false
    },
    //slidesPerView: 1.45,
    spaceBetween: 64
  });
}