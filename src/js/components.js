const header = document.querySelector('header');

let recalcAccordionHeight;
window.addEventListener('load', () => {
// Custom VH
    let vh = window.innerHeight * 0.01;
    let vw = document.documentElement.clientWidth;

    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        let vw = document.documentElement.clientWidth;
        document.documentElement.style.setProperty('--vw', `${vw}px`);
    });

    document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);


    // Accordion height
    let accordion_items = document.querySelectorAll('.js-accordion');

    if (accordion_items.length > 0) {
        accordion_items.forEach(item => {
            const btn = item.querySelector('.js-accordion-btn'),
                content = item.querySelector('.js-accordion-content');

            if (btn) {
                btn.addEventListener('click', () => {
                    item.classList.toggle('active');
                })
            }


            if (content) {
                item.style.setProperty('--height', `${content.clientHeight}px`);
                item.classList.add('_init');
            }
        })
    }
    recalcAccordionHeight = (accordion) => {
        console.log(accordion);
        const content_wrapper = accordion.querySelector('.js-accordion-content .accordion-content__wrapper');


        if (content_wrapper) {
            accordion.style.setProperty('--height', `${content_wrapper.clientHeight}px`);
            accordion.classList.add('_init');
        }
    }
})


// Remove class
function removeClass(nodes, className) {
    nodes.forEach(node => {
        node.classList.remove(className);
    })
}

function addClass(nodes, className) {
    nodes.forEach(node => {
        node.classList.add(className);
    })
}

const supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

let btns_anchor = document.querySelectorAll('._js-anchor');
btns_anchor.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        let href = btn.dataset.anchor;
        const target = document.querySelector(`#${href}`);

        const topOffset = target.offsetTop - document.querySelector('nav').clientHeight - 20;
        window.scrollTo({
            top: topOffset,
            behavior: "smooth"
        });

        if (btn.closest('.nav') && btn.closest('.nav').classList.contains('active')) {
            btn.closest('.nav').classList.remove('active');
        }
    })
})

const burger = document.querySelector('.burger');

burger.addEventListener('click', () => {
    header.classList.toggle('active');
    closeAllModal();
    bodyLockToggle();
})
// Tabs
let tabBlocks = document.querySelectorAll('._js-tab');
if (tabBlocks.length > 0) {
    tabBlocks.forEach(tabBlock => {
        const btns = tabBlock.querySelectorAll('._js-tab-btn'),
            tabItems = tabBlock.querySelectorAll('._js-tab-item');


        if (btns.length > 1) {
            if (tabBlock.classList.contains('animation')) {
                let activeBlock = tabBlock.querySelector('._js-tab-item.active .tab-item__wrapper');
                tabBlock.querySelector('.tab-content').style.height = `${activeBlock.clientHeight}px`;
            }

            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    let activeBlock = tabBlock.querySelector(`._js-tab-item[data-id='${btn.dataset.id}']`);

                    removeClass(btns, 'active');
                    removeClass(tabItems, 'active');

                    btn.classList.add('active');
                    activeBlock.classList.add('active');

                    // If block have animation
                    if (tabBlock.classList.contains('animation')) {
                        let activeBlock = tabBlock.querySelector('._js-tab-item.active .tab-item__wrapper');
                        tabBlock.querySelector('.tab-content').style.height = `${activeBlock.clientHeight}px`;
                    } else {
                        // If block have swiper
                        if (tabBlock.querySelector('.swiper-tabs')) {
                            initSwiperTabs();
                        }
                    }

                    // Скролл якщо елемент виходе за рамки екрану
                    buttonsOffset(tabBlock, btn);
                })
            })
        } else {
            tabBlock.classList.add('inactive');
        }
    })

    function buttonsOffset(tabBlock, btn) {
        const block_wrapper = tabBlock.querySelector('.tabs-buttons');
        console.log(block_wrapper);
        let paddingLeft = window.getComputedStyle(block_wrapper, null).getPropertyValue('padding-left') ?? 0;
        let paddingRight = window.getComputedStyle(block_wrapper, null).getPropertyValue('padding-right') ?? 0;
        if (paddingLeft !== '') {
            paddingLeft = +paddingLeft.replace('px', '') * 3;
        }
        if (paddingRight !== '') {
            paddingRight = +paddingRight.replace('px', '') * 3;
        }

        let btn_pos = btn.getBoundingClientRect(),
            block_wrapper_pos = block_wrapper.getBoundingClientRect();

        let need_scroll = false;

        let scroll = 0;
        // Виходе за правий край екрану
        if (btn_pos.right > block_wrapper_pos.right) {
            scroll = block_wrapper.scrollLeft + (btn_pos.right - block_wrapper_pos.right);

            // У випадку якщо таб більший ніж розмір екрану і якщо він після скролу буде виходити за лівий край
            if (btn_pos.width > block_wrapper_pos.width && btn_pos.left - scroll < block_wrapper_pos.left) {
                scroll = scroll - ((btn_pos.left - scroll - block_wrapper_pos.left) * -1);
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
    }
}

function fadeToggle(elem, speed = 500) {
    elem.classList.remove('fade-in');
    elem.classList.remove('fade-out');
    if (elem.classList.contains('active')) {
        elem.classList.add('fade-out');

        setTimeout(() => {
            elem.classList.remove('active');
        }, speed)
    } else {
        elem.classList.add('active');
        elem.classList.add('fade-in');
    }
}


function fadeIn(elem, speed = 500) {
    console.log('fade in');
    elem.classList.remove('fade-in');
    elem.classList.remove('fade-out');

    elem.classList.add('active');
    elem.classList.add('fade-in');
}

function fadeOut(elem, speed = 500) {
    console.log('fade out');
    elem.classList.remove('fade-in');
    elem.classList.remove('fade-out');


    elem.classList.add('fade-out');

    setTimeout(() => {
        elem.classList.remove('active');
    }, speed)
}

// Заблокувати cкрол та прибрати стрибок
let bodyLockStatus = true;

function bodyLockToggle(delay = 500) {
    if (document.documentElement.classList.contains('lock')) {
        bodyUnlock(delay);
    } else {
        bodyLock(delay);
    }
}

function bodyUnlock(delay = 0) {
    console.log('body unlock');
    let body = document.querySelector("body");
    if (bodyLockStatus) {
        let lock_padding = document.querySelectorAll("[data-lp]");
        setTimeout(() => {
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
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

function bodyLock(delay = 0) {

    let body = document.querySelector("body");
    if (bodyLockStatus) {
        let lock_padding = document.querySelectorAll("[data-lp]");
        for (let index = 0; index < lock_padding.length; index++) {
            const el = lock_padding[index];
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

let overlayModal = document.querySelector('.overlay-modal');
if (overlayModal) {
    overlayModal.addEventListener('click', () => {
        closeAllModal();
        bodyUnlock();
    });
}

function closeAllModal() {
    //fadeOut(overlayModal);
    // bodyUnlock();
    overlayModal.classList.remove('active');
    document.querySelectorAll('._js-modal').forEach(modal => {
        modal.classList.remove('active');
    })
}

// Show modal
let btnsOpenModal = document.querySelectorAll('._js-btn-show-modal'),
    btnsCloseModal = document.querySelectorAll('._js-btn-close-modal');

if (btnsOpenModal.length) {
    btnsOpenModal.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.dataset.modal;

            if (modal !== '' && modal !== undefined) {
                const modal_node = document.querySelector(`.js-modal-${modal}`);
                if (modal_node) {

                    // Якщо необхідно кліком на одну й ту ж саму кнопку показувати/ховати модалку
                    if (modal_node.dataset.toggle === '') {
                        document.querySelectorAll('._js-modal').forEach(modal1 => {
                            if (modal1 !== modal_node) {
                                modal1.classList.remove('active');
                            }
                        })

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
        })
    })
}
if (btnsCloseModal.length > 0) {
    btnsCloseModal.forEach(btn => {
        btn.addEventListener('click', () => {
            let modal = btn.closest('._js-modal');

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
        })
    })
}


document.querySelector('.button[type="submit"].active');
// Related blocks
let related_blocks = document.querySelectorAll('.js-related-block');
if (related_blocks.length > 0) {
    related_blocks.forEach(block => {
        block.addEventListener('change', () => {
            let id = block.dataset.relatedId;
            let child = document.querySelectorAll(`.js-related-block[data-related-id='${id}__child']`);

            if (block.checked && child.length > 0) {
                addClass(child, 'active');
            } else {
                removeClass(child, 'active');
            }
        })
    })
}

// Init custom select
let defaultCustomSelects = document.querySelectorAll('._js-custom-select[data-default]');

if (defaultCustomSelects.length) {
    defaultCustomSelects.forEach(selectNode => {
        const select = new CustomSelect(selectNode, {});
    })
}

// Mask Email
function initMaskEmail() {
    let mask_email = document.querySelectorAll('._js-mask-email');

    if (mask_email.length !== 0) {
        mask_email.forEach(email => {
            let mask = new Inputmask({
                showMaskOnHover: false,
                mask: "*{1,100}[.*{1,100}][.*{1,100}][.*{1,100}]@*{1,50}[.*{2,20}][.*{1,20}]",
                placeholder: " ",
                greedy: false,
                onBeforePaste: function (pastedValue, opts) {
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
        })
    }
}

if (document.querySelector('#maskinput-script')) {
    document.querySelector('#maskinput-script').addEventListener('load', function () {
        initMaskPhone();
        initMaskEmail();
    });
}

// Validate inputs
let form_groups_required = document.querySelectorAll('.form-group.required, .form-group.valid-not-required');
form_groups_required.forEach(form_group => validate(form_group))

const formGroups = document.querySelectorAll('.form-group');
if (formGroups.length){
    formGroups.forEach(formGroup => {
        const btnClear = formGroup.querySelector('.btn-clear'),
            input = formGroup.querySelector('.form-input');

        if(btnClear){
            input.addEventListener('input', () => {
                if (input.value.trim() !== '' && !formGroup.classList.contains('_show-btn-clear') && !formGroup.classList.contains('has-error')){
                    formGroup.classList.add('_show-btn-clear');
                }else if (input.value.trim() === ''){
                    formGroup.classList.remove('_show-btn-clear');
                }
            })

            input.addEventListener('blur', () => {
                setTimeout(() => {
                    formGroup.classList.remove('_show-btn-clear');
                }, 100)
            })

            btnClear.addEventListener('click', () => {
                input.value = '';
                formGroup.classList.remove('_show-btn-clear');
            })
        }
    })
}

function validate(form_group) {
    const valid_type_arr = form_group.dataset.valid.split(',');

    if (valid_type_arr.length > 0) {
        let error_count = 0;
        for (let i = 0; i < valid_type_arr.length; i++) {
            let valid_type = valid_type_arr[i];
            if (valid_type_arr[i].indexOf('maxlength') !== -1) {
                valid_type = 'maxlength';
            }

            switch (valid_type) {
                case 'empty': {
                    form_group.querySelector('input, textarea').addEventListener('blur', () => {
                        if (form_group.classList.contains('required')) {
                            if (i === 0) {
                                error_count = +!validateField(form_group, valid_type);
                            } else {
                                if (error_count === 0) {
                                    error_count = +!validateField(form_group, valid_type);
                                }
                            }
                        }
                    })
                    break;
                }
                case 'mask': {
                    form_group.querySelector('input').addEventListener('blur', () => {
                        if (form_group.classList.contains('required')) {
                            if (i === 0) {
                                error_count = +!validateField(form_group, valid_type);
                            } else {
                                if (error_count === 0) {
                                    error_count = +!validateField(form_group, valid_type);
                                }
                            }
                        }
                    })
                    break;
                }
                case 'checkbox': {
                    form_group.querySelector('input').addEventListener('change', () => {
                        if (form_group.classList.contains('required')) {
                            if (i === 0) {
                                error_count = +!validateField(form_group, valid_type);
                            } else {
                                if (error_count === 0) {
                                    error_count = +!validateField(form_group, valid_type);
                                }
                            }
                        }
                    })
                    break;
                }
                case 'maxlength': {
                    form_group.querySelector('input, textarea').addEventListener('blur', () => {
                        if (i === 0) {
                            error_count = +!validateField(form_group, valid_type_arr[i]);
                        } else {
                            if (error_count === 0) {
                                error_count = +!validateField(form_group, valid_type_arr[i]);
                            }
                        }
                    })
                    break;
                }
                case 'cyrillic': {
                    form_group.querySelector('input, textarea').addEventListener('blur', () => {
                        if (i === 0) {
                            error_count = +!validateField(form_group, valid_type);
                        } else {
                            if (error_count === 0) {
                                error_count = +!validateField(form_group, valid_type);
                            }
                        }
                    })
                    break;
                }
                case 'number': {
                    form_group.querySelector('input, textarea').addEventListener('blur', () => {
                        if (i === 0) {
                            error_count = +!validateField(form_group, valid_type);
                        } else {
                            if (error_count === 0) {
                                error_count = +!validateField(form_group, valid_type);
                            }
                        }
                    })
                    break;
                }
            }
        }
    }
}

function validateField(form_group, valid_type) {
    let maxlength;
    if (valid_type.indexOf('maxlength') !== -1) {
        maxlength = valid_type.split('-')[1];
        valid_type = 'maxlength';
    }
    switch (valid_type) {
        case 'empty': {
            const input = form_group.querySelector('input, textarea');

            if (input.value.trim() === "") {
                form_group.classList.add('has-error');
                form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.empty;

                return false;
            } else {
                form_group.classList.remove('has-error');
            }

            return true;
        }
        case 'mask': {
            const input = form_group.querySelector('input');

            if (input.inputmask.isComplete()) {
                form_group.classList.remove('has-error');
            } else {
                form_group.classList.add('has-error');
                form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.empty;
                return false;
            }
            return true;
        }
        case 'checkbox': {
            const input = form_group.querySelector('input');
            if (input.checked) {
                form_group.classList.remove('has-error');
            } else {
                form_group.classList.add('has-error');
                form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.empty;
                return false;
            }
            return true;
        }
        case 'select': {
            let select_target = form_group.querySelector('[data-select]');
            let val = '';

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
        case 'maxlength': {
            const input = form_group.querySelector('input, textarea');

            if (input.value.length > maxlength) {
                form_group.classList.add('has-error');
                form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.maxlength;
                return false;
            } else {
                form_group.classList.remove('has-error');
            }

            return true;
        }
        case 'cyrillic': {
            const input = form_group.querySelector('input, textarea');
            // let regex = /^[а-яіїє' -]+$/gi;
            let regex = /^([а-яіїє' -]+)?$/gi;


            if (!regex.test(input.value)) {
                form_group.classList.add('has-error');
                form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.cyrillic;

                return false;
            } else {
                form_group.classList.remove('has-error');
            }

            return true;
        }
        case 'number': {
            const input = form_group.querySelector('input, textarea');
            // let regex = /^[а-яіїє' -]+$/gi;
            let regex = /^\d+$/;

            if (!regex.test(input.value)) {
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
    let required_fields = form.querySelectorAll('.required');
    let errors = 0;
    let errors_fields = [];

    required_fields.forEach(form_group => {
        const valid_type_arr = form_group.dataset.valid.split(',');
        let error_valid_count = 0;

        for (let i = 0; i < valid_type_arr.length; i++) {
            let valid_type = valid_type_arr[i];

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
            block: "center",
        });
        return false;
    }
}

function resetForm(form) {
    form.reset();
    let form_groups = form.querySelectorAll('.form-group');

    form_groups.forEach(form_group => {
        form_group.classList.remove('focus');
    })
}

// Анимация при скроле
function animation() {
    const animItems = document.querySelectorAll('._anim-items');

    if (animItems.length > 0) {
        window.addEventListener('scroll', animScroll)

        function animScroll() {
            for (let index = 0; index < animItems.length; index++) {
                const animItem = animItems[index],
                    animItemHeight = animItem.offsetHeight,
                    animItemOffset = offset(animItem).top,
                    animStart = (animItem.dataset.start !== undefined) ? +animItem.dataset.start : 2;


                let animItemPoint = window.innerHeight - animItemHeight / animStart;

                if (animItemHeight > window.innerHeight) {
                    animItemPoint = window.innerHeight - window.innerHeight / animStart;
                }

                if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
                    animItem.classList.add('_active');
                } else {
                    if (!animItem.classList.contains('_anim-no-hide')) {
                        animItem.classList.remove('_active');
                    }
                }
            }
        }

        function offset(el) {
            const rect = el.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            return {top: rect.top + scrollTop, left: rect.left + scrollLeft};
        }

        animScroll();
    }
}

animation();

function hideHeader() {
    let last_scroll = 0;
    const header = document.querySelector('header'),
        defaultOffset = 100;

    const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
    const containHide = () => header.classList.contains('hold');

    window.addEventListener('scroll', () => {
        if (scrollPosition() > last_scroll && !containHide() && scrollPosition() > defaultOffset) {
            header.classList.add('hold');

        } else if (scrollPosition() < last_scroll && containHide()) {
            header.classList.remove('hold');

        }

        last_scroll = scrollPosition();
    })
}
hideHeader();


// Swiper CEO
if (document.querySelector('.swiper-ceo')){
    new Swiper('.swiper-ceo', {
        slidesPerView: 1.1,
        spaceBetween: 20,
    })
}

// Swiper Team
if (document.querySelector('.team-swiper')){
    new Swiper('.team-swiper', {
        slidesPerView: 1.45,
        freeMode: {
            enabled: true,
            sticky: false,
        },
        //slidesPerView: 1.45,
        spaceBetween: 64,
    })
}
