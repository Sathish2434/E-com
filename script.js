// Add to Cart function for static HTML
window.addToCart = function(name, price, image) {
    // Get current cart from localStorage or initialize
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Add new product
    cart.push({ name, price, image });
    // Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
};

// Attach event listeners to dynamically created cart buttons
function setupDynamicCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Get product info from DOM
            const proDiv = btn.closest('.pro');
            const name = proDiv.querySelector('h5').innerText;
            const price = parseInt(proDiv.querySelector('h4').innerText.replace(/[^\d]/g, ''));
            const image = proDiv.querySelector('img').getAttribute('src');
            window.addToCart(name, price, image);
        });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  const productContainer = document.querySelector(".pro-container");

  // Fetch products from backend
  const response = await fetch("http://127.0.0.1:5000/products");
  const products = await response.json();

  // Populate products
  products.forEach((product) => {
    const productHTML = `
            <div class="pro">
                <img src="${product.image_url}" alt="">
                <div class="des">
                    <span>${product.brand}</span>
                    <h5>${product.name}</h5>
                    <div class="star">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <h4>₹${product.price}</h4>
                </div>
                <a href="#" class="add-to-cart" data-id="${product.id}"><i class="fa fa-cart-arrow-down" aria-hidden="true"></i></a>
            </div>
        `;
    productContainer.innerHTML += productHTML;
  });

  // Setup event listeners for dynamic cart buttons
  setupDynamicCartButtons();
});
