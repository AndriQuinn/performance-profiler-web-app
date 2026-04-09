// Uniform
export const generateData = (size) => {
    
    const arr = new Int32Array(size)
    // Fill data 
    for (var i = 0; i < size; i++) {
        // Uniform
        arr[i] = i+1

    }
    console.log(arr)
    return arr
}

// Non - Uniform
export function generateRandomGapsArr(size, min, max) {
  const arr = new Int32Array(size)
  arr[0] = min
  
  for (let i = 1; i < size; i++) {
    const jump = Math.round(Math.random() * ((max - min) / size) * 5)
    const next = arr[i - 1] + jump  //  use i-1 instead of arr[arr.length - 1]
    arr[i] = Math.min(next, max)    //  index assignment instead of push
  }

  // Int32Array doesn't support Set directly, convert to regular array first
  const unique = [...new Set([...arr])]  // spread to regular array first

  while (unique.length < size) {
    const last = unique[unique.length - 1]
    unique.push(Math.min(last + 1, max))
  }

  console.log(arr)

  // return as Int32Array for worker transfer
  return new Int32Array(unique.slice(0, size).sort((a, b) => a - b))  
}