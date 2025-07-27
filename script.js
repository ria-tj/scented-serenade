// Modal elements
const productCards = document.querySelectorAll('.product-card');
const modal = document.getElementById('productModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const closeModal = document.querySelector('.close-modal');

// Cart
let cartCount = 0;
const cartBadge = document.getElementById('cartCount');

// Example product descriptions
const productInfo = {
  "Aqua Di Gio": "Fresh marine notes blended with citrus and woody undertones.",
  "Golden Mist": "A warm, golden fragrance with hints of vanilla and amber.",
  "Yves Saint Laurent": "A luxurious floral bouquet with a modern twist."
};

// Open modal on product click
productCards.forEach(card => {
  card.addEventListener('click', () => {
    const title = card.querySelector('h3').innerText;
    const imgSrc = card.querySelector('img').src;

    modalImage.src = imgSrc;
    modalTitle.textContent = title;
    modalDesc.textContent = productInfo[title] || "A beautiful fragrance to elevate your mood.";
    modal.style.display = 'block';
  });
});

// Close modal
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});
window.addEventListener('click', (e) => {
  if (e.target == modal) modal.style.display = 'none';
});

// Add to cart
document.querySelector('.add-to-cart').addEventListener('click', () => {
  cartCount++;
  cartBadge.textContent = cartCount;
  modal.style.display = 'none';
});

// Optional: Animate cart icon on update
function animateCart() {
  document.querySelector('.cart-icon').classList.add('shake');
  setTimeout(() => {
    document.querySelector('.cart-icon').classList.remove('shake');
  }, 500);
}
document.querySelector('.add-to-cart').addEventListener('click', animateCart);

AOS.init({
  duration: 1200,
  once: true,
  offset: 200,
  easing: 'ease-in-out',
});
