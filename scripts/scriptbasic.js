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

  const switchActiveElements = (event) => {
    const menuItems = document.querySelectorAll(".element-menu a");
    const currentURL = window.location.href;
    
    menuItems.forEach((item) => {
      if (item.href === currentURL) {
        item.classList.add("elementActive");
      }
    });
  }

  switchActiveElements()
  menu.addEventListener('click', menuToggle);
};

document.addEventListener("DOMContentLoaded", menuSwitcher);
