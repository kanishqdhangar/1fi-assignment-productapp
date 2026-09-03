const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // API didn't return JSON
  }

  if (!response.ok) {
    throw new Error(payload?.error || "Something went wrong");
  }

  return payload;
}

export function fetchProducts() {
  return request("/products");
}

export function fetchProduct(slug) {
  return request(`/products/${encodeURIComponent(slug)}`);
}

export function fetchVariantEmiPlans(slug, variantId) {
  return request(
    `/products/${encodeURIComponent(slug)}/variants/${variantId}/emi-plans`
  );
}
