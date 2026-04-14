/**
 * Interpolation Search
 * @param {number[]} arr - sorted array
 * @param {number} target - value to search
 * @returns {number} index of target, or -1 if not found
 */
export function interpolationSearch(arr, target, col = 0) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high && target >= arr[low][col] && target <= arr[high][col]) {
    if (low === high) {
      return arr[low][col] === target ? low : -1;
    }

    // Estimate position
    const pos =
      low +
      Math.floor(
        ((high - low) * (target - arr[low][col])) / (arr[high][col] - arr[low][col])
      );

    if (arr[pos][col] === target) return pos;
    if (arr[pos][col] < target) low = pos + 1;
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
export function binarySearch(arr, target, left = 0, right = arr.length - 1, col = 0) {
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid][col] === target) return mid;
    else if (arr[mid][col] < target) left = mid + 1;
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
export function interpolationBinarySearch(arr, target, col = 0) {
  // Edge case handling
  if (!arr || arr.length === 0) return -1;
  if (arr.length === 1) return arr[0] === target ? 0 : -1;

  let low = 0;
  let high = arr.length - 1;
  let consecutiveBadProbes = 0;
  const BAD_PROBE_THRESHOLD = 3;

  while (low <= high && target >= arr[low][col] && target <= arr[high][col]) {
    if (arr[high][col] === arr[low][col]) {
      return arr[low][col] === target ? low : -1;
    }

    const mid = Math.floor((low + high) / 2);

    if (consecutiveBadProbes >= BAD_PROBE_THRESHOLD) {
      return binarySearch(arr, target, low, high); // ✅ no slice, pass bounds directly
    }

    const pos =
      low +
      Math.floor(
        ((high - low) * (target - arr[low][col])) / (arr[high][col] - arr[low][col])
      );

    // Edge case: pos out of bounds
    if (pos < low || pos > high) return -1;

    if (arr[pos][col] === target) return pos;

    if (Math.abs(pos - mid) > (high - low) * 0.5) {
      consecutiveBadProbes++;
    } else {
      consecutiveBadProbes = 0;
    }

    if (arr[pos][col] < target) low = pos + 1;
    else high = pos - 1;
  }

  return binarySearch(arr, target, low, high); // ✅ no slice
}

/**
 * Fibonacci Search
 * @param {number[]} arr - sorted array
 * @param {number} target - value to search
 * @returns {number} index of target, or -1 if not found
 */
export function fibonacciSearch(arr, target, start = 0, end = arr.length - 1, col = 0) {
  const n = end - start + 1;
  let fibMMm2 = 0;
  let fibMMm1 = 1;
  let fibM = fibMMm2 + fibMMm1;

  while (fibM < n) {
    fibMMm2 = fibMMm1;
    fibMMm1 = fibM;
    fibM = fibMMm2 + fibMMm1;
  }

  let offset = start - 1;

  while (fibM > 1) {
    const i = Math.min(offset + fibMMm2, end);

    if (arr[i][col] < target) {
      fibM = fibMMm1;
      fibMMm1 = fibMMm2;
      fibMMm2 = fibM - fibMMm1;
      offset = i;
    } else if (arr[i][col] > target) {
      fibM = fibMMm2;
      fibMMm2 = fibMMm1 - fibMMm2;
      fibMMm1 = fibM - fibMMm2;
    } else {
      return i;
    }
  }

  if (fibMMm1 && offset + 1 <= end && arr[offset + 1][col] === target) {
    return offset + 1;
  }

  return -1;
}

/**
 * Interpolation-Fibonacci Hybrid Search
 * @param {number[]} arr - sorted array
 * @param {number} target - value to search
 * @returns {number} index of target, or -1 if not found
 */
export function interpolationFibonacciSearch(arr, target, col = 0) {
  // Edge case handling
  if (!arr || arr.length === 0) return -1;
  if (arr.length === 1) return arr[0][col] === target ? 0 : -1;

  let low = 0;
  let high = arr.length - 1;
  let consecutiveBadProbes = 0;
  const BAD_PROBE_THRESHOLD = 3;

  while (low <= high && target >= arr[low][col] && target <= arr[high][col]) {
    if (arr[high][col] === arr[low][col]) {
      return arr[low][col] === target ? low : -1;
    }

    const mid = Math.floor((low + high) / 2);

    if (consecutiveBadProbes >= BAD_PROBE_THRESHOLD) {
      return fibonacciSearch(arr, target, low, high); // ✅ no slice, pass bounds directly
    }

    const pos =
      low +
      Math.floor(
        ((high - low) * (target - arr[low][col])) / (arr[high][col] - arr[low][col])
      );

    // Edge case: pos out of bounds
    if (pos < low || pos > high) return -1;

    if (arr[pos][col] === target) return pos;

    if (Math.abs(pos - mid) > (high - low) * 0.5) {
      consecutiveBadProbes++;
    } else {
      consecutiveBadProbes = 0;
    }

    if (arr[pos][col] < target) low = pos + 1;
    else high = pos - 1;
  }

  return fibonacciSearch(arr, target, low, high); // ✅ no slice
}


/**
 * Exponential Search
 * @param {number[]} arr - sorted array
 * @param {number} target - value to search
 * @returns {number} index of target, or -1 if not found
 */
export function exponentialSearch(arr, target, start = 0, end = arr.length - 1, col = 0) {
  if (!arr || arr.length === 0) return -1;
  
  if (arr[start][col] === target) return start;

  let bound = 1;
  while (start + bound <= end && arr[start + bound][col] < target) {
    bound *= 2;
  }

  const left = start + Math.floor(bound / 2);
  const right = Math.min(start + bound, end);
  return binarySearch(arr, target, left, right); // ✅ no slice needed
}
/**
 * Interpolation-Exponential Hybrid Search
 * @param {number[]} arr - sorted array
 * @param {number} target - value to search
 * @returns {number} index of target, or -1 if not found
 */
export function interpolationExponentialSearch(arr, target,col = 0) {
  // Edge case handling
  if (!arr || arr.length === 0) return -1;
  if (arr.length === 1) return arr[0][col] === target ? 0 : -1;

  let low = 0;
  let high = arr.length - 1;
  let consecutiveBadProbes = 0;
  const BAD_PROBE_THRESHOLD = 3;

  while (low <= high && target >= arr[low][col] && target <= arr[high][col]) {
    if (arr[high][col] === arr[low][col]) {
      return arr[low][col] === target ? low : -1;
    }

    const mid = Math.floor((low + high) / 2);

    if (consecutiveBadProbes >= BAD_PROBE_THRESHOLD) {
      return exponentialSearch(arr, target, low, high); // ✅ no slice, pass bounds directly
    }

    const pos =
      low +
      Math.floor(
        ((high - low) * (target - arr[low][col])) / (arr[high][col] - arr[low][col])
      );

    // Edge case: pos out of bounds
    if (pos < low || pos > high) return -1;

    if (arr[pos][col] === target) return pos;

    if (Math.abs(pos - mid) > (high - low) * 0.5) {
      consecutiveBadProbes++;
    } else {
      consecutiveBadProbes = 0;
    }

    if (arr[pos][col] < target) low = pos + 1;
    else high = pos - 1;
  }

  return exponentialSearch(arr, target, low, high); // ✅ no slice
}