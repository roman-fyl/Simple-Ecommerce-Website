"use strict";

const menuSwitcher = () => {

  const navigation = document.querySelector(".header__content nav");
  const menu = document.querySelector(".header__mobile");
  const elementNavMenu = document.querySelectorAll('.element-menu');

  const menuToggle = () => {
    
    if (navigation) {
      navigation.classList.toggle('elementShow');

      return
    }
  }

  if (elementNavMenu) {
    if (Array.isArray(elementNavMenu)) {
      
      elementNavMenu.forEach((element) => {
        element.addEventListener('click', (event) => {
          elementNavMenu.forEach((item) => {
            item.classList.remove('elementActive');
          });
          event.target.classList.add('elementActive');
        });
      });
    }
  }

  menu.addEventListener('click', menuToggle);
};

document.addEventListener("DOMContentLoaded", menuSwitcher);
