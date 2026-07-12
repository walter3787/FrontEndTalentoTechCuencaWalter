# FrontEndTalentoTechCuencaWalter
Proyecto final del curso de Front End en Talento Tech

# SMD Electrónica

Sitio web desarrollado como proyecto final de Frontend para mostrar productos y servicios de mantenimiento de electrodomésticos.  
El proyecto combina **diseño responsivo**, **interactividad con JavaScript**, y **consumo de múltiples APIs externas** para ofrecer una experiencia completa de e‑commerce.

## 🚀 Características principales
- **HTML semántico y accesible** con etiquetas estructurales (`header`, `nav`, `main`, `section`, `footer`).
- **Diseño responsivo** con Flexbox, Grid y Media Queries, adaptado a desktop, tablet y mobile.
- **Formulario de contacto funcional** conectado a [Formspree](https://formspree.io) con validación en JavaScript.
- **Carrito de compras dinámico** con persistencia en `localStorage`, edición de cantidades y modal de confirmación.
- **Catálogo de productos dinámico**:
  - Consumo de datos desde **Fake Store API** y **DummyJSON**.
  - Normalización y unión de múltiples fuentes en un solo catálogo.
  - Renderizado de productos con imagen, descripción, precio y rating.
- **Reseñas de clientes**:
  - Integración de reseñas anidadas desde DummyJSON.
  - Carrusel automático y navegable con botones prev/next.
- **Contenido multimedia**: imágenes de productos, íconos sociales y mapa de Google Maps.
- **SEO básico** con `meta description` y `keywords`.
- **Hosting gratuito** en GitHub Pages:  
  👉 [Ver sitio en línea](https://walter3787.github.io/FrontEndTalentoTechCuencaWalter/)

## 🌐 Consumo de APIs externas
El catálogo de productos y las reseñas de clientes no están hardcodeados, sino que se generan dinámicamente a partir de múltiples fuentes:

- **[Fake Store API](https://fakestoreapi.com/)** → Productos electrónicos con título, descripción, precio e imagen.
- **[DummyJSON](https://dummyjson.com/)** → Laptops, smartphones, tablets y accesorios.
- **Reseñas anidadas** → Se integran reseñas de clientes directamente desde DummyJSON, mostrando comentarios, nombres y ratings en un carrusel automático.

Todos estos datos se **normalizan y unifican** en un solo catálogo, lo que demuestra la capacidad de integrar y manipular información de diferentes APIs en un mismo proyecto.

## 📂 Estructura del proyecto
- `index.html` → Página principal con secciones de hero, tienda, servicios, reseñas, contacto y footer.
- `css/estilos.css` → Estilos globales y responsivos.
- `carrito.js` → Lógica de carrito, fetch de productos, renderizado dinámico y validación de formulario.
- `img/` → Imágenes de productos e íconos.

## 💡 Valor profesional
Este proyecto demuestra:
- Capacidad para **integrar APIs externas** y trabajar con datos anidados.
- Manejo de **JavaScript moderno** para interactividad y persistencia.
- Uso de **buenas prácticas de accesibilidad y SEO**.
- Habilidad para construir un **sitio completo y funcional**, desde el diseño hasta la lógica de negocio.
