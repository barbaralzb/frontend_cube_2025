const BASE_URL = `${process.env.NEXT_PUBLIC_DB}/products`;
const API_KEY = process.env.NEXT_PUBLIC_SECRET_KEY as string; // Asegurar que no sea undefined

async function fetchWithAuth<T>(url: string): Promise<T> {
  if (!API_KEY) throw new Error("API_KEY is not defined");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
  };

  const response = await fetch(url, { headers });

  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

  return response.json();
}

export async function getProductSlugs(): Promise<any[]> {
  try {
    return await fetchWithAuth<any[]>(BASE_URL);
  } catch (error) {
    console.error("Error fetching product slugs:", error);
    return [];
  }
}

export async function getProduct(id: string): Promise<any | null> {
  try {
    return await fetchWithAuth<any>(`${BASE_URL}/${id}`);
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