// Smooth scroll
window.addEventListener('load', () => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const circle = document.querySelector('.scroll-bar__thumb');

    // Виправ код щоб Smooth Scroll від Gsap працював тільки на десктопі
    if (!supportsTouch) {
        let smoother = ScrollSmoother.create({
            smooth: 1,
            effects: true,
        });

        let scrollTween = gsap.to(circle, {
            y: function () {
                return window.innerHeight - circle.getBoundingClientRect().height;
            },
            ease: "none",
            scrollTrigger: {
                start: 0,
                end: 'max',
                scrub: true
            }
        });

        Draggable.create('.scroll-bar__thumb', {
            type: "y",
            bounds: '.scroll-bar',
            inertia: true,
            onPress() {
                scrollTween.scrollTrigger.disable(false);
            },
            onDrag() {
                let progress = gsap.utils.normalize(this.minY, this.maxY, this.y);
                let to = smoother.scrollTrigger.end * progress;
                smoother.scrollTo(to, true);
            },
            onRelease() {
                let progress = gsap.utils.normalize(this.minY, this.maxY, this.y);
                scrollTween.scrollTrigger.enable();
                scrollTween.progress(progress);
            }
        })[0];


        // window.addEventListener('scroll', () => {
        //     smoother.scrollTrigger.refresh();
        // })

        // let hash = window.location.hash;
        // const elem = hash ? document.querySelector(hash) : false
        //
        // const topOffset = elem.offsetTop - header.clientHeight - 20;
        //
        // console.log(topOffset);
        //
        // gsap.to(smoother, {
        //     scrollTop: topOffset,
        //     duration: 1,
        //     delay: 0.5
        // });
    }

    // setTimeout(() => {
    //     let urlParams = new URL(window.location.href);
    //     const hash = urlParams.hash;
    //
    //     const target = document.querySelector(`${hash}`);
    //
    //     console.log(target);
    //
    //     if (target) {
    //         const topOffset = target.offsetTop - header.clientHeight - 20;
    //         window.scrollTo({
    //             top: topOffset,
    //             behavior: "smooth"
    //         });
    //     }
    // }, 5000)
})


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

let btns_anchor = document.querySelectorAll('._js-anchor, nav a');
btns_anchor.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        let urlParams = new URL(btn.href);
        const hash = urlParams.hash;

        const target = document.querySelector(`${hash}`);

        if (target) {
            const topOffset = target.offsetTop - header.clientHeight - 20;

            if (btn.closest('header')) {
                header.classList.remove('active');
                bodyUnlock();
            }

            window.scrollTo({
                top: topOffset,
                behavior: "smooth"
            });
        } else {
            window.location.href = btn.href;
        }
    })
})

const burger = document.querySelector('.burger');

burger.addEventListener('click', () => {
    document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
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

// Scroll to anchor

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
    bodyUnlock();
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
                    overlayModal.classList.add('active');
                    modal_node.classList.add('active');
                    bodyLock();
                }
            }
        })
    })
}
if (btnsCloseModal.length > 0) {
    btnsCloseModal.forEach(btn => {
        btn.addEventListener('click', () => {
            let modal = btn.closest('._js-modal');
            if (modal) {
                modal.classList.remove('active');
            }
            bodyUnlock();
            overlayModal.classList.remove('active');
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
if (formGroups.length) {
    formGroups.forEach(formGroup => {
        const btnClear = formGroup.querySelector('.btn-clear'),
            input = formGroup.querySelector('.form-input');

        if (btnClear) {
            input.addEventListener('input', () => {
                if (input.value.trim() !== '' && !formGroup.classList.contains('_show-btn-clear') && !formGroup.classList.contains('has-error')) {
                    formGroup.classList.add('_show-btn-clear');
                } else if (input.value.trim() === '') {
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
                if (form_group.querySelector('.help-block')){
                    form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.empty;
                }


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
                if (form_group.querySelector('.help-block')){
                    form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.empty;
                }

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
                if (form_group.querySelector('.help-block')){
                    form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.empty;
                }

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
                if (form_group.querySelector('.help-block')){
                    form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.maxlength;
                }

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
                if (form_group.querySelector('.help-block')){
                    form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.cyrillic;
                }

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
                if (form_group.querySelector('.help-block')){
                    form_group.querySelector('.help-block').innerHTML = form_group.querySelector('.help-block').dataset.number;
                }

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
        defaultOffset = 500;

    const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
    const containHide = () => header.classList.contains('hold');

    window.addEventListener('scroll', () => {


        if (scrollPosition() > defaultOffset && !containHide()) {
            header.classList.add('hold');
        } else if (scrollPosition() < defaultOffset && containHide()) {
            header.classList.remove('hold');
        }


        last_scroll = scrollPosition();
    })
}

hideHeader();


// Swiper CEO

let ceoBlockPrev = document.querySelector('.ceo-block .swiper-ceo__arrow._prev'),
    ceoBlockNext = document.querySelector('.ceo-block .swiper-ceo__arrow._next');

if (document.querySelector('.swiper-ceo')) {
    new Swiper('.swiper-ceo', {
        slidesPerView: 1.1,
        spaceBetween: 20,
        breakpoints: {
            992: {
                slidesPerView: 3,
                initialSlide: 1,
                loop: true,
                centeredSlides: true,
                speed: 700,
            },
        },
        on: {
            beforeInit: function (swiper) {
                if (window.matchMedia('(min-width: 992px)').matches) {
                    let slides = swiper.el.querySelectorAll('.swiper-slide');
                    let mainCardMaxHeight = slides[0].querySelector('.card-main').getBoundingClientRect().height;

                    slides.forEach(slide => {
                        let mainCardHeight = slide.querySelector('.card-main').getBoundingClientRect().height;
                        if (mainCardHeight > mainCardMaxHeight) {
                            mainCardMaxHeight = mainCardHeight;
                        }

                    })

                    slides.forEach(slide => {
                        slide.querySelector('.card-main').style.maxHeight = mainCardMaxHeight + 'px';
                    })
                }
            },
            init: function (swiper) {
                if (ceoBlockNext) {
                    ceoBlockNext.addEventListener('click', () => {
                        swiper.slideNext();
                    })
                }

                if (ceoBlockPrev) {
                    ceoBlockPrev.addEventListener('click', () => {
                        swiper.slidePrev();
                    })
                }
            },
        },
    })
}


// Swiper Team
if (document.querySelector('.team-swiper')) {
    new Swiper('.team-swiper', {
        slidesPerView: 1.45,
        freeMode: {
            enabled: true,
            sticky: false,
        },
        //slidesPerView: 1.45,
        spaceBetween: 64,
        breakpoints: {
            768: {
                slidesPerView: 2.5,
                spaceBetween: 90,
            }
        },
    })
}

// Swiper .use-swiper
if (document.querySelector('.use-swiper')) {
    new Swiper('.use-swiper', {
        slidesPerView: 1.5,
        freeMode: {
            enabled: true,
            sticky: false,
        },
        // Navigation form swiper
        navigation: {
            nextEl: '.use-swiper-next',
            prevEl: '.use-swiper-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 4,
                speed: 700,
                freeMode: {
                    enabled: false,
                },
            }
        },
    })
}


function cursor() {
    let cursor = document.querySelector('.custom-cursor'),
        caseCards = document.querySelectorAll('.case-card'),
        hiddenMenu = document.querySelector('.hidden-header'),
        posX = 0,
        posY = 0,
        mouseX = 0,
        mouseY = 0;

    console.log(hiddenMenu);

    gsap.to({}, 0.004, {
        repeat: -1,
        onRepeat: function () {
            posX += (mouseX - posX) / 7;
            posY += (mouseY - posY) / 7;

            gsap.set(cursor, {
                css: {
                    left: mouseX - (cursor.clientWidth / 2),
                    top: mouseY - (cursor.clientWidth / 2),
                }
            })
        }
    });

    window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    })
    if (caseCards.length) {
        caseCards.forEach(caseCard => {
            caseCard.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                document.body.classList.add('hide-cursor');
            })

            caseCard.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                document.body.classList.remove('hide-cursor');
            })
        })
    }
    if (hiddenMenu) {
        hiddenMenu.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            cursor.classList.add('active-menu');
            document.body.classList.add('hide-cursor');
        })

        hiddenMenu.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursor.classList.remove('active-menu');
            document.body.classList.remove('hide-cursor');
        })
    }
    if (ceoBlockPrev) {
        ceoBlockPrev.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            cursor.classList.add('ceo-arrow-prev');

            document.body.classList.add('hide-cursor');
        })

        ceoBlockPrev.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursor.classList.remove('ceo-arrow-prev');
            document.body.classList.remove('hide-cursor');
        })
    }
    if (ceoBlockNext) {
        ceoBlockNext.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            cursor.classList.add('ceo-arrow-next');

            document.body.classList.add('hide-cursor');
        })

        ceoBlockNext.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursor.classList.remove('ceo-arrow-next');
            document.body.classList.remove('hide-cursor');
        })
    }

}

cursor();

// Home page, submit form
let homeFormTouch = document.querySelector('.form-wrapper__right form');
if (homeFormTouch){
    homeFormTouch.addEventListener('submit', (e) => {
        e.preventDefault();
        let formData = new FormData(homeFormTouch);
        formData.append("action", "touch_form");

        if (validateForm(homeFormTouch)){
            homeFormTouch.querySelector('.btn-submit').setAttribute('disabled', 'disabled');
            fetch(homeFormTouch.action, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    let submit_status = homeFormTouch.querySelector('.submit-status');
                    submit_status.classList.add('active');
                    submit_status.innerHTML = data.message;

                    if (data.status === 'success'){
                        submit_status.classList.add('_success');
                        resetForm(homeFormTouch);
                    }else {
                        submit_status.classList.add('_error');
                    }

                    setTimeout(() => {
                        submit_status.classList.remove('active');
                        submit_status.classList.remove('_success');
                        submit_status.classList.remove('_error');
                        submit_status.innerHTML = '';
                    }, 5000)

                    homeFormTouch.querySelector('.btn-submit').removeAttribute('disabled');
                })
        }
    })
}





