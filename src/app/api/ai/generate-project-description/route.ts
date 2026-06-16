import { generateAiContent } from "@/lib/gemini";
import { generateProjectDescription } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: generateProjectDescription = await req.json();
    const { projectTitle, experienceLevel, jobTitle, mvp, techStack } = body;

    if (!experienceLevel || !jobTitle || !mvp || !techStack) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Bad request. Missing fields.",
        },
        { status: 400 },
      );
    }

    const prompt = `
You are an expert resume writer, ATS optimization specialist, software engineering mentor, and technical recruiter.

Generate a professional resume project description based on the following information:

Project Title: ${(projectTitle) ? `${projectTitle}` : "Not Provided"}
Project MVP / Features: ${mvp}
Tech Stack: ${techStack.join(", ")}
Experience Level: ${experienceLevel}
Target Job Title: ${jobTitle}

Requirements:

1. Generate a professional project description suitable for a resume.
2. Length should be between 80 and 150 words.
3. Clearly describe:

   * The project's purpose
   * Core features and functionality
   * Technical implementation
   * Technologies used
   * The value or impact of the project
4. Naturally incorporate ATS-friendly keywords relevant to the target job title.
5. Highlight technical skills demonstrated through the project.
6. Emphasize problem-solving, development, scalability, performance, user experience, or business value where appropriate.
7. Adapt the tone and complexity according to the experience level:

   * Fresher: Focus on learning, implementation, and technical skills.
   * Junior: Focus on practical application and feature development.
   * Mid-Level: Focus on architecture, optimization, and maintainability.
   * Senior: Focus on scalability, system design, performance, and leadership aspects.
8. Use strong action-oriented language.
9. Do not invent features that are not reasonably implied by the MVP description.
10. Do not mention experience level, ATS, recruiter, or resume.
11. Do not use first-person pronouns such as "I", "me", "my", or "we".
12. Avoid generic phrases such as:

    * "This project demonstrates"
    * "I learned"
    * "Hardworking developer"
    * "Team player"
13. Ensure the description sounds like a real project completed by a professional developer.

Output Rules:

Return ONLY the project description paragraph text.

Do NOT return:

* Headings
* Labels
* Bullet points
* Markdown
* JSON
* Quotes
* Explanations
* Additional text before or after the description

Generate the project description now.

`;

    const result = await generateAiContent(prompt);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Project description generated successfully.",
        data: {
          description: result,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Project description generation mein bhi gdbd ho gai.\n", error);
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
