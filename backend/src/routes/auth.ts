import { Router } from "express";
import { z } from "zod";
import { supabase } from "../lib/supabase";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../lib/jwt";
const router = Router();

// Validation schema for registration
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Validation schema for login
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Validation schema for refresh token
const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// Registration Route
router.post("/register", async (req, res) => {
  console.log("🔵 Register endpoint hit");
  console.log("Request body:", req.body);

  try {
    // 1. Validate whether form of input matches the registerSchema
    console.log("Step 1: Validating input...");
    const validatedData = registerSchema.parse(req.body);
    console.log("✅ Validation passed");

    // 2/ Create user in Supabase Auth
    console.log("Step 2: Creating user in Supabase...");
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: validatedData.email,
        password: validatedData.password as string,
        email_confirm: true, // Skip email verification for MVP
      });

    if (authError) {
      console.log("❌ Auth error:", authError.message);
      return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
      console.log("❌ No user data returned");
      return res.status(400).json({ error: "Failed to create user" });
    }
    console.log("✅ User created:", authData.user.id);

    // 3. Create profile in database
    console.log("Step 3: Creating profile...");
    const { error: profileError } = await supabase
      .from("profiles") // Insert a row into the 'profiles' table in the database
      .insert({
        id: authData.user.id,
        email: validatedData.email,
      });

    if (profileError) {
      console.log("❌ Profile error:", profileError.message);
      // If profile creation fails, delete the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({ error: "Failed to create profile" });
    }
    console.log("✅ Profile created");

    // 4. Generate JWT tokens
    console.log("Step 4: Generating JWT tokens...");
    let accessToken: string;
    let refreshToken: string;

    try {
      accessToken = generateAccessToken({
        userId: authData.user.id,
        email: validatedData.email,
      });
      console.log("✅ Access token generated");

      refreshToken = generateRefreshToken({
        userId: authData.user.id,
        email: validatedData.email,
      });
      console.log("✅ Refresh token generated");
    } catch (tokenError) {
      console.log("❌ Token generation error:", tokenError);
      // Clean up user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({
        error: "Failed to generate tokens",
        details:
          tokenError instanceof Error
            ? tokenError.message
            : "JWT secrets may be missing",
      });
    }

    // 5. Return success response
    console.log("Step 5: Sending response...");
    const response = {
      message: "User registered successfully",
      accessToken,
      refreshToken,
      user: {
        id: authData.user.id,
        email: validatedData.email,
      },
    };
    console.log("✅ Response prepared, sending...");
    res.status(201).json(response);
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.log("❌ Catch block - Error:", error);
    if (error instanceof z.ZodError) {
      // Validation error
      console.log("Validation error details:", error.issues);
      return res.status(400).json({
        error: "Validation failed",
        details: error.issues,
      });
    }
    // Other errors
    console.log("Unknown error:", error);
    return res.status(500).json({
      error: "Registration failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    // 1. Validate input
    const validatedData = loginSchema.parse(req.body);

    // 2. Sign in with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

    if (authError || !authData.user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 3. Get user profile from database
    const { data: profile } = await supabase
      .from("profiles") // fetches user profile from profiles table
      .select("*") // get all columns
      .eq("id", authData.user.id) // where id matches
      .single(); // expect one result only

    // 4. Generate JWT tokens
    const accessToken = generateAccessToken({
      userId: authData.user.id,
      email: authData.user.email!, // ! tells TypeScript email exists
    });

    const refreshToken = generateRefreshToken({
      userId: authData.user.id,
      email: authData.user.email!, // ! tells TypeScript email exists
    });

    // 5. Return success response
    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: profile?.name || null,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation error
      return res.status(400).json({
        error: "Validation failed",
        details: error.issues,
      });
    }
    // Other errors
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    // 1.Validate input
    const validatedData = refreshSchema.parse(req.body);

    // 2. Verify refresh token
    const payload = verifyRefreshToken(validatedData.refreshToken);

    // 3. Generate new access token
    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
    });

    // 4. Return new access token
    res.json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.issues,
      });
    }
    // Token verification failed (invalid or expired)

    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

router.post("/logout", async (req, res) => {
  // For MVP: Just return success
  // Frontend will delete tokens from localStorage
  res.json({
    message: "Logged out successfully",
  });
});

export default router;
