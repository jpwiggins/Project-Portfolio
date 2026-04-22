import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR
});

export interface PolicyGenerationRequest {
  title: string;
  type: string;
  description: string;
  frameworks: string[];
  companyName?: string;
  industry?: string;
}

export interface GeneratedPolicy {
  title: string;
  content: string;
  sections: string[];
  complianceNotes: Record<string, string>;
}

export async function generatePolicy(request: PolicyGenerationRequest): Promise<GeneratedPolicy> {
  const frameworksText = request.frameworks.join(", ");
  
  const prompt = `You are a compliance expert. Generate a comprehensive ${request.type} policy document with the following requirements:

Title: ${request.title}
Description: ${request.description}
Compliance Frameworks: ${frameworksText}
${request.companyName ? `Company: ${request.companyName}` : ''}
${request.industry ? `Industry: ${request.industry}` : ''}

Please generate a detailed policy document that includes:
1. Executive summary
2. Scope and purpose
3. Definitions
4. Policy statements
5. Procedures and controls
6. Roles and responsibilities
7. Compliance requirements specific to ${frameworksText}
8. Review and update procedures
9. Enforcement and violations

Respond with JSON in this exact format:
{
  "title": "Policy Title",
  "content": "Full policy content with proper formatting and sections",
  "sections": ["Section 1", "Section 2", ...],
  "complianceNotes": {
    "gdpr": "GDPR-specific compliance notes if applicable",
    "soc2": "SOC 2-specific compliance notes if applicable",
    "ai-act": "EU AI Act-specific compliance notes if applicable"
  }
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional compliance consultant specializing in policy development for GDPR, SOC 2, and EU AI Act compliance. Generate comprehensive, legally sound policy documents."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      title: result.title || request.title,
      content: result.content || "Policy content could not be generated. Please try again.",
      sections: result.sections || [],
      complianceNotes: result.complianceNotes || {},
    };
  } catch (error) {
    console.error("Error generating policy:", error);
    throw new Error("Failed to generate policy with AI. Please check your OpenAI API key and try again.");
  }
}

export async function analyzeComplianceRisk(description: string, frameworks: string[]): Promise<{
  riskLevel: string;
  riskScore: number;
  recommendations: string[];
  frameworkSpecificRisks: Record<string, string>;
}> {
  const prompt = `Analyze the compliance risk for the following scenario:

Description: ${description}
Applicable Frameworks: ${frameworks.join(", ")}

Provide a risk analysis including:
1. Overall risk level (low, medium, high, critical)
2. Risk score (0-100)
3. Specific recommendations for risk mitigation
4. Framework-specific risk assessments

Respond with JSON in this exact format:
{
  "riskLevel": "low|medium|high|critical",
  "riskScore": number,
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "frameworkSpecificRisks": {
    "gdpr": "GDPR-specific risk assessment if applicable",
    "soc2": "SOC 2-specific risk assessment if applicable", 
    "ai-act": "EU AI Act-specific risk assessment if applicable"
  }
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a compliance risk assessment expert specializing in GDPR, SOC 2, and EU AI Act frameworks."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      riskLevel: result.riskLevel || "medium",
      riskScore: result.riskScore || 50,
      recommendations: result.recommendations || [],
      frameworkSpecificRisks: result.frameworkSpecificRisks || {},
    };
  } catch (error) {
    console.error("Error analyzing compliance risk:", error);
    throw new Error("Failed to analyze compliance risk. Please check your OpenAI API key and try again.");
  }
}
