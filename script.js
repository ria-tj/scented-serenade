// Enhanced Product Data with more details
let products = [
  { 
    id: 1, 
    name: "Aqua Di Gio", 
    price: 45, 
    image: "perfume1.jpg", 
    category: "men",
    description: "Fresh marine notes blended with citrus and woody undertones. Perfect for the modern gentleman who appreciates sophistication."
  },
  { 
    id: 2, 
    name: "Golden Mist", 
    price: 60, 
    image: "perfume2.jpg", 
    category: "women",
    description: "A warm, golden fragrance with hints of vanilla and amber. Elegant and mysterious, perfect for evening occasions."
  },
  { 
    id: 3, 
    name: "Yves Saint Laurent", 
    price: 55, 
    image: "perfume3.jpg", 
    category: "luxury",
    description: "A luxurious floral bouquet with a modern twist. Timeless elegance in every spray."
  },
  {
    id: 4,
    name: "Ocean Breeze",
    price: 40,
    image: "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=300",
    category: "unisex",
    description: "Light and refreshing with aquatic notes. Perfect for daily wear and summer days."
  },
  {
    id: 5,
    name: "Midnight Rose",
    price: 70,
    image: "https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=300",
    category: "women",
    description: "Romantic and sensual with deep rose and musk notes. Perfect for special evenings."
  }
];

let cart = [];
let editMode = false;
let filteredProducts = [...products];
let nextId = Math.max(...products.map(p => p.id)) + 1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  renderProducts();
  setupEventListeners();
  initializeAOS();
  updateCartDisplay();
}

function setupEventListeners() {
  // Search functionality
  const searchBox = document.getElementById('searchBox');
  searchBox.addEventListener('input', debounce(searchProducts, 300));
  searchBox.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchProducts();
    }
  });

  // Filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterProducts(this.dataset.filter);
    });
  });

  // Mobile menu
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  mobileMenuBtn.addEventListener('click', function() {
    navLinks.classList.toggle('active');
  });

  // Close mobile menu when clicking on links
  navLinks.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('active');
    }
  });

  // Modal event listeners
  setupModalListeners();

  // Form submission
  document.getElementById('productForm').addEventListener('submit', handleProductSubmit);

  // Checkout button
  document.getElementById('checkout-btn').addEventListener('click', handleCheckout);

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function setupModalListeners() {
  // Product modal
  const productModal = document.getElementById('productModal');
  const closeModal = document.querySelector('.close-modal');
  
  closeModal.addEventListener('click', () => {
    productModal.style.display = 'none';
  });

  // Product form modal
  const formModal = document.getElementById('productFormModal');
  const closeFormModal = document.querySelector('.close-form-modal');
  
  closeFormModal.addEventListener('click', closeProductForm);

  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === productModal) {
      productModal.style.display = 'none';
    }
    if (e.target === formModal) {
      closeProductForm();
    }
  });

  // Add to cart from modal
  document.querySelector('.add-to-cart-modal').addEventListener('click', function() {
    const productId = parseInt(this.dataset.productId);
    addToCart(productId);
    productModal.style.display = 'none';
  });
}

function initializeAOS() {
  AOS.init({
    duration: 1200,
    once: true,
    offset: 100,
    easing: 'ease-in-out',
  });
}

// Product rendering
function renderProducts() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';

  if (filteredProducts.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">No products found matching your search.</p>';
    return;
  }

  filteredProducts.forEach(product => {
    const card = createProductCard(product);
    grid.appendChild(card);
  });
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.productId = product.id;
  
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=300'">
    <h3>${product.name}</h3>
    <p>$${product.price}</p>
    <div class="product-actions">
      <button class="product-btn add-btn" onclick="addToCart(${product.id})">
        <i class="fas fa-cart-plus"></i> Add to Cart
      </button>
      ${editMode ? `
        <button class="product-btn edit-btn" onclick="editProduct(${product.id})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="product-btn delete-btn" onclick="deleteProduct(${product.id})">
          <i class="fas fa-trash"></i> Delete
        </button>
      ` : ''}
    </div>
  `;

  // Add click event to open modal (but not on buttons)
  card.addEventListener('click', function(e) {
    if (!e.target.closest('.product-actions')) {
      openProductModal(product);
    }
  });

  return card;
}

function openProductModal(product) {
  const modal = document.getElementById('productModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalPrice = document.getElementById('modalPrice');
  const addToCartBtn = document.querySelector('.add-to-cart-modal');

  modalImage.src = product.image;
  modalTitle.textContent = product.name;
  modalDesc.textContent = product.description;
  modalPrice.textContent = `$${product.price}`;
  addToCartBtn.dataset.productId = product.id;

  modal.style.display = 'block';
}

// Search functionality
function searchProducts() {
  const searchTerm = document.getElementById('searchBox').value.toLowerCase().trim();
  
  if (searchTerm === '') {
    filteredProducts = [...products];
  } else {
    filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }
  
  renderProducts();
  showMessage(`Found ${filteredProducts.length} product(s)`, 'success');
}

function filterProducts(category) {
  const searchTerm = document.getElementById('searchBox').value.toLowerCase().trim();
  
  let filtered = [...products];
  
  // Apply category filter
  if (category !== 'all') {
    filtered = filtered.filter(product => product.category === category);
  }
  
  // Apply search filter
  if (searchTerm !== '') {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }
  
  filteredProducts = filtered;
  renderProducts();
}

// Cart functionality
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  updateCartDisplay();
  animateCartIcon();
  showMessage(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
  const index = cart.findIndex(item => item.id === productId);
  if (index > -1) {
    const product = cart[index];
    cart.splice(index, 1);
    updateCartDisplay();
    showMessage(`${product.name} removed from cart`, 'success');
  }
}

function updateCartQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartDisplay();
    }
  }
}

function updateCartDisplay() {
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  cartCount.textContent = totalItems;
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty</p>';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <br>
          <small>$${item.price} each</small>
        </div>
        <div>
          <button onclick="updateCartQuantity(${item.id}, -1)" class="product-btn" style="background: #ffc107; padding: 5px 10px;">-</button>
          <span style="margin: 0 10px;">${item.quantity}</span>
          <button onclick="updateCartQuantity(${item.id}, 1)" class="product-btn" style="background: #28a745; padding: 5px 10px;">+</button>
        </div>
        <div>
          <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
          <br>
          <button onclick="removeFromCart(${item.id})" class="product-btn delete-btn" style="padding: 5px 10px; margin-top: 5px;">Remove</button>
        </div>
      </div>
    `).join('');
  }
  
  cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

function toggleCart() {
  const cartSection = document.getElementById('cart-section');
  cartSection.classList.toggle('hidden');
  
  if (!cartSection.classList.contains('hidden')) {
    cartSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function animateCartIcon() {
  const cartIcon = document.querySelector('.cart-icon');
  cartIcon.classList.add('shake');
  setTimeout(() => {
    cartIcon.classList.remove('shake');
  }, 500);
}

function handleCheckout() {
  if (cart.length === 0) {
    showMessage('Your cart is empty!', 'error');
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Simulate checkout process
  showMessage('Processing your order...', 'success');
  
  setTimeout(() => {
    showMessage(`Order confirmed! ${itemCount} items for $${total.toFixed(2)}. We'll contact you soon via WhatsApp for delivery details.`, 'success');
    cart = [];
    updateCartDisplay();
    toggleCart();
  }, 2000);
}

// Admin functionality
function toggleEditMode() {
  editMode = !editMode;
  renderProducts();
  showMessage(`Edit mode ${editMode ? 'enabled' : 'disabled'}`, 'success');
}

function showAddProductForm() {
  document.getElementById('formModalTitle').textContent = 'Add New Product';
  document.getElementById('productForm').reset();
  document.getElementById('productForm').dataset.editId = '';
  document.getElementById('productFormModal').style.display = 'block';
}

function editProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  document.getElementById('formModalTitle').textContent = 'Edit Product';
  document.getElementById('productName').value = product.name;
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productImage').value = product.image;
  document.getElementById('productCategory').value = product.category;
  document.getElementById('productDescription').value = product.description;
  document.getElementById('productForm').dataset.editId = productId;
  document.getElementById('productFormModal').style.display = 'block';
}

function deleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    const index = products.findIndex(p => p.id === productId);
    if (index > -1) {
      const product = products[index];
      products.splice(index, 1);
      
      // Remove from cart if exists
      cart = cart.filter(item => item.id !== productId);
      
      // Update filtered products
      filteredProducts = filteredProducts.filter(p => p.id !== productId);
      
      renderProducts();
      updateCartDisplay();
      showMessage(`${product.name} deleted successfully`, 'success');
    }
  }
}

function handleProductSubmit(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('productName').value.trim(),
    price: parseFloat(document.getElementById('productPrice').value),
    image: document.getElementById('productImage').value.trim(),
    category: document.getElementById('productCategory').value,
    description: document.getElementById('productDescription').value.trim()
  };
  
  const editId = e.target.dataset.editId;
  
  if (editId) {
    // Edit existing product
    const index = products.findIndex(p => p.id == editId);
    if (index > -1) {
      products[index] = { ...products[index], ...formData };
      showMessage('Product updated successfully!', 'success');
    }
  } else {
    // Add new product
    const newProduct = {
      id: nextId++,
      ...formData
    };
    products.push(newProduct);
    showMessage('Product added successfully!', 'success');
  }
  
  // Update filtered products and re-render
  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
  filterProducts(activeFilter);
  
  closeProductForm();
}

function closeProductForm() {
  document.getElementById('productFormModal').style.display = 'none';
  document.getElementById('productForm').reset();
}

function exportProducts() {
  const dataStr = JSON.stringify(products, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'scented-serenade-products.json';
  link.click();
  URL.revokeObjectURL(url);
  showMessage('Products exported successfully!', 'success');
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showMessage(message, type = 'success') {
  const container = document.getElementById('messageContainer');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  
  container.appendChild(messageDiv);
  
  // Position the message
  messageDiv.style.position = 'fixed';
  messageDiv.style.top = '100px';
  messageDiv.style.left = '50%';
  messageDiv.style.transform = 'translateX(-50%)';
  messageDiv.style.zIndex = '10000';
  messageDiv.style.maxWidth = '90%';
  messageDiv.style.width = 'auto';
  
  // Remove message after 3 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 3000);
}

// Smooth scroll to top functionality
window.addEventListener('scroll', function() {
  const nav = document.querySelector('.nav-header');
  if (window.scrollY > 100) {
    nav.style.background = 'rgba(255, 240, 244, 0.98)';
    nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  } else {
    nav.style.background = 'rgba(255, 240, 244, 0.95)';
    nav.style.boxShadow = 'none';
  }
});

// Performance optimization: Lazy loading for images
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);