import OpenAI from "openai";
import { PatentAnalysis } from "@/types/analysis";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { patentId, companyName, products } = await req.json();

  const prompt = `You are a patent analysis expert. Your task is to analyze potential patent infringement and return ONLY a JSON response in the exact format shown below.

For patent ${patentId} by company ${companyName}, analyze these products: ${products.map((p: { name: string }) => p.name).join(", ")}

Required JSON format:
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
      "explanation": "detailed explanation",
      "specific_features": ["feature 1", "feature 2"]
    }
  ],
  "overall_risk_assessment": "detailed assessment"
}

IMPORTANT: Respond ONLY with the JSON object. Do not include any other text or explanations.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a JSON-only response bot. Always respond with valid JSON matching the requested format. Never include additional text or explanations."
        },
        {
          role: "user",
          content: prompt
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