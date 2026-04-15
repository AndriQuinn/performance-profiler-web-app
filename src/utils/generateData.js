// Uniform Generation
export const generateUniformData = (size) => {
  return Array.from({ length: size }, (_, i) => i + 1)
}

// Non - Uniform Generation
export const generateNonUniformData = (size) => {
  const min = 0
  const max = size * 3

  const set = new Set()
  while (set.size < size) {
    set.add(Math.floor(Math.random() * (max - min + 1)) + min)
  }

  return new Int32Array([...set].sort((a, b) => a - b))
}

// Generate table from the given arr id
export const generateTable = (arr) => {
  const headers = ['SKU', 'Name', 'Category', 'Price', 'Stock']
  const rows = arr.map((id) => [
    id,
    `Generated Product ${id}`,
    ['Electronics', 'Clothing', 'Home', 'Toys'][Math.floor(Math.random() * 4)],
    `$${(Math.random() * 100).toFixed(2)}`,
    Math.floor(Math.random() * 1000)
  ])
  return [headers, ...rows]
}