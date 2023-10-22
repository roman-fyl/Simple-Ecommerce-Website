"use strict"

const store = async () => {
    const catalogFilter = document.getElementById('catalog__filter');
    const searchInput = document.querySelector('.search__field');
    let searchingItem = '';
    let items, data;

    const getData = async () => {
        try {
            const response = await fetch('../base/base.json');
            data = await response.json();
            return data
        } catch (error) {
            console.error(error)
            return []
        }
    }

    const showItems = (items, category) => {
        const catalogList = document.getElementById('catalog__list')
        const elements = [];

        items
            .filter((item) =>
                category === "all" ? item : item.category === category
            )
            .forEach((item) => {
                elements.push(`
                    <li class="catalog__item">
                        <img src="${item.imageSrc}" alt="${item.imageAlt}">
                        <div class="item__description">
                            <h3>${item.title}</h3>
                            <span class="item__price">$${item.price}</span>
                            <span class="item__rate"><img src="../images/rate.png" alt="Rate">${item.rate}</span>
                            <span class="item__topic">${item.category}</span>
                        </div>
                    </li>
        `)
            })

        catalogList.innerHTML = elements.join("");
    }

    const createFilterOptions = (items) => {
        let filterList = {}
        items.forEach((item) => {
            if (filterList[item.category]) {
                filterList[item.category] += 1;
            } else {
                filterList[item.category] = 1;
            }
        })
        console.log(filterList)
        return Object.keys(filterList)
    }

    const showFilters = (filterOptions) => {

        const allFilterOption = document.createElement('li');

        allFilterOption.textContent = "All";
        allFilterOption.setAttribute('data-value', 'all');
        catalogFilter.innerHTML = "";

        catalogFilter.appendChild(allFilterOption);;

        filterOptions.forEach((option) => {
            const optionElement = document.createElement('li')

            optionElement.textContent = option
            optionElement.setAttribute('data-value', option);

            catalogFilter.appendChild(optionElement);
        })
    }

    const searchItem = ({ type, keyCode }) => {
        const name = searchInput.value.toLowerCase();
        console.log(name)
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
                })
            }
        }
        showItems(searchResult, 'all');

    }

    const priceShow = () => {
        const priceRange = document.querySelector('input[name="price"]');
        const priceDisplay = document.querySelector('.price__display');

        priceRange.addEventListener('input', () => {
            priceDisplay.textContent = `Value: $ ${priceRange.value}`
        })


    }


    catalogFilter.addEventListener('click', (event) => {
        if (event.target.tagName === "LI") {
            const selectedCategory = event.target.getAttribute('data-value');
            showItems(items, selectedCategory)
            searchInput.value = "";
        }
    })

    items = await getData();
    showItems(items, 'all')
    const filterOptions = createFilterOptions(items)
    showFilters(filterOptions)
    searchInput.addEventListener('input', searchItem)
    priceShow();
}

document.addEventListener('DOMContentLoaded', store)