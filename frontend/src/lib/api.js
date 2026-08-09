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

export async function fetchProduct(productId) {
  return fetchJson(`/products/${productId}`)
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
  return fetchJson('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, phone, password }),
  })
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchAdminProducts({ token }) {
  const response = await fetch(`${API_BASE}/admin/products/`, {
    headers: authHeaders(token),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      payload?.detail || 'Failed to load products'
    )
  }

  return payload
}


export async function fetchLowStockProducts({ token }) {
  const response = await fetch(`${API_BASE}/admin/products/low-stock`, {
    headers: authHeaders(token),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      payload?.detail || 'Failed to load low-stock products'
    )
  }

  return payload
}
export async function adminCreateProduct({ token, fields }) {
  // fields is a FormData instance
  const response = await fetch(`${API_BASE}/admin/products/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: fields,
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.detail || 'Create product failed')
  return payload
}

export async function adminUpdateProduct({ token, productId, fields }) {
  const response = await fetch(`${API_BASE}/admin/products/${productId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: fields,
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.detail || 'Update product failed')
  return payload
}

export async function adminDeleteProduct({ token, productId }) {
  const response = await fetch(`${API_BASE}/admin/products/${productId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    throw new Error(payload?.detail || 'Delete failed')
  }
  return true
}

export async function fetchAllOrders({ token }) {
  const response = await fetch(`${API_BASE}/admin/orders/`, {
    headers: authHeaders(token),
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.detail || 'Failed to load orders')
  return payload
}

export async function updateOrderStatus({ token, orderId, status }) {
  const response = await fetch(`${API_BASE}/admin/orders/${orderId}/status?status=${encodeURIComponent(status)}`, {
    method: 'PUT',
    headers: authHeaders(token),
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.detail || 'Failed to update status')
  return payload
}

export async function adminDeleteProductImage({
  token,
  productId,
  imageId,
}) {
  const response = await fetch(
    `${API_BASE}/admin/products/${productId}/images/${imageId}`,
    {
      method: 'DELETE',
      headers: authHeaders(token),
    }
  )

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      payload?.detail || 'Failed to delete image'
    )
  }

  return payload
}


export async function adminActivateProduct({
  token,
  productId,
}) {
  const response = await fetch(
    `${API_BASE}/admin/products/${productId}/activate`,
    {
      method: 'PUT',
      headers: authHeaders(token),
    }
  )

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      payload?.detail || 'Failed to activate product'
    )
  }

  return payload
}

export async function adminSetMainProductImage({
  token,
  productId,
  imageId,
}) {
  const response = await fetch(
    `${API_BASE}/admin/products/${productId}/images/${imageId}/main`,
    {
      method: 'PUT',
      headers: authHeaders(token),
    }
  )

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      payload?.detail || 'Failed to set main image'
    )
  }

  return payload
}


