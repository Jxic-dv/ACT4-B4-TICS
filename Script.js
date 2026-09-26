// script.js
// Mini app: catálogo de productos consumido desde una API pública.

const API_URL = "https://fakestoreapi.com/products";

const productListEl = document.getElementById("productList");
const statusEl = document.getElementById("status");
const searchInputEl = document.getElementById("searchInput");
const categoryFilterEl = document.getElementById("categoryFilter");
const reloadBtnEl = document.getElementById("reloadBtn");

let allProducts = [];

function setStatus(message) {
  statusEl.textContent = message;
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.title;

  const title = document.createElement("h3");
  title.textContent = product.title;

  const price = document.createElement("span");
  price.className = "price";
  price.textContent = `$${product.price.toFixed(2)}`;

  const category = document.createElement("span");
  category.className = "category";
  category.textContent = product.category;

  card.appendChild(image);
  card.appendChild(title);
  card.appendChild(price);
  card.appendChild(category);

  return card;
}

function renderProducts(products) {
  productListEl.innerHTML = "";

  if (products.length === 0) {
    setStatus("No se encontraron productos con ese criterio.");
    return;
  }

  setStatus(`Mostrando ${products.length} producto(s).`);

  const fragment = document.createDocumentFragment();
  products.forEach((product) => {
    fragment.appendChild(createProductCard(product));
  });
  productListEl.appendChild(fragment);
}

function populateCategoryFilter(products) {
  const categories = Array.from(new Set(products.map((p) => p.category)));

  categoryFilterEl.innerHTML = '<option value="all">Todas las categorías</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilterEl.appendChild(option);
  });
}

function applyFilters() {
  const searchTerm = searchInputEl.value.trim().toLowerCase();
  const selectedCategory = categoryFilterEl.value;

  const filtered = allProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm);
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  renderProducts(filtered);
}

async function loadProducts() {
  setStatus("Cargando productos...");
  productListEl.innerHTML = "";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    allProducts = data;

    populateCategoryFilter(allProducts);
    renderProducts(allProducts);
  } catch (error) {
    setStatus("Ocurrió un error al obtener los datos. Intenta de nuevo.");
    console.error("Error al cargar productos:", error);
  }
}

searchInputEl.addEventListener("input", applyFilters);
categoryFilterEl.addEventListener("change", applyFilters);
reloadBtnEl.addEventListener("click", loadProducts);

document.addEventListener("DOMContentLoaded", loadProducts);