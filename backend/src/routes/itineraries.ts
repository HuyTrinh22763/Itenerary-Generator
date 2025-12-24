import { Router, Request, Response } from "express";
import { z } from "zod";
import { supabase } from "../lib/supabase";
import { authenticateToken, AuthRequest } from "../middleware/auth";
// Validation schema
const generateItinerarySchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  budget: z.enum(["low", "medium", "high"]).optional(),
  pace: z.enum(["relaxed", "moderate", "packed"]).optional(),
  interests: z.array(z.string()).optional(),
});

const router = Router();

// POST /itineraries/generate
router.post("/generate", authenticateToken, async (req: AuthRequest, res) => {
  try {
    // 1. Validate input
    const validatedData = generateItinerarySchema.parse(req.body);

    // 2. Get user ID from token
    // Use AuthRequest to handle the default Express Request type
    // ! tells TypeScript it exists
    const userId = req.user!.userId;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // 3. Save itinerary to database
    const { data: itinerary, error: dbError } = await supabase
      .from("itineraries")
      .insert({
        user_id: userId,
        destination: validatedData.destination,
        start_date: validatedData.startDate,
        end_date: validatedData.endDate,
        budget: validatedData.budget || "medium",
        pace: validatedData.pace || "moderate",
        interests: validatedData.interests || [],
        status: "draft",
      })
      .select()
      .single();

    if (dbError) {
      return res.status(500).json({ error: "Failed to save itinerary" });
    }

    // 4. Return responses
    res.status(201).json({
      id: itinerary.id,
      destination: itinerary.destination,
      startDate: itinerary.start_date,
      endDate: itinerary.end_date,
      budget: itinerary.budget,
      pace: itinerary.pace,
      interests: itinerary.interests,
      days: [],
      createdAt: itinerary.created_at,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation error
      res.status(400).json({
        error: "Invalid input",
        details: error.issues,
      });
    } else {
      res.status(500).json({
        error: "Failed to generate itinerary",
      });
    }
  }
});

// GET /itineraries/:id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // 1. Get itinerary from database
    const { data: itinerary, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    // 2. Return itinerary
    res.json({
      id: itinerary.id,
      destination: itinerary.destination,
      startDate: itinerary.start_date,
      endDate: itinerary.end_date,
      budget: itinerary.budget,
      pace: itinerary.pace,
      interests: itinerary.interests,
      days: [],
      createdAt: itinerary.created_at,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch itinerary" });
  }
});

export default router;
