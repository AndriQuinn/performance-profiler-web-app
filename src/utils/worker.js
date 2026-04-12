// Gets the data
import { performBenchmark } from "./performBenchmark";
import { generateUniformData, generateNonUniformData } from "./generateData";

let dataset = {
  uniformArr: [],
  nonUniformArr: []
}

// Define worker job: Perform the benchmark
self.onmessage = (e) => {

  const { type, payload } = e.data
  
  switch(type) {
    case 'GENERATE':
      dataset = generateDataset(payload.size);
      self.postMessage({ type: 'GENERATED', dataset });
      break;

    case 'RUN_BENCHMARK':
      if (!dataset) return;
      const result = performBenchmark(payload.attempts, payload.hybridSearch, dataset);
      self.postMessage({ type: 'BENCHMARK_RESULT', result });
      break;
  }
}

const generateDataset = (size) => {
  let uniformArr = generateUniformData(size);
  let nonUniformArr = generateNonUniformData(size)

  return { uniformArr, nonUniformArr }
}