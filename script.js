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
});
