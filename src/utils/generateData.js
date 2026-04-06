export const generateData = (size) => {
    
    const arr = []
    // Fill data 
    for (var i = 0; i < size; i++) {
        // Uniform
        arr.push(i+1)

    }
    return arr
}

export function generateRandomGapsArr(size, min, max) {
  const arr = [min];
  for (let i = 1; i < size; i++) {
    const jump = Math.round(Math.random() * ((max - min) / size) * 5);
    const next = arr[arr.length - 1] + jump;
    arr.push(Math.min(next, max));
  }

  // remove duplicates and ensure exactly size elements
  const unique = [...new Set(arr)];

  // if too short, fill with evenly spaced values up to max
  while (unique.length < size) {
    const last = unique[unique.length - 1];
    unique.push(Math.min(last + 1, max));
  }

  return unique.slice(0, size).sort((a, b) => a - b);
}