import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-17f1693e/health", (c) => {
  return c.json({ status: "ok" });
});

// Admin credentials - hardcoded
const ADMIN_CREDENTIALS = {
  username: "Thabet",
  password: "Thabet@123"
};

// Simple auth middleware
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // strip out bearer prefix and trim any accidental whitespace
  const token = authHeader.split(" ")[1]?.trim();
  
  // Verify token
  const session = await kv.get(`session:${token}`);
  if (!session || session.username !== ADMIN_CREDENTIALS.username) {
    return c.json({ error: "Invalid session" }, 401);
  }

  c.set("username", session.username);
  await next();
};

// Auth routes
app.post("/make-server-17f1693e/auth/login", async (c) => {
  try {
    const body = await c.req.json();
    // guard against missing fields
    const username = (body?.username || "").toString().trim();
    const password = (body?.password || "").toString();

    // perform case-insensitive check on username and trim
    if (
      username.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const token = crypto.randomUUID();
      await kv.set(`session:${token}`, { username, loginTime: new Date().toISOString() });
      return c.json({
        success: true,
        token,
        user: { username }
      });
    }

    return c.json({ error: "Invalid credentials" }, 401);
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Login failed" }, 500);
  }
});

app.post("/make-server-17f1693e/auth/verify", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ valid: false }, 401);
    }

    const token = authHeader.split(" ")[1];
    const session = await kv.get(`session:${token}`);
    
    if (!session) {
      return c.json({ valid: false }, 401);
    }
    
    return c.json({ valid: true, user: { username: session.username } });
  } catch (error) {
    return c.json({ valid: false }, 401);
  }
});

app.post("/make-server-17f1693e/auth/logout", requireAuth, async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const token = authHeader!.split(" ")[1];
    await kv.del(`session:${token}`);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: "Logout failed" }, 500);
  }
});

// Destinations routes
app.get("/make-server-17f1693e/destinations", async (c) => {
  try {
    const destinations = await kv.getByPrefix("destination:");
    return c.json(destinations || []);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return c.json({ error: "Failed to fetch destinations" }, 500);
  }
});

app.get("/make-server-17f1693e/destinations/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const destination = await kv.get(`destination:${id}`);
    
    if (!destination) {
      return c.json({ error: "Destination not found" }, 404);
    }
    
    return c.json(destination);
  } catch (error) {
    console.error("Error fetching destination:", error);
    return c.json({ error: "Failed to fetch destination" }, 500);
  }
});

app.put("/make-server-17f1693e/destinations/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param("id");
    const data = await c.req.json();
    
    await kv.set(`destination:${id}`, { ...data, id });
    
    return c.json({ success: true, destination: { ...data, id } });
  } catch (error) {
    console.error("Error updating destination:", error);
    return c.json({ error: "Failed to update destination" }, 500);
  }
});

app.post("/make-server-17f1693e/destinations", requireAuth, async (c) => {
  try {
    const data = await c.req.json();
    const id = data.id || crypto.randomUUID();
    
    await kv.set(`destination:${id}`, { ...data, id });
    
    return c.json({ success: true, destination: { ...data, id } });
  } catch (error) {
    console.error("Error creating destination:", error);
    return c.json({ error: "Failed to create destination" }, 500);
  }
});

app.delete("/make-server-17f1693e/destinations/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`destination:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return c.json({ error: "Failed to delete destination" }, 500);
  }
});

// Visas routes
app.get("/make-server-17f1693e/visas", async (c) => {
  try {
    const visas = await kv.getByPrefix("visa:");
    return c.json(visas || []);
  } catch (error) {
    console.error("Error fetching visas:", error);
    return c.json({ error: "Failed to fetch visas" }, 500);
  }
});

app.get("/make-server-17f1693e/visas/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const visa = await kv.get(`visa:${id}`);
    
    if (!visa) {
      return c.json({ error: "Visa not found" }, 404);
    }
    
    return c.json(visa);
  } catch (error) {
    console.error("Error fetching visa:", error);
    return c.json({ error: "Failed to fetch visa" }, 500);
  }
});

app.put("/make-server-17f1693e/visas/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param("id");
    const data = await c.req.json();
    
    await kv.set(`visa:${id}`, { ...data, id });
    
    return c.json({ success: true, visa: { ...data, id } });
  } catch (error) {
    console.error("Error updating visa:", error);
    return c.json({ error: "Failed to update visa" }, 500);
  }
});

app.post("/make-server-17f1693e/visas", requireAuth, async (c) => {
  try {
    const data = await c.req.json();
    const id = data.id || crypto.randomUUID();
    
    await kv.set(`visa:${id}`, { ...data, id });
    
    return c.json({ success: true, visa: { ...data, id } });
  } catch (error) {
    console.error("Error creating visa:", error);
    return c.json({ error: "Failed to create visa" }, 500);
  }
});

app.delete("/make-server-17f1693e/visas/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`visa:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting visa:", error);
    return c.json({ error: "Failed to delete visa" }, 500);
  }
});

// Contact messages routes
app.post("/make-server-17f1693e/messages", async (c) => {
  try {
    const data = await c.req.json();
    const id = crypto.randomUUID();
    
    await kv.set(`message:${id}`, { 
      ...data, 
      id, 
      createdAt: new Date().toISOString() 
    });
    
    return c.json({ success: true, message: { ...data, id } });
  } catch (error) {
    console.error("Error saving message:", error);
    return c.json({ error: "Failed to save message" }, 500);
  }
});

app.get("/make-server-17f1693e/messages", requireAuth, async (c) => {
  try {
    const messages = await kv.getByPrefix("message:");
    return c.json(messages || []);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return c.json({ error: "Failed to fetch messages" }, 500);
  }
});

// Bookings routes
app.post("/make-server-17f1693e/bookings", async (c) => {
  try {
    const data = await c.req.json();
    const id = crypto.randomUUID();
    
    await kv.set(`booking:${id}`, { 
      ...data, 
      id, 
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
    
    return c.json({ success: true, booking: { ...data, id } });
  } catch (error) {
    console.error("Error saving booking:", error);
    return c.json({ error: "Failed to save booking" }, 500);
  }
});

app.get("/make-server-17f1693e/bookings", requireAuth, async (c) => {
  try {
    const bookings = await kv.getByPrefix("booking:");
    return c.json(bookings || []);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return c.json({ error: "Failed to fetch bookings" }, 500);
  }
});

// Initialize data on startup
async function initializeData() {
  console.log("Initializing default data...");
  
  // Check if data already exists
  const existingDestinations = await kv.getByPrefix("destination:");
  if (existingDestinations && existingDestinations.length > 0) {
    console.log("Data already initialized");
    return;
  }
  
  // Initialize default destinations
  const destinations = [
    {
      id: '1',
      name: 'Paris',
      country: 'France',
      image: 'https://images.unsplash.com/photo-1642947392578-b37fbd9a4d45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlaWZmZWwlMjB0b3dlciUyMHBhcmlzJTIwZnJhbmNlfGVufDF8fHx8MTc3MjY2Mzk1OXww&ixlib=rb-4.1.0&q=80&w=1080',
      price: 1299,
      duration: '7 Days',
      description: 'Experience the romantic city of lights with iconic landmarks, world-class cuisine, and timeless art.',
      featured: true
    },
    {
      id: '2',
      name: 'Maldives',
      country: 'Maldives',
      image: 'https://images.unsplash.com/photo-1699019493395-8a1f0c7883a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHRyb3BpY2FsJTIwYmVhY2glMjByZXNvcnR8ZW58MXx8fHwxNzcyNTg3MTMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 2499,
      duration: '5 Days',
      description: 'Luxury island paradise with crystal-clear waters, pristine beaches, and overwater villas.',
      featured: true
    },
    {
      id: '3',
      name: 'Dubai',
      country: 'UAE',
      image: 'https://images.unsplash.com/photo-1651063820152-d3e7a27b4d2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMGJ1cmolMjBraGFsaWZhJTIwc2t5bGluZXxlbnwxfHx8fDE3NzI2MDEwODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      price: 1899,
      duration: '6 Days',
      description: 'Modern metropolis blending luxury shopping, ultramodern architecture, and desert adventures.',
      featured: true
    }
  ];
  
  for (const dest of destinations) {
    await kv.set(`destination:${dest.id}`, dest);
  }
  
  // Initialize default visas
  const visas = [
    {
      id: '1',
      country: 'France (Schengen)',
      processingTime: '10-15 business days',
      validityPeriod: '90 days within 180 days',
      entryType: 'Multiple Entry',
      price: 80,
      applicationFee: 80,
      requirements: [
        'Valid passport (min. 6 months validity)',
        'Completed visa application form',
        'Two recent passport-size photographs',
        'Travel insurance (min. €30,000 coverage)',
        'Proof of accommodation',
        'Flight itinerary',
        'Bank statements (last 3 months)',
        'Employment letter or business registration'
      ],
      description: 'Schengen visa allowing travel to 27 European countries'
    },
    {
      id: '2',
      country: 'UAE',
      processingTime: '3-5 business days',
      validityPeriod: '60 days',
      entryType: 'Single/Multiple Entry',
      price: 250,
      applicationFee: 250,
      requirements: [
        'Valid passport (min. 6 months validity)',
        'Passport-size photograph',
        'Confirmed hotel booking',
        'Return flight ticket',
        'Financial proof'
      ],
      description: 'Tourist visa for United Arab Emirates'
    },
    {
      id: '3',
      country: 'Japan',
      processingTime: '5-7 business days',
      validityPeriod: '90 days',
      entryType: 'Single Entry',
      price: 35,
      applicationFee: 35,
      requirements: [
        'Valid passport',
        'Completed application form',
        'Passport photograph',
        'Travel itinerary',
        'Hotel reservations',
        'Financial documents',
        'Employment certificate'
      ],
      description: 'Tourist visa for Japan'
    },
    {
      id: '4',
      country: 'USA',
      processingTime: '3-5 weeks',
      validityPeriod: 'Up to 10 years',
      entryType: 'Multiple Entry',
      price: 185,
      applicationFee: 185,
      requirements: [
        'Valid passport',
        'DS-160 confirmation',
        'Visa interview appointment',
        'Passport photograph',
        'Supporting documents',
        'Interview fee payment receipt'
      ],
      description: 'B1/B2 Tourist/Business visa for United States'
    },
    {
      id: '5',
      country: 'Maldives',
      processingTime: 'On Arrival',
      validityPeriod: '30 days',
      entryType: 'Single Entry',
      price: 0,
      applicationFee: 0,
      requirements: [
        'Valid passport (min. 6 months)',
        'Return flight ticket',
        'Hotel confirmation',
        'Sufficient funds proof'
      ],
      description: 'Free visa on arrival for tourists'
    },
    {
      id: '6',
      country: 'Greece (Schengen)',
      processingTime: '10-15 business days',
      validityPeriod: '90 days within 180 days',
      entryType: 'Multiple Entry',
      price: 80,
      applicationFee: 80,
      requirements: [
        'Valid passport (min. 6 months validity)',
        'Visa application form',
        'Passport photographs',
        'Travel insurance',
        'Accommodation proof',
        'Flight reservations',
        'Financial proof'
      ],
      description: 'Schengen visa for Greece and EU countries'
    },
    {
      id: '7',
      country: 'Indonesia (Bali)',
      processingTime: 'On Arrival',
      validityPeriod: '30 days',
      entryType: 'Single Entry',
      price: 35,
      applicationFee: 35,
      requirements: [
        'Valid passport (min. 6 months)',
        'Return ticket',
        'Proof of accommodation',
        'Payment for visa on arrival'
      ],
      description: 'Visa on arrival for Indonesia'
    },
    {
      id: '8',
      country: 'Switzerland (Schengen)',
      processingTime: '10-15 business days',
      validityPeriod: '90 days within 180 days',
      entryType: 'Multiple Entry',
      price: 80,
      applicationFee: 80,
      requirements: [
        'Valid passport',
        'Application form',
        'Photographs',
        'Travel insurance',
        'Hotel bookings',
        'Flight itinerary',
        'Bank statements'
      ],
      description: 'Schengen visa for Switzerland'
    },
    {
      id: '9',
      country: 'Iceland (Schengen)',
      processingTime: '10-15 business days',
      validityPeriod: '90 days within 180 days',
      entryType: 'Multiple Entry',
      price: 80,
      applicationFee: 80,
      requirements: [
        'Valid passport',
        'Completed application',
        'Photos',
        'Travel insurance',
        'Accommodation proof',
        'Financial documents'
      ],
      description: 'Schengen visa for Iceland'
    },
    {
      id: '10',
      country: 'Spain (Schengen)',
      processingTime: '10-15 business days',
      validityPeriod: '90 days within 180 days',
      entryType: 'Multiple Entry',
      price: 80,
      applicationFee: 80,
      requirements: [
        'Valid passport',
        'Application form',
        'Photographs',
        'Travel insurance',
        'Proof of accommodation',
        'Financial means'
      ],
      description: 'Schengen visa for Spain'
    },
    {
      id: '11',
      country: 'Thailand',
      processingTime: 'On Arrival / E-Visa',
      validityPeriod: '30-60 days',
      entryType: 'Single Entry',
      price: 40,
      applicationFee: 40,
      requirements: [
        'Valid passport (min. 6 months)',
        'Return flight ticket',
        'Accommodation proof',
        'Financial proof'
      ],
      description: 'Tourist visa for Thailand'
    },
    {
      id: '12',
      country: 'Italy (Schengen)',
      processingTime: '10-15 business days',
      validityPeriod: '90 days within 180 days',
      entryType: 'Multiple Entry',
      price: 80,
      applicationFee: 80,
      requirements: [
        'Valid passport',
        'Visa application',
        'Photographs',
        'Travel insurance',
        'Hotel reservations',
        'Flight bookings',
        'Bank statements'
      ],
      description: 'Schengen visa for Italy'
    }
  ];
  
  for (const visa of visas) {
    await kv.set(`visa:${visa.id}`, visa);
  }
  
  console.log("Default data initialized successfully");
}

// Initialize data when server starts
initializeData().catch(console.error);

Deno.serve(app.fetch);