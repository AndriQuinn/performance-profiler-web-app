/**
 * Interpolation Search
 * @param {number[]} arr - sorted array
 * @param {number} target - value to search
 * @returns {number} index of target, or -1 if not found
 */
export function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      return arr[low] === target ? low : -1;
    }

    // Estimate position
    const pos =
      low +
      Math.floor(
        ((high - low) * (target - arr[low])) / (arr[high] - arr[low])
      );

    if (arr[pos] === target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }

  return -1; // Not found
}

/**
 * Binary Search
 * @param {number[]} arr - sorted array
 * @param {number} target - value to search
 * @param {number} left - left index
 * @param {number} right - right index
 * @returns {number} index of target, or -1 if not found
 */
export function binarySearch(arr, target, left = 0, right = arr.length - 1) {
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

/**
 * Hybrid Interpolation-Binary Search
 * @param {number[]} arr - sorted array
 * @param {number} target - value to search
 * @returns {number} index of target, or -1 if not found
 */
export function interpolationBinarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  let consecutiveBadProbes = 0;
  const BAD_PROBE_THRESHOLD = 3;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (arr[high] === arr[low]) {
      return arr[low] === target ? low : -1;
    }

    const mid = Math.floor((low + high) / 2);

    // True fallback: switch to binary search if interpolation is probing poorly
    if (consecutiveBadProbes >= BAD_PROBE_THRESHOLD) {
      return binarySearch(arr, target, low, high);
    }

    // Estimate position using interpolation
    const pos =
      low +
      Math.floor(
        ((high - low) * (target - arr[low])) / (arr[high] - arr[low])
      );

    if (arr[pos] === target) return pos;

    // Track if interpolation is probing far from the midpoint (skewed data)
    if (Math.abs(pos - mid) > (high - low) * 0.5) {
      consecutiveBadProbes++;
    } else {
      consecutiveBadProbes = 0; // reset if probe looks healthy
    }

    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }

  // Fallback for when target is out of bounds or range is exhausted
  return binarySearch(arr, target, low, high);
}

/**
 * Fibonacci Search
 * @param {number[]} arr - sorted array
 * @param {number} target - value to search
 * @returns {number} index of target, or -1 if not found
 */
export function fibonacciSearch(arr, target) {
  const n = arr.length;

  // Initialize fibonacci numbers
  let fibMMm2 = 0; // (m-2)'th Fibonacci No.
  let fibMMm1 = 1; // (m-1)'th Fibonacci No.
  let fibM = fibMMm2 + fibMMm1; // m'th Fibonacci

  // Find the smallest fibonacci number >= n
  while (fibM < n) {
    fibMMm2 = fibMMm1;
    fibMMm1 = fibM;
    fibM = fibMMm2 + fibMMm1;
  }

  // Marks the eliminated range from front
  let offset = -1;

  while (fibM > 1) {
    // Check if fibMMm2 is a valid location
    const i = Math.min(offset + fibMMm2, n - 1);

    if (arr[i] < target) {
      // Move three fibonacci variables down
      fibM = fibMMm1;
      fibMMm1 = fibMMm2;
      fibMMm2 = fibM - fibMMm1;
      offset = i;
    } else if (arr[i] > target) {
      // Move fibonacci numbers down by two
      fibM = fibMMm2;
      fibMMm1 = fibMMm1 - fibMMm2;
      fibMMm2 = fibM - fibMMm1;
    } else {
      return i; // Found target
    }
  }

  // Compare the last element
  if (fibMMm1 && arr[offset + 1] === target) {
    return offset + 1;
  }

  return -1; // Not found
}

/**
 * Interpolation-Fibonacci Hybrid Search
 * @param {number[]} arr - sorted array
 * @param {number} target - value to search
 * @returns {number} index of target, or -1 if not found
 */
export function interpolationFibonacciSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  let consecutiveBadProbes = 0;
  const BAD_PROBE_THRESHOLD = 3;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (arr[high] === arr[low]) {
      return arr[low] === target ? low : -1;
    }

    const mid = Math.floor((low + high) / 2);

    // True fallback: switch to Fibonacci if interpolation is probing poorly
    if (consecutiveBadProbes >= BAD_PROBE_THRESHOLD) {
      const slice = arr.slice(low, high + 1);
      const result = fibonacciSearch(slice, target);
      return result !== -1 ? low + result : -1;
    }

    // Estimate position using interpolation
    const pos =
      low +
      Math.floor(
        ((high - low) * (target - arr[low])) / (arr[high] - arr[low])
      );

    if (arr[pos] === target) return pos;

    // Track if interpolation is probing far from midpoint (skewed data)
    if (Math.abs(pos - mid) > (high - low) * 0.5) {
      consecutiveBadProbes++;
    } else {
      consecutiveBadProbes = 0; // reset if probe looks healthy
    }

    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }

  // Fallback for when target is out of bounds or range is exhausted
  const slice = arr.slice(low, high + 1);
  const result = fibonacciSearch(slice, target);
  return result !== -1 ? low + result : -1;
}


/**
 * Exponential Search
 * @param {number[]} arr - sorted array
 * @param {number} target - value to search
 * @returns {number} index of target, or -1 if not found
 */
export function exponentialSearch(arr, target) {
  const n = arr.length;

  // If the first element is the target
  if (n === 0) return -1;
  if (arr[0] === target) return 0;

  // Find range for binary search by repeated doubling
  let bound = 1;
  while (bound < n && arr[bound] < target) {
    bound *= 2;
  }

  // Call binary search on the found range
  const left = Math.floor(bound / 2);
  const right = Math.min(bound, n - 1);
  return binarySearch(arr, target, left, right);
}
/**
 * Interpolation-Exponential Hybrid Search
 * @param {number[]} arr - sorted array
 * @param {number} target - value to search
 * @returns {number} index of target, or -1 if not found
 */
export function interpolationExponentialSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  let consecutiveBadProbes = 0;
  const BAD_PROBE_THRESHOLD = 3;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (arr[high] === arr[low]) {
      return arr[low] === target ? low : -1;
    }

    const mid = Math.floor((low + high) / 2);

    // True fallback: switch to exponential search if interpolation is probing poorly
    if (consecutiveBadProbes >= BAD_PROBE_THRESHOLD) {
      const slice = arr.slice(low, high + 1);
      const result = exponentialSearch(slice, target);
      return result !== -1 ? low + result : -1;
    }

    // Interpolation estimate
    const pos =
      low +
      Math.floor(
        ((high - low) * (target - arr[low])) / (arr[high] - arr[low])
      );

    if (arr[pos] === target) return pos;

    // Track if interpolation is probing far from midpoint (skewed data)
    if (Math.abs(pos - mid) > (high - low) * 0.5) {
      consecutiveBadProbes++;
    } else {
      consecutiveBadProbes = 0; // reset if probe looks healthy
    }

    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }

  // Fallback for when target is out of bounds or range is exhausted
  const slice = arr.slice(low, high + 1);
  const result = exponentialSearch(slice, target);
  return result !== -1 ? low + result : -1;
}