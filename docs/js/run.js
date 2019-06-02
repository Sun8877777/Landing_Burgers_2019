window.onload = function () {
  'use strict';
  const mainNav = document.querySelector('.main-nav');
  const mainNavToogle = mainNav.querySelector('.main-nav__toogle');
  const overlay = document.querySelector('.wrapper');
  const menuList = document.querySelector('.menu__list');
  const teamsList = document.querySelector('.teams__list');
  const menuClose = menuList.querySelectorAll('.menu__desc-close');
  const ESC_KEYCODE = 27;
  const ENTER_KEYCODE = 13;


  // Открыть/закрыть главное меню
  function openMenu() {
    mainNav.classList.toggle('main-nav__open');
    overlay.classList.toggle('overlay');
  };

  mainNavToogle.addEventListener('click', openMenu);
  mainNavToogle.addEventListener('keydown', function (e) {
    e.preventDefault();
    if (e.keyCode == ENTER_KEYCODE) {
      openMenu();
    }
  });
  overlay.addEventListener('keydown', function (e) {
    if (e.keyCode === ESC_KEYCODE) {
      if (mainNav.classList.contains('main-nav__open')) {
        mainNav.classList.remove('main-nav__open');
        overlay.classList.remove('overlay');
      }
    }
  });
  // Открыть/закрыть меню
  function openMenuItem(e) {
    e.target.parentElement.classList.toggle('open');
    const itemId = localStorage.getItem('itemId');
    localStorage.setItem('itemId', e.target.parentElement.id);

    if (itemId != e.target.parentElement.id) {
      document.getElementById(itemId).classList.remove('open');
      localStorage.removeItem('itemId');
      localStorage.setItem('itemId', e.target.parentElement.id);
    }

    if (window.innerWidth <= 480 && e.target.parentElement.classList.contains('open')) {
      if (!e.target.parentElement.previousElementSibling) {
        menuList.style.transform = 'translateX(0)';
      } else if (!e.target.parentElement.nextElementSibling) {
        menuList.style.transform = 'translateX(-33.5%)';
      } else {
        menuList.style.transform = 'translateX(-17%)';
      }
      e.target.nextElementSibling.style.width = `${100 - 16}%`;
    } else {
      menuList.style.transform = 'translateX(0)';
    }
  };

  function closeMenuItem(e) {
    e.preventDefault();
    if (window.innerWidth <= 480 && e.target.parentElement.classList.contains('open')) {
      e.target.parentElement.classList.remove('.open');
    }
  };
  menuList.addEventListener('click', openMenuItem);
  for (let i = 0; i < menuClose.length; i++) {
    menuClose[i].addEventListener('click', closeMenuItem)
  }

  function openTeamsInfo(e) {
    e.target.parentElement.classList.toggle('open');
    const teamId = localStorage.getItem('teamId');
    localStorage.setItem('teamId', e.target.parentElement.id);

    if (teamId != e.target.parentElement.id) {
      document.getElementById(teamId).classList.remove('open');
      localStorage.removeItem('teamId');
      localStorage.setItem('teamId', e.target.parentElement.id);
    }
  };
  teamsList.addEventListener('click', openTeamsInfo);
  /////////////Карусель
  var carusel = function (container, prev, next) {
    let caruselBlock = document.querySelector(container);
    let itemLength = caruselBlock.children.length;
    var prev = document.querySelector(prev);
    var next = document.querySelector(next);

    const minSteps = -100;
    const step = 100;
    const maxSteps = step * itemLength;
    let currentStep = 0;
    const reset = maxSteps;

    caruselBlock.style["transform"] = `translateX(${currentStep}vw)`;

    function right(e) {
      e.preventDefault();
      if (currentStep < maxSteps) {
        currentStep += step;
        caruselBlock.style["transform"] = `translateX(-${currentStep}vw)`;
      }
      if (currentStep == maxSteps) {
        currentStep -= reset;
        caruselBlock.style["transform"] = `translateX(-${currentStep}vw)`;
      }
    };

    function left(e) {
      e.preventDefault();
      if (currentStep > minSteps) {
        currentStep -= step;
        caruselBlock.style["transform"] = `translateX(-${currentStep}vw)`;
      }
      if (currentStep <= minSteps) {
        currentStep += reset;
        caruselBlock.style["transform"] = `translateX(-${currentStep}vw)`;
      }
    };
    prev.addEventListener('click', right);
    next.addEventListener('click', left);
  };
  carusel('.slider__list', '.arrow__left', '.arrow__right');
  ///////Форма
  const modal = document.querySelector('.delivery__modal');
  const form = document.querySelector('.delivery__form');
  const submit = form.querySelector('.order__submit');
  const modalMsg = modal.querySelector('.delivery__modal-text')
  const modalClose = modal.querySelector('.delivery__btn');

  function validate (form) { 
    let valid = true;
    if (!validateField(form.elements.name)) {
      valid = false;
    }
    if (!validateField(form.elements.phone)) {
      valid = false;
    }
    if (!validateField(form.elements.comment)) {
      valid = false;
    }
    return valid;
  }
  function validateField (field) {
    field.nextElementSibling.textContent = field.validationMessage;
    return field.checkValidity();
  } 

  function exchange (e) {
    e.preventDefault();
    let url = 'https://webdev-api.loftschool.com/sendmail';
    let urlFail = 'https://webdev-api.loftschool.com/sendmail/fail';
    if (validate(form)) {
      var fData = new FormData();
      fData.append('name', form.elements.name.value);
      fData.append('phone', form.elements.phone.value);
      fData.append('comment', form.elements.comment.value);
      fData.append('to', 'rt@gmail.com');
  
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.open('POST', url);
      xhr.send(fData);
      xhr.addEventListener('load', function () {
        if (xhr.status >= 400) {
          console.log(xhr.response.message);
          modal.style.display = 'flex';
          overlay.classList.add('overlay');
          modalMsg.textContent = xhr.response.message;
          
        } else {
          console.log(xhr.response.message);
          modal.style.display = 'flex';
          overlay.classList.add('overlay');
          modalMsg.textContent = xhr.response.message;
          form.reset();
        }
      })
    }

    // return xhr;
  };

  submit.addEventListener('click', exchange);
  modalClose.addEventListener('click', function (e) {
    e.preventDefault();
    modal.style.display = 'none';
    overlay.classList.remove('overlay');
  })
}



