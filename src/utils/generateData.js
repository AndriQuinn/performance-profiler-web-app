// Uniform
export const generateUniformData = (size) => {
  const datasetHeaders = ['SKU', 'Name', 'Category', 'Price', 'Stock'];
  const datasetPreview = Array.from({ length: size }, (_, i) => [
    `${i+1}`,
    `Generated Product ${i + 1}`,
    ['Electronics', 'Clothing', 'Home', 'Toys'][Math.floor(Math.random() * 4)],
    `$${(Math.random() * 100).toFixed(2)}`,
    Math.floor(Math.random() * 1000)
  ]);

  return [datasetHeaders,...datasetPreview]
}

// Non - Uniform
export const generateNonUniformData = (size) => {
  const min = 0
  const max = size * 3

  const datasetHeaders = ['SKU', 'Name', 'Category', 'Price', 'Stock']

  // Generate unique non-uniform numbers without clamping
  const set = new Set()
  while (set.size < size) {
    const value = Math.floor(Math.random() * (max - min + 1)) + min
    set.add(value)
  }

  const sorted = [...set].sort((a, b) => a - b)

  const datasetPreview = Array.from({ length: size }, (_, i) => [
    `${sorted[i]}`,
    `Generated Product ${i + 1}`,
    ['Electronics', 'Clothing', 'Home', 'Toys'][Math.floor(Math.random() * 4)],
    `$${(Math.random() * 100).toFixed(2)}`,
    Math.floor(Math.random() * 1000)
  ])

  return [datasetHeaders, ...datasetPreview]
}
