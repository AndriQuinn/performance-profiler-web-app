import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, "1 m"), // 3 requests per minute per IP
})

export default async function callGemini(req, res) {

    // Check First Request
    if (req.method === "OPTIONS") return res.status(200).end()

    // --- Rate Limiter --- 
    try {
        const ip = req.headers["x-forwarded-for"] || "anonymous"
        const { success } = await ratelimit.limit(ip)
        if (!success) {
            return res.status(429).json({ error: "Too many requests, slow down!" })
        }
    } catch (err) {
        // if Upstash is down, let requests through so app doesn't break
        console.error("Rate limiter error:", err)
    }


    // --- Data ---
    const { benchmarkData } = req.body

    // Fallback chain
    const MODELS = [
        "gemini-3.1-flash-lite-preview", 
        "gemini-2.5-flash-lite",      
        "gemini-3-flash-preview",     
        "gemini-2.5-flash"
    ]

    for (let i = 0; i <  MODELS.length; i++) {

        // Call Gemini Models
        try {
            
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${MODELS[i]}:generateContent?key=${process.env.GEMINI_API_KEY}`,
                {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `
                            You are a senior computer science performance analyst specializing in benchmarking.
                            Note that the benchmark data in execution time is measured in nanoseconds and 
                            megabyte in memory usage.

                            You MUST use the function \`benchmark_analysis\` to return the result.
                            Do NOT write normal text.
                            Do NOT output JSON manually.
                        
                            Rules:
                            - 150–200 words per field
                            - be diraect, natural, easy to understand, no markdown
                            - no extra text outside JSON
                            Benchmark data:
                            ${JSON.stringify(benchmarkData)}
                        `
                        }]
                    }],
                    tools: [{
                        functionDeclarations: [{
                            name: "benchmark_analysis",
                            description: "Analyze interpolation algorithm benchmark results",
                            parameters: {
                                type: "object",
                                properties: {
                                overallAnalysis: { type: "string" },
                                uniformExecutionTime: { type: "string" },
                                nonUniformExecutionTime: { type: "string" },
                                uniformMemoryUsage: { type: "string" },
                                nonUniformMemoryUsage: { type: "string" }
                                },
                                required: [
                                "overallAnalysis",
                                "uniformExecutionTime",
                                "nonUniformExecutionTime",
                                "uniformMemoryUsage",
                                "nonUniformMemoryUsage"
                                ]
                            }
                        }]
                    }],
                    tool_config: {
                        function_calling_config: {
                            mode: "ANY",
                            allowed_function_names: ["benchmark_analysis"]
                        }
                    }
                })
                }
        )

        if (response.status == 401 ) return res.status(401).json({ error: "Invalid API key" });
        if (!response.ok) continue;
        
        const data = await response.json()
        return res.status(response.status).json({ 
            ok: true,
            interpretation: data 
        })

        } catch (err) {
            continue
        }
    }

    return res.status(response.status).json({
        error: "All Gemini models are unavailabe, PLease try again later.",
    })
}
