export const generateData = (size,arr,arr2,min = 1,max = 100, skew = 2) => {
    // Fill data 
    for (var i = 0; i < size; i++) {
        // Uniform
        arr.push(i+1)

      // Non uniform
        let t = i / (size - 1);
        let value = Math.round(min + Math.pow(t, skew) * (max - min)); // ✅ starts at min, ends at max, integer
        arr2.push(value);
    }
}