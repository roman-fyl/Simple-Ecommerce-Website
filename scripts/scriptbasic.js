"use strict";

const menuSwitcher = async () => {
 
  const navigation = document.querySelector(".header__content nav");
  const menu = document.querySelector(".header__mobile");

 
const menuToggle = () => {
  navigation.classList.toggle('displayShow');
  return
}


  menu.addEventListener('click', menuToggle);
};

document.addEventListener("DOMContentLoaded", menuSwitcher);
