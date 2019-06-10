window.onload = function () {
  'use strict';
  const mainNav = document.querySelector('.main-nav');
  const mainNavToogle = mainNav.querySelector('.main-nav__toogle');
  const overlay = document.querySelector('.maincontent');
  const menuList = document.querySelector('.menu__list');
  const teamsList = document.querySelector('.teams__list');
  const menuClose = menuList.querySelectorAll('.menu__desc-close');
  const sliderComposition = document.querySelectorAll('.composition');
  const compositionClose = document.querySelectorAll('.composition__close');
  const reviewsBtn = document.querySelectorAll('.reviews__item-btn');
  const videoPlayer = document.querySelector('.video');
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
      let widthElem = e.target.width;
      console.log(e.target.width)
      if (!e.target.parentElement.previousElementSibling) {

        menuList.style.transform = 'translateX(100px)'
      } else if (!e.target.parentElement.nextElementSibling) {

        menuList.style.transform = 'translateX(0)'
      } else {
        menuList.style.transform = 'translateX(50px)'
      }
      e.target.nextElementSibling.style.width = `${window.innerWidth - 50}px`;
    } else {
      menuList.style.transform = 'translateX(0)'
    }
  };
  /// Закрыть меню
  function closeMenuItem(e) {
    e.preventDefault();
    if (window.innerWidth <= 480 && e.target.parentElement.classList.contains('open')) {
      e.target.parentElement.classList.remove('.open');
      console.log(e.target.parentElement);
    }
  };
  menuList.addEventListener('click', openMenuItem); // добавляем открытие меню по клику

  for (let i = 0; i < menuClose.length; i++) {
    menuClose[i].addEventListener('click', closeMenuItem)
  } /// добавляем закрытие меню по клиек на крестик в мобильной версии

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
  teamsList.addEventListener('click', openTeamsInfo); // открыть меню сотрудника команды

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

  function validate(form) {
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
  function validateField(field) {
    field.nextElementSibling.textContent = field.validationMessage;
    return field.checkValidity();
  }

  function exchange(e) {
    e.preventDefault();
    let url = 'https://webdev-api.loftschool.com/sendmail';
    let urlFail = 'https://webdev-api.loftschool.com/sendmail/fail';
    try {

      if (!validate(form)) {
        throw new Error('Форма не валидна');
      }

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
          modal.style.display = 'flex';
          overlay.classList.add('overlay');
          modalMsg.textContent = xhr.response.message;

        } else {
          modal.style.display = 'flex';
          overlay.classList.add('overlay');
          modalMsg.textContent = xhr.response.message;
          form.reset();
        }
      })
    } catch (e) {
      alert(e.message);
    }
    return xhr;
  };

  submit.addEventListener('click', exchange);
  modalClose.addEventListener('click', function (e) {
    e.preventDefault();
    modal.style.display = 'none';
    overlay.classList.remove('overlay');
  });

  //Открыть кнопку состав слайдера

  sliderComposition.forEach(function (e) {
    e.addEventListener('click', () => {
      if (e.parentElement.classList.toggle('open'));
    });
  });
  compositionClose.forEach(function (e) {
    e.addEventListener('click', () => {
      if (e.parentElement.classList.remove('open'));
    });
  });
  //Модальное окно секции отзывов

  reviewsBtn.forEach((elem) => {
    elem.addEventListener('click', (e) => {
      let modalDiv = document.createElement('div');
      let modalTitle = document.createElement('h3');
      let modalParagraph = document.createElement('p');
      let modalClose = document.createElement('button');
      // навешиваем созданным элементам классы
      modalDiv.classList.add('reviews__modal');
      modalTitle.classList.add('section-title');
      modalParagraph.classList.add('reviews__modal-text');
      modalClose.classList.add('reviews__modal-close');
      modalClose.setAttribute('type', 'button');

      //наполняем текстовым содержимым
      modalTitle.textContent = e.currentTarget.previousElementSibling.previousElementSibling.textContent;
      modalParagraph.textContent = e.currentTarget.previousElementSibling.textContent;
      modalClose.addEventListener('click', changeClose);
      // console.log(modalParagraph);
      // добавляем элементы в div
      modalDiv.appendChild(modalTitle);
      modalDiv.appendChild(modalParagraph);
      modalDiv.appendChild(modalClose);
      // добавление на  страницу
      document.body.appendChild(modalDiv);
      document.body.classList.add('overlay');
    })
  });
  function changeClose() {
    let div = document.querySelector('.reviews__modal')
    document.body.removeChild(div);
    document.body.classList.remove('overlay');
  }

  //////Карта яндекс
  ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
      center: [59.9386, 30.3141],
      zoom: 12,
      behaviors: ['default', 'scrollZoom']
    }, {
        searchControlProvider: 'yandex#search'
      }),
      // Создаём макет содержимого.
      MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
      ),

      myPlacemark1 = new ymaps.Placemark([59.899180, 30.314019], {
        hintContent: 'Центр',
        // balloonContent: 'Красивая метка'
      }, {
          iconLayout: 'default#image',
          iconImageHref: './img/map-marker.svg',
          iconImageSize: [50, 80],
          iconImageOffset: [-5, -38]
        }),

      myPlacemark2 = new ymaps.Placemark([59.911887, 30.481269], {
        hintContent: 'Филиал №1',
        // balloonContent: 'Лучшие отзывы!!',
        iconContent: '12'
      }, {
          iconLayout: 'default#imageWithContent',
          iconImageHref: './img/map-marker.svg',
          iconImageSize: [50, 80],
          iconImageOffset: [-24, -24],
          iconContentOffset: [15, 15],
          iconContentLayout: MyIconContentLayout
        }),
      myPlacemark3 = new ymaps.Placemark([59.945826, 30.384169], {
        hintContent: 'Филиал №2',
        // balloonContent: 'Удобное местоположение',
        iconContent: '12'
      }, {
          iconLayout: 'default#imageWithContent',
          iconImageHref: './img/map-marker.svg',
          iconImageSize: [50, 80],
          iconImageOffset: [-24, -24],
          iconContentOffset: [15, 15],
          iconContentLayout: MyIconContentLayout
        }),
      myPlacemark4 = new ymaps.Placemark([59.972725, 30.310761], {
        hintContent: 'Филиал №3',
        // balloonContent: 'Акция!!! После 18:00 скидка 15%',
        iconContent: '12'
      }, {
          iconLayout: 'default#imageWithContent',
          iconImageHref: './img/map-marker.svg',
          iconImageSize: [50, 80],
          iconImageOffset: [-24, -24],
          iconContentOffset: [15, 15],
          iconContentLayout: MyIconContentLayout
        })
      ;
    myMap.behaviors.disable('scrollZoom');
    myMap.geoObjects
      .add(myPlacemark1)
      .add(myPlacemark2)
      .add(myPlacemark3)
      .add(myPlacemark4)

  });
  //////// видеоплеер
  function videoPlayerApi(e) {
    let videoEl = videoPlayer.querySelector('.video__player');
    // let vidControls = videoPlayer.querySelector('.player');
    let playBtn = videoPlayer.querySelector('.player__start');
    let splash = videoPlayer.querySelector('.video__splash');
    let volumeControl = videoPlayer.querySelector('.player__volume');
    let volumeMute = videoPlayer.querySelector('.player__mute-on');
    let progressBar = videoPlayer.querySelector('.player__progress');
    let progressMarker = videoPlayer.querySelector('.player__progress-marker');
    let posterImage ='./img/btn-play-video-bg.jpg';
    videoEl.poster = posterImage;    
    // videoEl.addEventListener('canplaythrough', function () {
      
    //   videoEl.volume = volumeControl.value;
    // });
   
    
    splash.addEventListener('click', function (e) {
      if (videoEl.paused) {  // если видео остановлено, запускаем
        playBtn.classList.add('paused');

        splash.style.display='none';
        videoEl.play();
      } else {
        playBtn.classList.remove('paused');
        videoEl.pause();
      }
    }, false);
    playBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (videoEl.paused) {  // если видео остановлено, запускаем
        playBtn.classList.add('paused');
        splash.style.display='none';
        videoEl.play();
      } else {
        playBtn.classList.remove('paused');
        videoEl.pause();
      }
    }, false);

    videoEl.addEventListener('play', function () {

      playBtn.innerText = "Pause";
    }, false);

    videoEl.addEventListener('pause', function () {

      playBtn.innerText = "Play";
    }, false);

    volumeControl.addEventListener('input', function () {
      videoEl.volume = volumeControl.value;
    }, false);

    videoEl.addEventListener("ended", function (){
      this.src=this.src;
      splash.style.display='block';
      playBtn.classList.remove('paused');
      videoEl.pause();
      videoEl.currentTime = 0;
  });

    volumeMute.addEventListener('click', function (e) {
      e.preventDefault();
      if (videoEl.muted == false) {
        volumeMute.classList.add('player__mute-off');
        videoEl.muted = true;
      } else {
        volumeMute.classList.remove('player__mute-off');
        videoEl.muted = false;
      }
    })
    function seek(e) {
      var percent = e.offsetX / this.offsetWidth;
      videoEl.currentTime = percent * videoEl.duration;
      e.target.value = Math.floor(percent / 100);
      e.target.innerHTML = progressBar.value + '% played';
    }
    
    function updateProgressBar() {
      var percentage = Math.floor((100 / videoEl.duration) * videoEl.currentTime);
      progressBar.value = percentage;
      progressBar.innerHTML = percentage + '% played';
      progressMarker.style.left = `${percentage}%`;
    }
    
    progressBar.addEventListener("click", seek);
    videoEl.addEventListener('timeupdate', updateProgressBar, false);

  }

  videoPlayerApi();
}



