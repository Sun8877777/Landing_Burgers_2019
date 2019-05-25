'use strict';
const mainNav = document.querySelector('.main-nav');
const mainNavToogle = mainNav.querySelector('.main-nav__toogle');
const overlay = document.querySelector('.wrapper');
const ESC_KEYCODE = 27;
const ENTER_KEYCODE = 13;

function openMenu() {
    mainNav.classList.toggle('main-nav__open');
    overlay.classList.toggle('overlay');
};

mainNavToogle.addEventListener('click', openMenu);
mainNavToogle.addEventListener('keydown', function(e) { 
  e.preventDefault();
  if (e.keyCode == ENTER_KEYCODE) {
    openMenu();
  }
});
overlay.addEventListener('keydown', function(e) {    
  if (e.keyCode === ESC_KEYCODE) {
    if(mainNav.classList.contains('main-nav__open')) {
      mainNav.classList.remove('main-nav__open');
      overlay.classList.remove('overlay');
    }
  }
});