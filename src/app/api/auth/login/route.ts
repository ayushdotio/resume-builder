import { generateToken } from "@/lib/jwt";
import { connectToDB } from "@/lib/mongodb";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/api.types";
import { LoginBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body: LoginBody = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Bad Request.All fields are required.",
        },
        { status: 400 },
      );
    }

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found. Try register.",
        },
        { status: 404 },
      );
    }

    // CHECK PASSWORD
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Unauthorized. Password is incorrect.",
        },
        { status: 401 },
      );
    }

    const token = generateToken({ id: String(user._id) });

    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Login successful.",
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
        },
      },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 3,
    });

    return response;
  } catch (error) {
    console.log("Bhai tu bhulja login krna abb!!!\n", error);
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
