document.addEventListener("DOMContentLoaded", async () => {
    const root = document.getElementById("root");

    // CSS styles for the document
    const styles = `
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
        }
        #nav-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            background-color: #007BFF;
            color: white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        form {
            display: flex;
            flex-grow: 1;
            margin-right: 10px;
        }
        #nav-bar input, #nav-bar select, .s-button {
            padding: 10px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            margin-right: 10px;
        }
        #nav-bar input {
            flex-grow: 1;
        }
        .s-button {
            background-color: #28a745;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
        }
        .s-button:hover {
            background-color: #218838;
            transform: scale(1.05);
        }
        #container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin: 20px;
            padding: 20px;
            background: linear-gradient(to bottom right, #d9f7ff, #e6e6fa);
            border-radius: 15px;
        }
        .card {
            border: 1px solid #ddd;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background: white;
            transition: transform 0.3s ease, height 0.3s ease;
        }
        .card.expanded {
            transform: scale(1.02);
        }
        .card img {
            width: 200px;
            height: 200px;
            object-fit: cover;
            display: block;
            margin: 20px auto;
        }
        .card h3 {
            color: #333;
            margin-bottom: 10px;
        }
        .card p {
            margin: 0;
        }
        .card .price {
            font-weight: bold;
            color: #007BFF;
        }
        .card .description {
            color: #666;
            display: none;
        }
        .card button {
            margin-top: 10px;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .card .toggle-description {
            background-color: #007BFF;
            color: white;
        }
        .card .add-to-cart {
            background-color: #28a745;
            color: white;
        }
        #head {
            color: red;
            font-weight: bold;
            text-align: center;
            margin-top: 10px;
        }
    `;

    // Add CSS styles to the document
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Fetch data
    const response = await fetch("data.json");
    const products = await response.json();

    // HTML structure
    root.innerHTML = `
        <div id="nav-bar">
            <form id="search-form">
                <input id="search-box" type="text" placeholder="Search products by name...">
                <button type="submit" class="s-button">Search</button>
            </form>
            <select id="sort-dropdown">
                <option value="" disabled selected>Sort By</option>
                <option value="name">Name (A-Z)</option>
                <option value="priceLow">Price (Low to High)</option>
                <option value="priceHigh">Price (High to Low)</option>
            </select>
        </div>
        <h3 id="head"></h3>
        <div id="container"></div>
    `;

    const container = document.getElementById("container");
    const searchBox = document.getElementById("search-box");
    const sortDropdown = document.getElementById("sort-dropdown");
    const searchForm = document.getElementById("search-form");
    const warningMessage = document.getElementById("head");

    // Function to display product cards
    const displayCards = (productsToShow) => {
        container.innerHTML = "";
        warningMessage.textContent = ""; // Clear any previous warning
        productsToShow.forEach((product) => {
            const cardHTML = `
                <div class="card">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="info">
                        <h3>${product.name}</h3>
                        <p class="price">Price: ${product.price}</p>
                        <button class="add-to-cart">Add to Cart</button>
                        <button class="toggle-description">Show Description ▼</button>
                        <p class="description">${product.description}</p>
                    </div>
                </div>
            `;
            container.innerHTML += cardHTML;
        });

        document.querySelectorAll(".toggle-description").forEach((button, index) => {
            button.addEventListener("click", () => {
                const card = container.querySelectorAll(".card")[index];
                const description = card.querySelector(".description");
                const isVisible = description.style.display === "block";

                description.style.display = isVisible ? "none" : "block";
                card.classList.toggle("expanded", !isVisible);
                button.textContent = isVisible ? "Show Description ▼" : "Hide Description ▲";
            });
        });

        document.querySelectorAll(".add-to-cart").forEach((button) => {
            button.addEventListener("click", () => alert("Product added to cart!"));
        });
    };

    // Search and sort logic
    const searchProducts = (event) => {
        event.preventDefault();
        const query = searchBox.value.toLowerCase();
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(query)
        );
        if (filtered.length > 0) {
            displayCards(filtered);
        } else {
            container.innerHTML = ""; // Clear product display
            warningMessage.textContent = "PRODUCT NOT FOUND!!! INVALID PRODUCT NAME";
        }
    };

    const sortProducts = () => {
        const sortBy = sortDropdown.value;
        let sorted = [...products];
        if (sortBy === "name") {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "priceLow") {
            sorted.sort(
                (a, b) =>
                    parseFloat(a.price.replace(/[^0-9.]/g, "")) - parseFloat(b.price.replace(/[^0-9.]/g, ""))
            );
        } else if (sortBy === "priceHigh") {
            sorted.sort(
                (a, b) =>
                    parseFloat(b.price.replace(/[^0-9.]/g, "")) - parseFloat(a.price.replace(/[^0-9.]/g, ""))
            );
        }
        displayCards(sorted);
    };
    

    // Event listeners
    searchForm.addEventListener("submit", searchProducts);
    sortDropdown.addEventListener("change", sortProducts);

    // Initial display
    displayCards(products);
});
