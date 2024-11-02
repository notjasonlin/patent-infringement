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
          content: "You are a patent analysis expert providing detailed technical analysis of potential patent infringement cases. Focus on specific technical comparisons and detailed explanations."
        },
        {
          role: "user",
          content: `Analyze potential patent infringement and return a detailed JSON response.

For patent ${patentId} by company ${companyName}, analyze these products: ${JSON.stringify(products)}

Your response must follow this exact format:
{
  "analysis_id": "${Date.now()}",
  "patent_id": "${patentId}",
  "company_name": "${companyName}",
  "analysis_date": "${new Date().toISOString().split('T')[0]}",
  "top_infringing_products": [
    {
      "product_name": "product name",
      "infringement_likelihood": "High|Moderate|Low",
      "relevant_claims": ["Detailed list of specific claim numbers that may be infringed"],
      "explanation": "Provide a detailed 3-4 sentence technical explanation of how this product might infringe, including specific features and functionalities that overlap with the patent claims. Include technical terminology and specific examples.",
      "specific_features": ["List at least 4-5 specific technical features or components that could infringe"]
    }
  ],
  "overall_risk_assessment": "Provide a comprehensive 4-5 sentence analysis of the overall infringement risk. Include technical details, potential mitigating factors, and specific areas of concern. Consider both direct and indirect infringement possibilities."
}

IMPORTANT: 
1. List the top 2 most likely infringing products with detailed technical analysis
2. Focus on specific technical features and claim elements rather than general similarities
3. Use proper technical terminology relevant to the patent's field
4. Include specific claim numbers and explain how they relate to product features
5. Provide detailed explanations with concrete examples
6. Consider both literal infringement and doctrine of equivalents
7. Maintain strict JSON format
8. Ensure explanations are at least 3-4 sentences long with technical detail`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000, // Increased token limit for more detailed responses
    });

    const content = completion.choices[0].message.content;
    
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    try {
      const analysis: PatentAnalysis = JSON.parse(content);
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