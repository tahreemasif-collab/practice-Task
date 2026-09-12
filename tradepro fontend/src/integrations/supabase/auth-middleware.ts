import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";

export const requireSupabaseAuth = createMiddleware().server(async ({ next }) => {
  const request = getRequest();
  if (!request) {
    throw new Error("No request found");
  }

  // Check Authorization header or Cookie
  const authHeader = request.headers.get("Authorization");
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    // Check cookies
    const cookieHeader = request.headers.get("Cookie") || "";
    // Match sb-<project-id>-auth-token or sb-access-token
    const tokenMatch = cookieHeader.match(/sb-[a-zA-Z0-9-]+-auth-token=([^;]+)/);
    if (tokenMatch && tokenMatch[1]) {
      try {
        const parsed = JSON.parse(decodeURIComponent(tokenMatch[1]));
        token = parsed.access_token || "";
      } catch (e) {
        // Ignore
      }
    }
    if (!token) {
      const match = cookieHeader.match(/sb-access-token=([^;]+)/);
      if (match && match[1]) {
        token = decodeURIComponent(match[1]);
      }
    }
  }

  if (!token) {
    throw new Error("Unauthorized: Missing access token");
  }

  const supabaseUrl = process.env["SUPABASE_URL"] || import.meta.env["VITE_SUPABASE_URL"];
  const supabaseAnonKey =
    process.env["SUPABASE_PUBLISHABLE_KEY"] || import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables not configured");
  }

  // Create a supabase client authenticated on behalf of the user
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  // Fetch user information to verify the token is valid
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) {
    throw new Error("Unauthorized: Invalid access token");
  }

  return next({
    context: {
      supabase,
      userId: user.id,
    },
  });
});
