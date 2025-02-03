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
        #sub_btn {
            background-color: #28a745;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
            padding: 10px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            margin-right: 10px;
        }
        #avg_btn {
            background-color: #28a745;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
            padding: 10px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            margin-right: 10px;
        }
        #avg_btn:hover{
            transform: scale(1.07);
        }
        #sub_btn:hover{
            transform: scale(1.07);
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
        .card:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
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
        #pages {
            display: flex;
            justify-content: center; 
            align-items: center;   
            height: 30px; 
            margin-bottom: 20px;         
            background-color: #f4f4f9; 
        }
        #pages button {
            margin: 0 10px;           
            padding: 10px 20px;       
            font-size: 16px;          
            font-weight: bold;        
            border: none;             
            border-radius: 5px;       
            cursor: pointer;          
            transition: transform 0.2s, background-color 0.3s; 
        }
        #prevpage {
            background-color: #007bff;
            color: white;             
        }
        #nextpage {
            background-color: #28a745;    
            color: white;             
        }
        #pages button:hover {
            transform: scale(1.1); 
            background-color: #555; 
        }
        form button{
            background-color: #28a745;
            color: white;
                      
            padding: 10px 20px;       
            font-size: 16px;          
            font-weight: bold;        
            border: none;             
            border-radius: 5px; 
            justify-content : center;
            
        }
        
        form button:hover {
            transform: scale(1.05);
            background-color: #555;
        }
        #form_container{
            display: block;
            width: 100%;
        }
        input {
            width: 100%;
            padding: 12px 20px;
            box-sizing: border-box;
          }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    
    const response = await fetch("data.json");
    const products = await response.json();

    const ITEMS_PER_PAGE = 10;
    let currentPage = 1;
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

    root.innerHTML = `
        <div id="nav-bar">
            <form id="search-form">
                <input id="search-box" type="text" placeholder="Search products by name...">
                <button type="submit" class="s-button">Search</button>
            </form>
            <button id="sub_btn">ADD PRODUCT</button>
            <button id="avg_btn">AVG</button>
            <select id="sort-dropdown">
                <option value="" disabled selected>Sort By</option>
                <option value="name">Name (A-Z)</option>
                <option value="priceLow">Price (Low to High)</option>
                <option value="priceHigh">Price (High to Low)</option>
            </select>
        </div>
        <h3 id="head"></h3>
        <div id="container"></div>
        <div id="pages">
            <button id="prevpage" disabled>PREVIOUS</button>
            <span id="page-numbers"></span>
            <button id="nextpage">NEXT</button>
        </div>
    `;

    const avgbtn = document.getElementById('avg_btn')
    const container = document.getElementById("container");
    const searchBox = document.getElementById("search-box");
    const sortDropdown = document.getElementById("sort-dropdown");
    const searchForm = document.getElementById("search-form");
    const warningMessage = document.getElementById("head");
    const prevPageButton = document.getElementById("prevpage");
    const nextPageButton = document.getElementById("nextpage");
    const pageNumbers = document.getElementById("page-numbers");
    const addProd = document.getElementById("sub_btn");

    
   
    function averageOfProducts(products) {
        if (!Array.isArray(products) || products.length === 0) {
            console.error("Invalid or empty products array");
            return []; 
        }
    
        const sum = products.reduce((acc, product) => acc + parseFloat(product.price.replace('₹', '')), 0);
        const avgOfProducts = sum / products.length;
    
        const aboveAverageProducts = products.filter(product => {
            const price = parseFloat(product.price.replace('₹', ''));
            return price > avgOfProducts;
        });
    
        return aboveAverageProducts; 
    }
    
    function removeRepeatedElements(products) {
        
    }
    
    avgbtn.addEventListener('click', function () {
        const aboveAverageProducts = averageOfProducts(products);
        displayCards(aboveAverageProducts);
    });
    
    

    const displayCards = (productsToShow) => {
        container.innerHTML = "";
        warningMessage.textContent = "";
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

        document.querySelectorAll(".toggle-description").forEach((button) => {
            button.addEventListener("click", function () {
                const card = button.closest(".card");
                const description = card.querySelector(".description");
                const isVisible = description.style.display === "block";

                description.style.display = isVisible ? "none" : "block";
                card.classList.toggle("expanded", !isVisible);
                button.textContent = isVisible
                    ? "Show Description ▼"
                    : "Hide Description ▲";
            });
        });

        document.querySelectorAll(".add-to-cart").forEach((button) => {
            button.addEventListener("click", () => alert("Product added to cart!"));
        });
    };

    const renderForm = () => {
        container.innerHTML = `
            <form id="product-form">
                <div id="form_container">
                <h3>Product Name</h3>
                <input class="inp" type="text" required><br>
                <h3>Price</h3>
                <input type="number" class="inp" required><br>
                <h3>Description</h3>
                <input type="text" class="inp" required><br>
                <h3>Quantity</h3>
                <input type="number" class="inp" required><br>
                <button type="submit" id="submit-product">Submit</button>
                </div>
            </form>
        `;
        document.getElementById("product-form").addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Product added successfully!");
        });
    };
    addProd.addEventListener("click", renderForm);

    const renderPage = (page) => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = page * ITEMS_PER_PAGE;
        const productsToShow = products.slice(start, end);
        displayCards(productsToShow);

        prevPageButton.disabled = page === 1;
        nextPageButton.disabled = page === totalPages;

        pageNumbers.textContent = `Page ${page} of ${totalPages}`;
    };

    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    nextPageButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = searchBox.value.toLowerCase();
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(query)
        );
        if (filtered.length > 0) {
            displayCards(filtered);
        } else {
            container.innerHTML = "";
            warningMessage.textContent = "PRODUCT NOT FOUND!!! INVALID PRODUCT NAME";
        }
    });

    sortDropdown.addEventListener("change", () => {
        const sortBy = sortDropdown.value;
        if (sortBy === "name") {
            products.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "priceLow") {
            products.sort(
                (a, b) =>
                    parseFloat(a.price.replace(/[^0-9.]/g, "")) -
                    parseFloat(b.price.replace(/[^0-9.]/g, ""))
            );
        } else if (sortBy === "priceHigh") {
            products.sort(
                (a, b) =>
                    parseFloat(b.price.replace(/[^0-9.]/g, "")) -
                    parseFloat(a.price.replace(/[^0-9.]/g, ""))
            );
        }
        renderPage(1);
    });

  

    renderPage(currentPage);
});
