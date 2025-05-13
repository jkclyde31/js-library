// import ImageKit from "imagekit";
// import config from "@/lib/config";
// import { NextResponse } from "next/server";

// const {
//   env: {
//     imagekit: { publicKey, privateKey, urlEndpoint },
//   },
// } = config;

// const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });

// export async function GET() {
//   return NextResponse.json(imagekit.getAuthenticationParameters());
// }

// File: app/api/imagekit-auth/route.ts
import ImageKit from "imagekit";
import { NextResponse } from "next/server";
import config from "@/lib/config";

const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

const imagekit = new ImageKit({ 
  publicKey, 
  privateKey, 
  urlEndpoint 
});

export async function GET() {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParams);
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json(
      { error: "Failed to generate authentication parameters" },
      { status: 500 }
    );
  }
}