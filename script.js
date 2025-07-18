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

// Login functionality
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginButton = document.getElementById('login');
    
    if (isLoggedIn) {
        // User is logged in - show loginlogo.jpg
        loginButton.style.backgroundImage = 'url("login/loginlogo.jpg")';
        loginButton.onclick = function() {
            // Redirect to user profile page
            window.location.href = 'user-profile.html';
        };
    } else {
        // User is not logged in - show default image.png
        loginButton.style.backgroundImage = 'url("login/image.png")';
        loginButton.onclick = function() {
            window.location.href = 'login/Login UI.html';
        };
    }
}

// Function to handle successful login
window.handleLoginSuccess = function(userName) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', userName);
    alert('Login successful! Welcome, ' + userName);
    window.location.href = 'index.html'; // Redirect back to home page
};

// Wishlist functionality
window.toggleWishlist = function(name, price, image, btn) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.findIndex(item => item.name === name && item.price === price && item.image === image);
    if (index === -1) {
        wishlist.push({ name, price, image });
        btn.classList.add('active');
    } else {
        wishlist.splice(index, 1);
        btn.classList.remove('active');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
};

function updateWishlistButtons() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const proDiv = btn.closest('.pro');
        const name = proDiv.querySelector('h5').innerText;
        const price = parseInt(proDiv.querySelector('h4').innerText.replace(/[^\d]/g, ''));
        const image = proDiv.querySelector('img').getAttribute('src');
        const isInWishlist = wishlist.some(item => item.name === name && item.price === price && item.image === image);
        if (isInWishlist) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

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

// Hamburger menu toggle for mobile
function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const navbar = document.getElementById('navbar');
    function updateHamburgerVisibility() {
        if (window.innerWidth <= 768) {
            hamburger.style.display = 'block';
            navbar.style.display = 'none';
        } else {
            hamburger.style.display = 'none';
            navbar.style.display = 'flex';
        }
    }
    hamburger.addEventListener('click', function() {
        if (navbar.style.display === 'none' || navbar.style.display === '') {
            navbar.style.display = 'flex';
            navbar.style.flexDirection = 'column';
        } else {
            navbar.style.display = 'none';
        }
    });
    window.addEventListener('resize', updateHamburgerVisibility);
    updateHamburgerVisibility();
}

document.addEventListener("DOMContentLoaded", async () => {
  // Check login status and update button
  checkLoginStatus();
  setupHamburgerMenu();
  
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
  updateWishlistButtons();
});
