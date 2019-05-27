window.onload = function () {
  'use strict';
  const mainNav = document.querySelector('.main-nav');
  const mainNavToogle = mainNav.querySelector('.main-nav__toogle');
  const overlay = document.querySelector('.wrapper');
  const menuList = document.querySelector('.menu__list');
  const menuClose = menuList.querySelectorAll('.menu__desc-close')
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
}
