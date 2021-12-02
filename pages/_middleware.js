import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const middlweware = async (req) => {
    // Token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  // Allow the request to continue if the user is logged in
  // 1) Its a request for next-auth session & provides fethcing
  // 2) the token is exists

  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }


    // If the user is not logged in, redirect to the login page
  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}

export default middlweware;  