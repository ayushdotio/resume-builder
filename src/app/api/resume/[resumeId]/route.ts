import { getCurrentUser } from "@/lib/GetCurrentUser";
import { connectToDB } from "@/lib/mongodb";
import ResumeModel from "@/models/resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> },
) {
  try {
    await connectToDB();

    const userId = await getCurrentUser();

    if (!userId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { resumeId } = await params;

    const resume = await ResumeModel.findOne({ _id: resumeId, userId });

    if (!resume) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Resume not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume fetched successfully.",
        data: { resume },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in fetching resume.", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
