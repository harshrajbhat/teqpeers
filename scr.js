// document.addEventListener('DOMContentLoaded', async ()=>{
//     const root = document.getElementsById('root')

//     const response = await fetch('data.json')
//     const product = await response.json();
//     console.log('succes');
// })
const dd = document.addEventListener("DOMContentLoaded", async () => {
    // Get the root element where all product cards will be displayed
    const root = document.getElementById("root");

    // Fetch product data from the JSON file
    const response = await fetch('data.json');
    const products = await response.json();
})