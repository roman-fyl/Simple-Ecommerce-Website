"use strict";

const store = async () => {
  const catalogFilter = document.getElementById("catalog__filter");
  const catalogList = document.getElementById("catalog__list");
  const cartList = document.getElementById("cart__list");
  const searchInput = document.querySelector(".search__field");
  const priceRange = document.querySelector('input[name="price"]');
  const priceDisplay = document.querySelector(".price__display");
  // const navigation = document.querySelector(".header__content nav");
  const menu = document.querySelector(".header__mobile");
  const elementCart = document.querySelector(".cart__section");
  const buttonCart = document.querySelector(".cart");
  const buttonCartClose = document.querySelector(".button__close");
  const totalAmount = document.getElementById("total__amount");

  let items, data, allFilterOption;
  let selectedItems = [];

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
if(catalogList) {
  const elements = [];

  items
    .filter((item) =>
      category === "all" ? item : item.category === category
    )
    .forEach((item) => {
      elements.push(`
                      <li class="catalog__item" idn="${item.idN}">
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
}
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
    // console.log(filterList);
    return Object.keys(filterList);
  };

  const showFilters = (filterOptions) => {

    allFilterOption = document.createElement("li");
    allFilterOption.textContent = "All";
    allFilterOption.setAttribute("data-value", "all");
    // allFilterOption.classList.add("active");
   if(catalogFilter) {
    catalogFilter.innerHTML = "";
    catalogFilter.appendChild(allFilterOption);
   }else {
    console.log('catalogFilter dont exist')
   }

    filterOptions.forEach((option) => {
      const optionElement = document.createElement("li");

      if(optionElement || catalogFilter) {
        optionElement.textContent = option;
      optionElement.setAttribute("data-value", option);
      catalogFilter.appendChild(optionElement);
      }else {
        console.log('catalogFilter or optionElement dont exist')
       }
    });
  };

  //input search
  const searchItem = ({ type, keyCode }) => {

    cleanFilters();
    showFilters(filterOptions); // reset Li selection

    const name = searchInput.value.toLowerCase();
    let searchResult = data;

    if (
      type === "input" ||
      type === "change" ||
      (type === "keydown" && keyCode === 13) ||
      type === "click"
    ) {
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
  if (catalogFilter) {
    catalogFilter.addEventListener("click", (event) => {
      if (event.target.tagName === "LI") {
        buttonSwitcher(event);

        const selectedCategory = event.target.getAttribute("data-value");

        showItems(items, selectedCategory);
        searchInput.value = "";
        cleanFilters();
        return;
      }
      return;
    });
  } else {
    console.log("catalogFilter doesnt exist");
  }

  const cleanFilters = () => {
    priceRange.value = 0;
    priceDisplay.textContent = `Value: $ ${priceRange.value}`;
  };

  const buttonSwitcher = (event) => {
    const filterItems = document.querySelectorAll("li");

    filterItems.forEach((item) => {
      item.classList.remove("active");
    });
    event.target.classList.add("active");
  };

  const menuToggle = () => {
    navigation.classList.toggle("displayShow");
    return;
  };

  if (buttonCart) {
    buttonCart.addEventListener("click", (event) => {
      addItemsToCart(event);
      if (elementCart.classList.contains("displayHide")) {
        elementCart.classList.remove("displayHide");
        elementCart.classList.add("displayShow");
        // console.log('show cart')
        return;
      }
    });
  } else {
    console.log("Button cart doesnt exist");
  }

  if (buttonCartClose) {
    buttonCartClose.addEventListener("click", (event) => {

      addItemsToCart(event);

      if (elementCart.classList.contains("displayShow")) {
        elementCart.classList.remove("displayShow");
        elementCart.classList.add("displayHide");
        // console.log('hide cart')
        return;
      }
    });
  } else {
    console.log("no button buttonCartClose");
  }
  const showCart = (selectedItem) => {
    if (!Array.isArray(selectedItems)) {
      selectedItems = [];
    }
    if (selectedItems.length === 0) {
      elementCart.classList.remove("displayShow");
      elementCart.classList.add("displayHide");
    }

    let elements = [];
    const cart = document.querySelector(".cart__list");

    selectedItems.forEach((item) => {
      elements.push(`
            <li class="cart__element" data-idN="${item.idN}">
              <div class="catalog__item__cart">
              <img src="${item.imageSrc}" alt="${item.imageAlt}">
                  <div class="item__description">
                      <h3>${item.title}</h3>
                      <span class="item__price">${item.price}</span>
                  </div>
              </div>
              <div class="cart__updates">
                  <div class="cart__quantity">
                      <span class="cart__change"><a href="#" id="decrease" data-idN="${item.idN}">-</a></span>
                      <span class="cart__field_amount">${item.quantity}</span>
                      <span class="cart__change"><a href="#" id="increase" data-idN="${item.idN}">+</a></span>
                  </div>
                  <div class="cart__remove" data-idn="${item.idN}">
                      <span>Remove</span>
                      <a href="#"><img src="../images/icon-close.png" alt="Close"></a>
                  </div>
              </div>
          </li>
          `);
    });

    cart.innerHTML = elements.join("");
  };

  const addItemsToCart = async (event) => {
    elementCart.classList.remove("displayHide");
    elementCart.classList.add("displayShow");

    let quantity = 0;
    const liElement = await event.target.closest(".catalog__item");

    if (liElement) {
      const idN = liElement.getAttribute("idN");
      const imageSrc = liElement.querySelector("img").getAttribute("src");
      const title = liElement.querySelector(".item__description h3").textContent;
      const price = liElement.querySelector(".item__description .item__price").textContent;

      const selectedItem = {
        idN: idN,
        imageSrc: imageSrc,
        title: title,
        price: price,
        quantity: 1,
      };

      const existItem = selectedItems.find((item) => item.idN === idN);

      if (existItem) {
        quantity += 1;
        existItem.quantity = (existItem.quantity || 1) + 1;
        // console.log(quantity)
      } else {
        selectedItem.quantity = 1;
        selectedItems.push(selectedItem);
        // console.log(quantity)
      }

      // console.log(selectedItems, quantity)
      showCart(selectedItems);
      showCartAmount(selectedItems);
      setLocalStorage(selectedItem);

      return selectedItems;
    }
  };

  const setLocalStorage = (selectedItem) => {
    localStorage.setItem("idN", JSON.stringify(selectedItems));
    return;
  };

  const getLocalStorage = () => {
    const storedItems = JSON.parse(localStorage.getItem("idN"));
    // console.log(storedItems)
    return storedItems;
  };

  const removeItem = (index) => {
    const updatingCart = selectedItems.filter((item) => item.idN !== index);

    selectedItems = updatingCart;
    showCart(selectedItems);
    showCartAmount(selectedItems);
    setLocalStorage(selectedItems);
  };

  const showCartAmount = (selectedItems) => {
    let total = 0;

    if (Array.isArray(selectedItems)) {
      selectedItems.forEach((item) => {
        const itemPrice = parseFloat(item.price.replace("$", ""));
        const itemquantity = item.quantity || 1;
        // console.log(total)
        total += itemPrice * itemquantity;
      });
    }
   
    totalAmount.textContent = `$${total.toFixed(2)}`;
    // console.log(total)
  };

  if (cartList) {
    cartList.addEventListener("click", (event) => {
      const target = event.target;
      const increaseQuantity = target.closest("#increase");

      if (increaseQuantity) {
        const idN = increaseQuantity.getAttribute("data-idn");
        const selectedItem = selectedItems.find((item) => item.idN === idN);

        if (selectedItem) {
          selectedItem.quantity = (selectedItem.quantity || 0) + 1;
          showCart(selectedItems);
          showCartAmount(selectedItems);
          setLocalStorage(selectedItems);
        }
      }
    });
  }else {
    console.log('CartList dont exist in IncreaseQuantity function')
  }

  if (cartList) {
    cartList.addEventListener("click", (event) => {
      const target = event.target;
      const decreaseQuantity = target.closest("#decrease");

      if (decreaseQuantity) {
        const idN = decreaseQuantity.getAttribute("data-idn");
        const selectedItem = selectedItems.find((item) => item.idN === idN);

        if (selectedItem && selectedItem.quantity > 1) {
          selectedItem.quantity = (selectedItem.quantity || 0) - 1;
          showCart(selectedItems);
          showCartAmount(selectedItems);
          setLocalStorage(selectedItems);
        }
      }
    });
  }else {
    console.log('CartList dont exist in decreaseQuantity function')
  }

  if (cartList) {
    cartList.addEventListener("click", (event) => {
      const target = event.target;
      const removeCartButton = target.closest(".cart__remove");

      if (removeCartButton) {
        const idN = removeCartButton.getAttribute("data-idn");
        removeItem(idN);
      }
    });
  }else {
    console.log('CartList dont exist in removeItem function')
  }

 if(catalogList) {
  catalogList.addEventListener("click", (event) => {
    const target = event.target;
    const addCartButton = target.closest(".catalog__item__add_cart");
    if (addCartButton) {
      // console.log(target)
      addItemsToCart(event);
    }
  });
 }else {
  console.log('CatalogList dont exist in function')
}

  items = await getData();
  showItems(items, "all");
  const filterOptions = createFilterOptions(items);
  showFilters(filterOptions);
  searchInput.addEventListener("input", searchItem);
  menu.addEventListener("click", menuToggle);
  priceFilter();
  selectedItems = getLocalStorage();
  showCart(selectedItems);
  showCartAmount(selectedItems);
};

document.addEventListener("DOMContentLoaded", store);
