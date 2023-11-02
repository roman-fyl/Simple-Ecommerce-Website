"use strict";

const initBasket = async () => {
  const doc = document;
  const catalogFilter = doc.getElementById("catalog__filter");
  const catalogList = doc.getElementById("catalog__list");
  const cartList = doc.getElementById("cart__list");
  const searchInput = doc.querySelector(".search__field");
  const priceRange = doc.querySelector('input[name="price"]');
  const priceDisplay = doc.querySelector(".price__display");
  const elementCart = doc.querySelector(".cart__section");
  const buttonCart = doc.querySelector(".cart");
  const buttonCartClose = elementCart.querySelector(".button__close");
  const totalAmount = doc.getElementById("total__amount");
  const totalItems = doc.getElementById("total__items");
  const buttonLoadMore = doc.getElementById("button__all__foxes");
  const quantityCart = doc.getElementById('quantity-in-cart');
  const sections = doc.querySelectorAll('section');
  const footer = doc.querySelector('footer');

  const filter = {
    input: "",
    tag: "all",
    price: 0
  }

  let items, data, selectedItemsToCart = [], displayedItemCount = 6;

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

  const showItems = () => {
    const catalogList = document.getElementById("catalog__list");

    if (buttonLoadMore) {
      if (buttonLoadMore.classList.contains('elementHide')) {
        buttonLoadMore.classList.remove('elementHide')

      }
    }

    if (catalogList) {
      const filteredItems = data
        .filter(item => filter.tag === "all" ? item : item.category === filter.tag)
        .filter(item => item.title.toLowerCase().includes(filter.input))
        .filter(item => parseFloat(item.price) >= filter.price)
        .slice(0, displayedItemCount)

      if (filteredItems.length > 0) {
        catalogList.innerHTML = filteredItems.map((item) => (`
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
      else {
        catalogList.innerHTML = `<span>No data to display</span>`
        buttonLoadMore.classList.add('elementHide')
      }
    }
  }

  if (buttonLoadMore) {

    buttonLoadMore.addEventListener("click", () => {
      displayedItemCount += 6;
      showItems();
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
      filtersHTML += filterOptions.map(option => `
        <li data-value="${option}">${option}</li>
      `).join('');
    } else {
      console.log('FilterOptions dont exist');
    }
    catalogFilter.innerHTML = filtersHTML;
  };

  const searchItem = (event) => {
    if (event && event.target && event.target.value) {
      filter.input = event.target.value.toLowerCase();
      showItems();
    }
  };

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

      if (elementCart.classList.contains("elementHide")) {
        elementCart.classList.remove("elementHide");
        elementCart.classList.add("elementShow");
        if (sections) {
          sections.forEach(section => section.classList.add("elementOpacity"))
        }
        if (footer) {
          footer.classList.add('elementOpacity')
        }
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
        elementCart.classList.add("elementHide");

      }
      if (sections) {
        sections.forEach(section => section.classList.remove("elementOpacity"));

      }
      if (footer) {
        footer.classList.remove('elementOpacity');

      }

      return
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
      elementCart.classList.add("elementHide");
      sections.forEach(section => section.classList.remove("elementOpacity"));
      footer.classList.remove('elementOpacity');
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
                      <span class="item__price">$${item.price}</span>
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
      showCartQuantity(selectedItemsToCart)
      updateQuantityInCart()
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
    showCartQuantity(selectedItemsToCart)
    updateQuantityInCart()
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

  const showCartQuantity = (selectedItemsToCart) => {
    const uniqueItems = new Set(selectedItemsToCart.map((item) => item.idN));
    return uniqueItems.size;
  };

  showCartQuantity(selectedItemsToCart)

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

      const uniqueItemsCount = showCartQuantity(selectedItemsToCart);

      quantityCart.textContent = uniqueItemsCount;
    }
  };

  const updateQuantityInCart = (items) => {
    if (totalItems) {
      totalItems.textContent = calculateTotalQuantity(items);
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
          updateQuantityInCart();
          showCartQuantity(selectedItemsToCart)
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
          showCartQuantity(selectedItemsToCart)
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
  showCartQuantity(selectedItemsToCart)
  updateQuantityInCart()
  updateQuantityCart();
};

document.addEventListener("DOMContentLoaded", initBasket);