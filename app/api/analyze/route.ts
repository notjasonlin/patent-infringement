import OpenAI from "openai";
import { PatentAnalysis } from "@/types/analysis";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { patentId, companyName, products } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a patent analysis expert providing balanced and objective analysis of potential patent infringement cases. 

You MUST analyze and return exactly 2 products that have the highest potential for infringement, even if the risk levels are low.

Risk Level Guidelines:
- High: Clear evidence of all patent claim elements being present in the product, with very similar implementation
- Moderate: Some overlapping elements exist, but with notable differences in implementation or missing secondary elements
- Low: Only superficial similarities or fundamentally different technical approaches

Always consider:
1. The specific technical differences in implementation
2. Missing claim elements
3. Alternative technical approaches
4. The doctrine of equivalents
5. Novel features not covered by the patent`
        },
        {
          role: "user",
          content: `Analyze potential patent infringement and provide a balanced technical assessment in JSON format.

For patent ${patentId} by company ${companyName}, analyze these products: ${JSON.stringify(products)}

IMPORTANT: You MUST return exactly 2 products with the highest potential for infringement, regardless of their risk level.

Your response must follow this exact format:
{
  "analysis_id": "${Date.now()}",
  "patent_id": "${patentId}",
  "company_name": "${companyName}",
  "analysis_date": "${new Date().toISOString().split('T')[0]}",
  "top_infringing_products": [
    {
      "product_name": "First product with highest potential overlap",
      "infringement_likelihood": "High|Moderate|Low",
      "relevant_claims": ["Specific claim numbers with detailed reasoning"],
      "explanation": "Provide a balanced 3-4 sentence technical analysis that discusses both similarities AND differences. Include specific technical implementations, missing elements, and alternative approaches. Focus on concrete technical details rather than general concepts.",
      "specific_features": [
        "List 4-5 specific technical features",
        "Include both potentially infringing elements",
        "AND features that differentiate from the patent",
        "Focus on technical implementation details"
      ]
    },
    {
      "product_name": "Second product with next highest potential overlap",
      "infringement_likelihood": "High|Moderate|Low",
      "relevant_claims": ["Specific claim numbers with detailed reasoning"],
      "explanation": "Same detailed analysis format as above, but for the second product.",
      "specific_features": [
        "List 4-5 specific technical features",
        "For this second product",
        "Following same format as above",
        "With product-specific details"
      ]
    }
  ],
  "overall_risk_assessment": "Provide a balanced 4-5 sentence analysis comparing both products and their relative risks. Discuss specific technical implementations, missing elements, and alternative approaches. Consider the strength of the patent claims and any potential workarounds or distinguishing features."
}

IMPORTANT ASSESSMENT GUIDELINES:
1. High Risk requires ALL of these:
   - Direct match of ALL independent claim elements
   - Very similar technical implementation
   - No clear alternative approaches or workarounds
   
2. Moderate Risk requires:
   - Match of SOME but not ALL claim elements
   - Similar general approach but different implementation details
   - Possible workarounds or alternative interpretations
   
3. Low Risk includes any of these:
   - Missing key claim elements
   - Fundamentally different technical approach
   - Clear alternative implementation
   - Novel features not covered by patent claims

YOU MUST ANALYZE AND RETURN EXACTLY 2 PRODUCTS, even if some products show minimal overlap.`
        }
      ],
      temperature: 0.5,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content;
    
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    try {
      const analysis: PatentAnalysis = JSON.parse(content);
      
      // Validate that exactly 2 products are returned
      if (!analysis.top_infringing_products || analysis.top_infringing_products.length !== 2) {
        throw new Error("Analysis must contain exactly 2 products");
      }
      
      return Response.json(analysis);
    } catch (parseError) {
      console.error('JSON Parse Error:', content);
      throw new Error(`Invalid JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }

  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json({ 
      error: "Failed to generate analysis",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500 
    });
  }
} 