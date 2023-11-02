"use strict";

const menuSwitcher = () => {
 
  const navigation = document.querySelector(".header__content nav");
  const menu = document.querySelector(".header__mobile");

 
const menuToggle = () => {
 if (navigation) {
  navigation.classList.toggle('elementShow');
  return
 }
}


  menu.addEventListener('click', menuToggle);
};

document.addEventListener("DOMContentLoaded", menuSwitcher);
