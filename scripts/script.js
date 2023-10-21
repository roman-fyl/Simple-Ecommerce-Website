"use strict"

const store = async () => {
    const catalogFilter = document.getElementById('catalog__filter');
    let items;

    const getData = async () => {
        try {
            const response = await fetch('../base/base.json');
            const data = await response.json();
            console.log(data)
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
    catalogFilter.addEventListener('click', (event) => {
        if (event.target.tagName === "LI") {
            const selectedCategory = event.target.getAttribute('data-value');
            showItems(items, selectedCategory)
        }
    })

    items = await getData();
    showItems(items, 'all')
    const filterOptions = createFilterOptions(items)
    showFilters(filterOptions)
}

document.addEventListener('DOMContentLoaded', store)