"use strict";

const initBasket = async () => {
  const catalogFilter = document.getElementById("catalog__filter");
  const catalogList = document.getElementById("catalog__list");
  const cartList = document.getElementById("cart__list");
  const searchInput = document.querySelector(".search__field");
  const priceRange = document.querySelector('input[name="price"]');
  const priceDisplay = document.querySelector(".price__display");
  const elementCart = document.querySelector(".cart__section");
  const buttonCart = document.querySelector(".cart");
  const buttonCartClose = elementCart.querySelector(".button__close");
  const totalAmount = document.getElementById("total__amount");
  const buttonLoadMore = document.getElementById("button__all__foxes");
  const quantityCart = document.getElementById('quantity-in-cart');
  const filter = {
    input: "",
    tag: "all",
    price: 0
  }

  let items, data;
  let selectedItemsToCart = [], filteredItems = [];
  let displayedItemCount = 6;

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

  const showItems = (items = [], category = "all") => {
    const catalogList = document.getElementById("catalog__list");
    if (catalogList) {

      console.log(filter)
      catalogList.innerHTML = data
        .filter(item => filter.tag === "all" ? item : item.category === filter.tag)
        .filter(item => item.title.toLowerCase().includes(filter.input))
        .filter(item => parseFloat(item.price) >= filter.price)
        .slice(0, displayedItemCount)
        .map((item) => (`
                      <li class="catalog__item" idn="${item.idN}">
                          <img src="${item.imageSrc}" alt="${item.imageAlt}">
                          <div class="catalog__item__add_cart">
                          <a href="#"><img src='../images/icon-add-to-cart.png' alt="Add to cart"></a>
                          <span>Add</span>
                          </div>
                          <div class="item__description">
                              <h4>${item.title}</h4>
                              <span class="item__price">$${item.price}</span>
                              <span class="item__rate"><img src="../images/rate.png" alt="Rate">${item.rate}</span>
                              <span class="item__topic">${item.category}</span>
                          </div>
                      </li>
          `)).join("");
    }
  }
  if (buttonLoadMore) {
    buttonLoadMore.addEventListener("click", () => {
      displayedItemCount += 6;
      showItems(items, "all");

    });
  }

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
    if (!catalogFilter) {
      console.log('CatalogFilter doesnt exist');
      return;
    }

    let filtersHTML = '';

    if (filterOptions) {
      filtersHTML = `<li data-value="all" class="active">All</li>`;
      filtersHTML += filterOptions.map(option => `<li data-value="${option}">${option}</li>`).join('');
    } else {
      console.log('FilterOptions dont exist');
    }

    catalogFilter.innerHTML = filtersHTML;
  };

  //input search +
  const searchItem = ({ type, keyCode, target }) => {

    filter.input = target.value.toLowerCase();
    showItems();
    // return
  };
  //price search + 
  const priceFilter = () => {

    if (priceRange) {
      priceRange.addEventListener("input", (event) => {
        priceDisplay.textContent = `Value: $ ${event.target.value}`;
        filter.price = parseFloat(event.target.value)
        showItems();
      });
    } else {
      console.log('Price range doesnt exist')
    }

  };
  //category search
  if (catalogFilter) {
    catalogFilter.addEventListener("click", (event) => {
      if (event.target.tagName === "LI") {
        buttonSwitcher(event);
        filter.tag = event.target.getAttribute("data-value");
        showItems()
      }
    });
  } else {
    console.log("CatalogFilter doesnt exist");
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

  if (buttonCart) {
    buttonCart.addEventListener("click", (event) => {
      addItemsToCart(event);
      if (elementCart.classList.contains("displayHide")) {
        elementCart.classList.remove("displayHide");
        elementCart.classList.add("elementShow");
        return;
      }
    });
  } else {
    console.log("Button cart doesnt exist");
  }

  if (buttonCartClose) {
    buttonCartClose.addEventListener("click", (event) => {

      addItemsToCart(event);

      if (elementCart.classList.contains("elementShow")) {
        elementCart.classList.remove("elementShow");
        elementCart.classList.add("displayHide");
        return;
      }
    });
  } else {
    console.log("no button buttonCartClose");
  }
  const showCart = (selectedItem) => {
    if (!Array.isArray(selectedItemsToCart)) {
      selectedItemsToCart = [];
    }
    if (selectedItemsToCart.length === 0) {
      elementCart.classList.remove("elementShow");
      elementCart.classList.add("displayHide");
    }

    let elements = [];
    const cart = document.querySelector(".cart__list");

    selectedItemsToCart.forEach((item) => {
      elements.push(`
            <li class="cart__element" data-idN="${item.idN}">
              <div class="catalog__item__cart">
              <img src="${item.imageSrc}" alt="${item.imageAlt}">
                  <div class="item__description">
                      <h4>${item.title}</h4>
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
    const liElement = await event.target.closest(".catalog__item");

    if (liElement) {
      const idN = liElement.getAttribute("idN");
      const imageSrc = liElement.querySelector("img").getAttribute("src");
      const title = liElement.querySelector(".item__description h4").textContent;
      const price = liElement.querySelector(".item__description .item__price").textContent;

      const selectedItem = {
        idN: idN,
        imageSrc: imageSrc,
        title: title,
        price: price,
        quantity: 1,
      };

      const existingItem = selectedItemsToCart.find((item) => item.idN === idN);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const selectedItem = items.find((item) => item.idN === idN);
        if (selectedItem) {
          selectedItem.quantity = 1;
          selectedItemsToCart.push(selectedItem);
        }
      }

      showCart(selectedItemsToCart);
      showCartAmount(selectedItemsToCart);
      setLocalStorage(selectedItem);
      calculateTotalQuantity(selectedItemsToCart);
      updateQuantityCart();


      return selectedItemsToCart;
    }
  };

  const setLocalStorage = (selectedItem) => {
    localStorage.setItem("idN", JSON.stringify(selectedItemsToCart));
    return;
  };

  const getLocalStorage = () => {
    const storedItems = JSON.parse(localStorage.getItem("idN"));
    return storedItems;
  };

  const removeItem = (index) => {
    const updatingCart = selectedItemsToCart.filter((item) => item.idN !== index);

    selectedItemsToCart = updatingCart;
    showCart(selectedItemsToCart);
    showCartAmount(selectedItemsToCart);
    setLocalStorage(selectedItemsToCart);
    calculateTotalQuantity(selectedItemsToCart);
    updateQuantityCart();
  };

  const showCartAmount = async (selectedItemsToCart) => {
    let total = 0;

    if (Array.isArray(selectedItemsToCart)) {
      selectedItemsToCart.forEach((item) => {
        const itemPrice = parseFloat(item.price.replace("$", ""));
        const itemquantity = item.quantity || 1;
        total += itemPrice * itemquantity;
        return total
      });
    }
    totalAmount.textContent = `$${total.toFixed(2)}`;
    calculateTotalQuantity(selectedItemsToCart);
  };

  const calculateTotalQuantity = (items) => {
    let totalQuantity = 0;

    if (Array.isArray(items)) {
      items.forEach((item) => {
        totalQuantity += item.quantity || 0;
      });
    }

    const storedItems = getLocalStorage();
    if (Array.isArray(storedItems)) {
      storedItems.forEach((item) => {
        totalQuantity += item.quantity || 0;
      });
    }
    return totalQuantity;
  };


  const updateQuantityCart = (items) => {
    if (quantityCart) {
      quantityCart.textContent = 0;
      const totalQuantity = calculateTotalQuantity(items);
      quantityCart.textContent = totalQuantity;
    }
  };


  if (cartList) {
    cartList.addEventListener("click", (event) => {
      const target = event.target;
      const increaseQuantity = target.closest("#increase");

      if (increaseQuantity) {
        const idN = increaseQuantity.getAttribute("data-idn");
        const selectedItem = selectedItemsToCart.find((item) => item.idN === idN);

        if (selectedItem) {
          selectedItem.quantity += 1;
          showCart(selectedItemsToCart);
          showCartAmount(selectedItemsToCart);
          setLocalStorage(selectedItemsToCart);
          calculateTotalQuantity(selectedItemsToCart);
          updateQuantityCart();
        }
      }
    });
  } else {
    console.log('CartList dont exist in IncreaseQuantity function')
  }

  if (cartList) {
    cartList.addEventListener("click", (event) => {
      const target = event.target;
      const decreaseQuantity = target.closest("#decrease");

      if (decreaseQuantity) {
        const idN = decreaseQuantity.getAttribute("data-idn");
        const selectedItem = selectedItemsToCart.find((item) => item.idN === idN);

        if (selectedItem && selectedItem.quantity > 1) {
          selectedItem.quantity -= 1;
          showCart(selectedItemsToCart);
          showCartAmount(selectedItemsToCart);
          setLocalStorage(selectedItemsToCart);
          calculateTotalQuantity(selectedItemsToCart);
          updateQuantityCart();
        }
      }
    });
  } else {
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
  } else {
    console.log('CartList dont exist in removeItem function')
  }

  if (catalogList) {
    catalogList.addEventListener("click", (event) => {
      const target = event.target;
      const addCartButton = target.closest(".catalog__item__add_cart");
      if (addCartButton) {
        // console.log(target)
        addItemsToCart(event);
      }
    });
  } else {
    console.log('CatalogList doesnt exist in function')
  }

  items = await getData();
  showItems(items, "all");
  const filterOptions = createFilterOptions(items);
  showFilters(filterOptions);
  if (searchInput) {
    searchInput.addEventListener("input", searchItem);
  } else {
    console.log('SearchInput doesnt exist')
  }

  priceFilter();
  selectedItemsToCart = getLocalStorage();
  showCart(selectedItemsToCart);
  showCartAmount(selectedItemsToCart);
  calculateTotalQuantity(selectedItemsToCart);
  updateQuantityCart();
};

document.addEventListener("DOMContentLoaded", initBasket);
