 function toggleMenu() {
      document.getElementById("menu").classList.toggle("show");
    }
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        document.getElementById("menu").classList.remove("show");
      }
    });
    // script carrusel 
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

// Lista de productos (simulada)
    const productos = [
      { id: 1, nombre: "Timer de heladera", desc: "Timer para heladera Electrolux", precio: 10000, img: "https://picsum.photos/id/20/300/200" },
      { id: 2, nombre: "Placa principal lavarropas", desc: "Placa de potencia Electrolux", precio: 15000, img: "https://picsum.photos/id/26/300/200" },
      { id: 3, nombre: "Resistencia Heladera DF", desc: "Resistencia de deshielo", precio: 20000, img: "https://picsum.photos/id/30/300/200" },
      { id: 4, nombre: "Termostato RC-45070-4", desc: "Termostato caña completa", precio: 25000, img: "https://picsum.photos/id/41/300/200" }
    ];

    // Carrito: array de objetos { id, cantidad }
    let carrito = [];

    // Cargar carrito desde localStorage
    function loadCart() {
      const saved = localStorage.getItem("smd_cart");
      if (saved) {
        carrito = JSON.parse(saved);
      } else {
        carrito = [];
      }
      updateCartUI();
    }

    // Guardar carrito en localStorage
    function saveCart() {
      localStorage.setItem("smd_cart", JSON.stringify(carrito));
      updateCartUI();
    }

    // Agregar producto al carrito
    function addToCart(productId) {
      const existing = carrito.find(item => item.id === productId);
      if (existing) {
        existing.cantidad++;
      } else {
        carrito.push({ id: productId, cantidad: 1 });
      }
      saveCart();
    }

    // Eliminar producto del carrito
    function removeFromCart(productId) {
      carrito = carrito.filter(item => item.id !== productId);
      saveCart();
    }

    // Cambiar cantidad (para más adelante)
    function updateQuantity(productId, newCant) {
      const item = carrito.find(i => i.id === productId);
      if (item) {
        if (newCant <= 0) removeFromCart(productId);
        else { item.cantidad = newCant; saveCart(); }
      }
    }

    // Actualizar UI del carrito (sidebar y contador)
    function updateCartUI() {
      // contador
      const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
      document.getElementById("cartCount").innerText = totalItems;

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
              <button onclick="removeFromCart(${item.id})">🗑️</button>
            </div>
          </div>
        `;
      }
      container.innerHTML = html;
      document.getElementById("cartTotal").innerHTML = `Total: $${total.toLocaleString()}`;
    }

    // Renderizar productos en la grilla
    function renderProducts() {
      const grid = document.getElementById("productGrid");
      if (!grid) return;
      grid.innerHTML = "";
      productos.forEach(prod => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <img src="${prod.img}" alt="${prod.nombre}" class="product-img">
          <div class="product-info">
            <div class="product-title">${prod.nombre}</div>
            <div class="product-desc">${prod.desc}</div>
            <div class="price">$${prod.precio.toLocaleString()}</div>
            <button class="btn-buy" data-id="${prod.id}">Comprar</button>
          </div>
        `;
        grid.appendChild(card);
      });
      // Agregar eventos a botones Comprar
      document.querySelectorAll(".btn-buy").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const id = parseInt(btn.dataset.id);
          addToCart(id);
          // Opcional: abrir sidebar para feedback
          document.getElementById("cartSidebar").classList.add("open");
          document.getElementById("cartOverlay").classList.add("show");
        });
      });
    }

    // Funciones para abrir/cerrar carrito
    function openCart() {
      document.getElementById("cartSidebar").classList.add("open");
      document.getElementById("cartOverlay").classList.add("show");
    }
    function closeCart() {
      document.getElementById("cartSidebar").classList.remove("open");
      document.getElementById("cartOverlay").classList.remove("show");
    }

    // Event listeners
    document.getElementById("cartIcon").addEventListener("click", openCart);
    document.getElementById("closeCartBtn").addEventListener("click", closeCart);
    document.getElementById("cartOverlay").addEventListener("click", closeCart);

    // Inicialización
    loadCart();
 //   renderProducts();
    window.toggleMenu = function() {
      document.getElementById("menu").classList.toggle("show");
    };
    window.removeFromCart = removeFromCart;  // para que funcione onclick


