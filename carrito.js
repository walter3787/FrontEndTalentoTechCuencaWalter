// ===============================
// Menú hamburguesa
// ===============================
function toggleMenu() {
  document.getElementById("menu").classList.toggle("show");
}
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    document.getElementById("menu").classList.remove("show");
  }
});

// ===============================
// Carrusel reseñas
// ===============================
const track = document.querySelector('.carrusel-track');
const reseñas = document.querySelectorAll('.reseña');
let index = 0;

function mostrarReseña() {
  track.style.transform = `translateX(-${index * 100}%)`;
}
function siguienteReseña() {
  index = (index + 1) % reseñas.length;
  mostrarReseña();
}
setInterval(siguienteReseña, 4000); // cambia cada 4 segundos

// ===============================
// Productos (dinámicos con API)
// ===============================
let productos = []; // se llena con fetch

// ===============================
// Carrito
// ===============================
let carrito = [];

// Cargar carrito desde localStorage
function loadCart() {
  const saved = localStorage.getItem("smd_cart");
  carrito = saved ? JSON.parse(saved) : [];
  updateCartUI();
}

// Guardar carrito en localStorage
function saveCart() {
  localStorage.setItem("smd_cart", JSON.stringify(carrito));
  updateCartUI();
}

// Agregar producto
function addToCart(productId) {
  const existing = carrito.find(item => item.id === productId);
  if (existing) {
    existing.cantidad++;
  } else {
    carrito.push({ id: productId, cantidad: 1 });
  }
  saveCart();
}

// Eliminar producto
function removeFromCart(productId) {
  carrito = carrito.filter(item => item.id !== productId);
  saveCart();
}

// Cambiar cantidad
function updateQuantity(productId, newCant) {
  const item = carrito.find(i => i.id === productId);
  if (item) {
    if (newCant <= 0) removeFromCart(productId);
    else { item.cantidad = newCant; saveCart(); }
  }
}

// ===============================
// UI del carrito
// ===============================
function updateCartUI() {
  // contador
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  document.getElementById("cartCount").innerText = totalItems;

  // sincronizar también el contador en mobile
  const cartCountMobile = document.getElementById("cartCountMobile");
  if (cartCountMobile) {
    cartCountMobile.innerText = totalItems;
  }

  const container = document.getElementById("cartItemsContainer");
  if (carrito.length === 0) {
    container.innerHTML = "<p>El carrito está vacío</p>";
    document.getElementById("cartTotal").innerHTML = "Total: $0";
    return;
  }

  let total = 0;
  let html = "";
  for (let item of carrito) {
    const prod = productos.find(p => p.id === item.id);
    if (!prod) continue;
    const subtotal = prod.precio * item.cantidad;
    total += subtotal;
    html += `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${prod.nombre}</h4>
          <p>$${prod.precio} x ${item.cantidad} = $${subtotal}</p>
        </div>
        <div class="cart-item-actions">
          <button onclick="updateQuantity(${item.id}, ${item.cantidad - 1})">➖</button>
          <button onclick="updateQuantity(${item.id}, ${item.cantidad + 1})">➕</button>
          <button onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
  document.getElementById("cartTotal").innerHTML = `Total: $${total.toLocaleString()}`;
}


// ===============================
// Renderizar ratings
// ===============================

function getStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  let stars = "★".repeat(fullStars);
  if (halfStar) stars += "½";
  return stars.padEnd(5, "☆"); // completa hasta 5
}


// ===============================
// Renderizar productos
// ===============================
function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = "";
  productos.forEach(prod => {
    const card = document.createElement("div");
    card.className = "producto";
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.nombre}" class="producto-img">
      <div class="product-info">
        <div class="product-title">${prod.nombre}</div>
        <div class="product-desc">${prod.desc}</div>
        <div class="price">$${prod.precio.toLocaleString()}</div>
        <div class="rating">${getStars(prod.rating || 0)}</div>
        <button class="btn-buy" data-id="${prod.id}">Comprar</button>
      </div>
    `;
    grid.appendChild(card);

  });
  // Eventos de botones Comprar
  document.querySelectorAll(".btn-buy").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      addToCart(id);
      document.getElementById("cartSidebar").classList.add("open");
      document.getElementById("cartOverlay").classList.add("show");
    });
  });
}

// ===============================
// Render reviews
// ===============================

function renderGlobalReviews() {
  const track = document.querySelector("#reseñas .carrusel-track");
  if (!track) return;

  // Limpiar contenido previo
  track.innerHTML = "";

  // Recorrer productos y sus reseñas
  productos.forEach(prod => {
    if (prod.reviews && prod.reviews.length > 0) {
      prod.reviews.forEach(r => {
        const div = document.createElement("div");
        div.className = "reseña";
        div.innerHTML = `
          <p>"${r.comment}"</p>
          <span>- ${r.reviewerName}</span>
          <div class="stars">${getStars(r.rating)}</div>
        `;

        track.appendChild(div);
      });
    }
  });
}


function renderReviews(product) {
  // Si no hay reseñas, devolvemos vacío
  if (!product.reviews || product.reviews.length === 0) {
    return "<p>No hay reseñas disponibles.</p>";
  }

  // Generamos HTML para cada reseña
  return product.reviews.map(r => `
    <div class="review">
      <div class="review-header">
        <strong>${r.reviewerName}</strong> – ${getStars(r.rating)}
      </div>
      <p class="review-comment">"${r.comment}"</p>
      <small class="review-date">${new Date(r.date).toLocaleDateString()}</small>
    </div>
  `).join("");
}

//AutoScroll Reseñas
let reviewIndex = 0;
let reviewsPerSlide = window.innerWidth > 768 ? 3 : 1;

function showReviews() {
  const track = document.querySelector("#reseñas .carrusel-track");
  const reseñas = document.querySelectorAll("#reseñas .reseña");
  if (!track || reseñas.length === 0) return;

  const reviewWidth = document.querySelector("#reseñas").offsetWidth;
  track.style.transform = `translateX(-${reviewIndex * reviewWidth}px)`;

}

function nextReviews() {
  const reseñas = document.querySelectorAll("#reseñas .reseña");
  if (reseñas.length === 0) return;

  reviewIndex += reviewsPerSlide;
  if (reviewIndex >= reseñas.length) {
    reviewIndex = 0;
  }
  showReviews();
}

function prevReviews() {
  const reseñas = document.querySelectorAll("#reseñas .reseña");
  if (reseñas.length === 0) return;

  reviewIndex -= reviewsPerSlide;
  if (reviewIndex < 0) {
    reviewIndex = Math.max(0, reseñas.length - reviewsPerSlide);
  }
  showReviews();
}

// recalcular en resize
window.addEventListener("resize", () => {
  reviewsPerSlide = window.innerWidth > 768 ? 3 : 1;
  reviewIndex = 0;
  showReviews();
});

// auto-slide cada 4 segundos
setInterval(nextReviews, 4000);

// listeners de botones
document.getElementById("nextReview").addEventListener("click", nextReviews);
document.getElementById("prevReview").addEventListener("click", prevReviews);



// ===============================
// Sidebar carrito
// ===============================
function openCart() {
  document.getElementById("cartSidebar").classList.add("open");
  document.getElementById("cartOverlay").classList.add("show");
}
function closeCart() {
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("show");
}

// ===============================
// Event listeners
// ===============================
document.getElementById("cartIcon").addEventListener("click", openCart);
// 👉 nuevo listener para el carrito en mobile
const cartIconMobile = document.getElementById("cartIconMobile");
if (cartIconMobile) {
  cartIconMobile.addEventListener("click", openCart);
}
document.getElementById("closeCartBtn").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);
document.getElementById("checkoutBtn").addEventListener("click", checkout);

window.toggleMenu = toggleMenu;
window.removeFromCart = removeFromCart; // para que funcione onclick

// ===============================
// Fetch API productos
// ===============================
async function fetchProducts() {
  // Llamadas en paralelo
  const [fakeRes, laptopsRes, phonesRes, tabletsRes, accessoriesRes] = await Promise.all([
    fetch("https://fakestoreapi.com/products/category/electronics"),
    fetch("https://dummyjson.com/products/category/laptops"),
    fetch("https://dummyjson.com/products/category/smartphones"),
    fetch("https://dummyjson.com/products/category/tablets"),
    fetch("https://dummyjson.com/products/category/mobile-accessories")
  ]);

  const [fakeData, laptopsData, phonesData, tabletsData, accessoriesData] = await Promise.all([
    fakeRes.json(),
    laptopsRes.json(),
    phonesRes.json(),
    tabletsRes.json(),
    accessoriesRes.json()
  ]);

  // Normalizar Fake Store
  const fakeProducts = fakeData.map(p => ({
    id: p.id,
    nombre: p.title,
    desc: p.description,
    precio: p.price,
    img: p.image,
    rating: p.rating?.rate || 0,   // rating adaptado
    reviews: []                   // Fake Store no trae reseñas
  }));

  // Normalizar DummyJSON (laptops, smartphones, tablets, accesorios)
  const laptops = laptopsData.products.map(p => ({
    id: p.id,
    nombre: p.title,
    desc: p.description,
    precio: p.price,
    img: p.thumbnail || p.images[0],
    rating: p.rating || 0,        // rating directo
    reviews: p.reviews || []      // reseñas si existen
  }));

  const smartphones = phonesData.products.map(p => ({
    id: p.id,
    nombre: p.title,
    desc: p.description,
    precio: p.price,
    img: p.thumbnail || p.images[0],
    rating: p.rating || 0,
    reviews: p.reviews || []
  }));

  const tablets = tabletsData.products.map(p => ({
    id: p.id,
    nombre: p.title,
    desc: p.description,
    precio: p.price,
    img: p.thumbnail || p.images[0],
    rating: p.rating || 0,
    reviews: p.reviews || []
  }));

  const accessories = accessoriesData.products.map(p => ({
    id: p.id,
    nombre: p.title,
    desc: p.description,
    precio: p.price,
    img: p.thumbnail || p.images[0],
    rating: p.rating || 0,
    reviews: p.reviews || []
  }));

  // Unir arrays
  productos = [...fakeProducts, ...laptops, ...smartphones, ...tablets, ...accessories];

  // Renderizar catálogo
  renderProducts();

  // Ahora sí, cargar carrito con productos disponibles
  loadCart();

  // Renderizar reseñas globales
  renderGlobalReviews();

  //Auto Scroll Reseñas
  autoScrollReviews();

}
fetchProducts();

// ===============================
// Checkout ficticio
// ===============================
function checkout() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  // Vaciar carrito
  carrito = [];
  saveCart();
  closeCart();

  // Mostrar modal
  const modal = document.getElementById("checkoutModal");
  modal.style.display = "block";

  // Cerrar modal al hacer clic en la X
  document.getElementById("closeModal").onclick = () => {
    modal.style.display = "none";
  };

  // Cerrar modal al hacer clic fuera del contenido
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}



// ===============================
// Validación formulario
// ===============================
document.querySelector("form").addEventListener("submit", (e) => {
  const email = document.getElementById("email").value;
  if (!email.includes("@")) {
    e.preventDefault();
    alert("Por favor ingresa un correo válido.");
  }
});

// ===============================
// Inicialización
// ===============================


fetchProducts();  // carga catálogo de productos



