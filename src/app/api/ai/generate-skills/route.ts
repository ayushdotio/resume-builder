import { generateAiContent } from "@/lib/gemini";
import { generateSkills } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: generateSkills = await req.json();
    const { experienceLevel, jobTitle } = body;

    if (!experienceLevel || !jobTitle) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Bad request. Missing fields.",
        },
        { status: 400 },
      );
    }

    const prompt = `
You are an expert technical recruiter, ATS optimization specialist, and career consultant.

Generate a list of professional resume skills based on the following information:

Experience Level: ${experienceLevel}
Target Job Title: ${jobTitle}

Requirements:

Generate between 12 and 20 highly relevant skills.
Include a balanced mix of:
Technical skills
Tools and technologies
Frameworks and libraries
Industry-relevant competencies
Ensure all skills are commonly expected for the specified job title.
Adapt skill complexity according to the experience level:
Fresher: Focus on foundational technologies, tools, and core concepts.
Junior: Include practical development tools and intermediate technologies.
Mid-Level: Include advanced frameworks, architecture concepts, testing, and deployment tools.
Senior: Include leadership, system design, architecture, scalability, cloud technologies, and mentoring-related skills.
Prioritize ATS-friendly keywords commonly found in job descriptions.
Avoid duplicate skills.
Do not include explanations, descriptions, categories, numbering, or bullet points.
Do not generate skills unrelated to the target role.
Do not use markdown formatting.

Output Format:

Return ONLY a valid JSON array of strings.

Example:
[
"JavaScript",
"React.js",
"TypeScript",
"REST APIs",
"Git"
]

IMPORTANT:

Return only the JSON array.
No additional text.
No code blocks.
No explanations.
No headings.
`;

    const result = await generateAiContent(prompt);

    let skills = result;

    if (typeof result === "string") {
      try {
        skills = JSON.parse(skills);
      } catch (error) {
        throw new Error("Something went wrong while parsing the skills json object.");
      }
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Skills generated successfully.",
        data: {
          skills: skills,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Skills generation mein bhi gdbd ho gai.\n", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong.",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
