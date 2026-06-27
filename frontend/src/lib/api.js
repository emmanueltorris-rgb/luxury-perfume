const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'

async function fetchJson(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(payload?.detail || payload?.message || 'Request failed')
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

export async function fetchProducts() {
  return fetchJson('/products')
}

export async function initiateStkPush({ phone_number, amount, product_id }) {
  return fetchJson('/payments/stk-push', {
    method: 'POST',
    body: JSON.stringify({ phone_number, amount, product_id }),
  })
}

export async function fetchTransactionStatus(transactionId) {
  return fetchJson(`/payments/status/${transactionId}`)
}

export async function login({ email, password }) {
  return fetchJson('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function signup({ name, email, phone, password }) {
  return fetchJson('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, phone, password }),
  })
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function adminCreateProduct({ token, fields }) {
  // fields is a FormData instance
  const response = await fetch(`${API_BASE}/products/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: fields,
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.detail || 'Create product failed')
  return payload
}

export async function adminUpdateProduct({ token, productId, fields }) {
  const response = await fetch(`${API_BASE}/products/${productId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: fields,
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.detail || 'Update product failed')
  return payload
}
