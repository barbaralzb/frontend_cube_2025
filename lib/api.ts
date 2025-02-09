const BASE_URL =`${process.env.DB}/products`;

export async function getProductSlugs() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch products");
    const products = await response.json();

    return products
  } catch (error) {
    console.error("Error fetching product slugs:", error);
    return [];
  }
}

export async function getProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

export function saveLocalData(cart, checkoutId, checkoutUrl) {
  localStorage.setItem(
    "checkoutData",
    JSON.stringify([cart, checkoutId, checkoutUrl])
  );
}

export function getLocalData() {
  const data = localStorage.getItem("checkoutData");
  return data ? JSON.parse(data) : null;
}

export function createCheckout(newItem) {
  const checkoutId = `checkout_${Date.now()}`; // Crear un ID único
  const checkoutUrl = `/checkout/${checkoutId}`; // Simular una URL de checkout

  const localData = getLocalData();
  let cart = localData ? localData[0] : [];

  // Evitar duplicados en el carrito
  const existingItemIndex = cart.findIndex(item => item.variantId === newItem.variantId);

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].variantQuantity += newItem.variantQuantity;
  } else {
    cart.push(newItem);
  }

  saveLocalData(cart, checkoutId, checkoutUrl);

  return { checkoutId, checkoutUrl };
}

export function updateCheckout(updatedCart, checkoutId) {
  if (!updatedCart || !Array.isArray(updatedCart)) {
    console.error("updateCheckout: El carrito no es válido.");
    return;
  }

  const localData = getLocalData();
  const checkoutUrl = localData ? localData[2] : `/checkout/${checkoutId}`;

  saveLocalData(updatedCart, checkoutId, checkoutUrl);
}