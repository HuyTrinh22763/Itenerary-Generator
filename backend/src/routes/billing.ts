import { Router, Request, Response } from "express";
import { z } from "zod";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { stripe } from "../lib/stripe";
import { supabase } from "../lib/supabase";
import { config } from "../config";
const router = Router();

const PLANS = {
  free: {
    name: "Free Plan",
    price: 0,
    features: ["3 itineraries/day"],
  },
  basic: {
    name: "Basic Plan",
    price: 999, // $9.99 (999 cents)
    features: ["10 itineraries/day for a month"],
  },
  premium: {
    name: "Premium Plan",
    price: 1999, // $19.99 (1999 cents)
    features: ["Unlimited itineraries", "Priority support"],
  },
};

// Validate incoming requests
const createCheckoutSchema = z.object({
  plan: z.enum(["free", "basic", "premium"]), // Only allows 'free', 'basic', 'premium'
});

// authenticateToken verifies the JWT token
router.post(
  "/create-checkout-session",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      // Step 1: Validate the request
      const validatedData = createCheckoutSchema.parse(req.body);

      // Step 2: Get the userID from the token
      const userId = req.user!.userId; // ! tells TypeScript that user exists

      // Step 3: Get the selected plan details
      const selectedPlan = PLANS[validatedData.plan];

      // Step 4: Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"], // Accept credit, debit card
        line_items: [
          // What the user is buying
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: selectedPlan.name,
                description: selectedPlan.features.join(", "),
              },
              unit_amount: selectedPlan.price,
              recurring: {
                interval: "month", // Monthly subscription
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription", // subscription, not one-time payment
        success_url: `${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }/cancel`,
        client_reference_id: userId, // Link this session to user
        metadata: {
          userId,
          plan: validatedData.plan,
        },
      });

      // Step 5: Return the session URL to frontend
      res.json({
        sessionId: session.id,
        url: session.url, // Frontend will redirect user to this URL
      });
    } catch (error) {
      // Handle errors
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.issues,
        });
      }
      console.error("Stripe error", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  }
);

// GET handler for webhook validation (Stripe checks if endpoint exists)
router.get("/webhook", (req: Request, res: Response) => {
  res.json({
    message: "Stripe webhook endpoint is active",
    methods: ["POST"],
  });
});

router.post("/webhook", async (req, res) => {
  // Get the signature from headers
  const signature = req.headers["stripe-signature"];
  const webhookSecret = config.stripe.webhookSecret;

  // Check if signature and secret exist
  if (!signature || !webhookSecret) {
    return res.status(400).json({ error: "Missing signature or secret" });
  }

  let event;

  try {
    // Verify webhook signature (security check)
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error: any) {
    console.error("Webhook signature verification failed", error.message);
    return res.status(400).json({ error: `Webhook Error: ${error.message}` });
  }

  // Handle different event types
  switch (event.type) {
    case "checkout.session.completed":
      // Payment succeeded!
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;

      if (userId && plan) {
        // Update user's subscription in database
        await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
            subscription_plan: plan,
            stripe_customer_id: session.customer as string,
          })
          .eq("id", userId);
        console.log(`Subscription activated for user ${userId}, plan: ${plan}`);
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Always return 200 to Stripe (acknowledge receipt)
  res.json({ received: true });
});

// Get user's subscription status
router.get("/me", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;

    // Get user's subscription from database
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("subscription_status, subscription_plan, stripe_customer_id")
      .eq("id", userId)
      .single();

    if (error) {
      return res.status(500).json({ error: "Failed to fetch subscription" });
    }

    res.json({
      subscriptionStatus: profile?.subscription_status || "free",
      plan: profile?.subscription_plan || null,
      customerId: profile?.stripe_customer_id || null,
    });
  } catch (error: any) {
    console.error("Error fetching subscription: ", error);
    res.status(500).json({ error: "Failed to fetch subscription status" });
  }
});
export default router;
