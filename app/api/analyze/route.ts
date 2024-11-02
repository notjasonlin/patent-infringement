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
          content: "You are a JSON-only response bot. Always respond with valid JSON matching the requested format. Never include additional text or explanations."
        },
        {
          role: "user",
          content: `Analyze potential patent infringement and return ONLY a JSON response.

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
      "relevant_claims": ["claim numbers"],
      "explanation": "detailed explanation of how this product might infringe",
      "specific_features": ["feature 1", "feature 2"]
    }
  ],
  "overall_risk_assessment": "detailed risk assessment"
}

IMPORTANT: 
1. List ONLY the top 2 most likely infringing products
2. Respond ONLY with the JSON object
3. Ensure all fields are present and properly formatted`
        }
      ],
      temperature: 0.7,
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