"use strict";

const store = async () => {
  const catalogFilter = document.getElementById("catalog__filter");
  const searchInput = document.querySelector(".search__field");
  const priceRange = document.querySelector('input[name="price"]');
  const priceDisplay = document.querySelector(".price__display");
  const navigation = document.querySelector(".header__content nav");
  const menu = document.querySelector(".header__mobile");
  const elementCart = document.querySelector(".cart__section");
  const buttonCart = document.querySelector(".cart");
  const buttonCartClose = document.querySelector(".button__close");

  let items, data, allFilterOption;

  let filteredItems = [];
  

  const getData = async () => {
    try {
      const response = await fetch("../base/base.json");
      data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const showItems = (items, category) => {
    const catalogList = document.getElementById("catalog__list");
    const elements = [];

    items
      .filter((item) =>
        category === "all" ? item : item.category === category
      )
      .forEach((item) => {
        elements.push(`
                    <li class="catalog__item">
                        <img src="${item.imageSrc}" alt="${item.imageAlt}">
                        <div class="catalog__item__add_cart">
                        <a href="#"><img src='../images/icon-add-to-cart.png' alt="Add to cart"></a>
                        <span>Add</span>
                        </div>
                        <div class="item__description">
                            <h3>${item.title}</h3>
                            <span class="item__price">$${item.price}</span>
                            <span class="item__rate"><img src="../images/rate.png" alt="Rate">${item.rate}</span>
                            <span class="item__topic">${item.category}</span>
                        </div>
                    </li>
        `);
      });

    catalogList.innerHTML = elements.join("");
  };

  const createFilterOptions = (items) => {
    let filterList = {};
    items.forEach((item) => {
      if (filterList[item.category]) {
        filterList[item.category] += 1;
      } else {
        filterList[item.category] = 1;
      }
    });
    console.log(filterList);
    return Object.keys(filterList);
  };

  const showFilters = (filterOptions) => {
    allFilterOption = document.createElement("li");
    allFilterOption.textContent = "All";
    allFilterOption.setAttribute("data-value", "all");
    // allFilterOption.classList.add("active");
    catalogFilter.innerHTML = "";
    catalogFilter.appendChild(allFilterOption);

    filterOptions.forEach((option) => {
      const optionElement = document.createElement("li");
      optionElement.textContent = option;
      optionElement.setAttribute("data-value", option);
      catalogFilter.appendChild(optionElement);
    });
  };

//input search
  const searchItem = ({ type, keyCode }) => {
    cleanFilters();
    showFilters(filterOptions);  // reset Li selection    
    const name = searchInput.value.toLowerCase();
    let searchResult = data;

    if (
      type === "input" || type === "change" || (type === "keydown" && keyCode === 13) || type === "click") {
      if (name) {
        searchResult = data.filter((item) => {
          return item.title.toLowerCase().includes(name);
        });
      }
    }
    showItems(searchResult, "all");
  };
//price search
  const priceFilter = (event) => {
    priceRange.addEventListener("input", () => {
      const minPrice = parseFloat(priceRange.value);
      priceDisplay.textContent = `Value: $ ${priceRange.value}`;
      const filteredByPrice = data.filter((item) => {
        return parseFloat(item.price) >= minPrice;
      });
      showItems(filteredByPrice, "all");
      showFilters(filterOptions); // reset Li selection
      return;
    });
  };
//category search
  if(catalogFilter) {
    catalogFilter.addEventListener("click", (event) => {
      if (event.target.tagName === "LI") {
          buttonSwitcher(event)
  
        const selectedCategory = event.target.getAttribute("data-value");
        showItems(items, selectedCategory);
        searchInput.value = "";
        cleanFilters();
        return;
      }
      return;
    });
  } else {
    console.error('catalogFilter doesnt exist')
  }

  const cleanFilters = () => {
    priceRange.value = 0;
    priceDisplay.textContent = `Value: $ ${priceRange.value}`;
  };
  const buttonSwitcher = (event) => {
    const selectedCategory = event.target.getAttribute("data-value");
    const filterItems = document.querySelectorAll("li");

    filterItems.forEach((item) => {
      item.classList.remove("active");
    });
    event.target.classList.add("active");
    
  }
const menuToggle = () => {
  navigation.classList.toggle('displayShow');
  return
}

buttonCart.addEventListener('click', () => {
  if(elementCart.classList.contains('displayHide')) {
    elementCart.classList.remove('displayHide')
    elementCart.classList.add('displayShow')
    console.log('show cart')
    return
  }
});
buttonCartClose.addEventListener('click', () => {
  if(elementCart.classList.contains('displayShow')) {
    elementCart.classList.remove('displayShow')
    elementCart.classList.add('displayHide')
    console.log('hide cart')
    return
  }
});


  items = await getData();
  showItems(items, "all");
  const filterOptions = createFilterOptions(items);
  showFilters(filterOptions);
  searchInput.addEventListener("input", searchItem);
  menu.addEventListener('click', menuToggle);
  priceFilter();
};

document.addEventListener("DOMContentLoaded", store);
