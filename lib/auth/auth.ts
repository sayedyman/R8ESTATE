// Mock Authentication Layer
// In a real application, this would interface with Supabase, Clerk, or your backend.
import { LoginFormData, SignupFormData } from "@/schemas/auth.schema";
import { User } from "@/types/auth";

const MOCK_DELAY_MS = 1500;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(data: LoginFormData): Promise<{ user?: User; error?: string }> {
  await wait(MOCK_DELAY_MS);
  
  // Mock Validation
  if (data.email === "error@example.com") {
    return { error: "Network Error: Unable to reach authentication server." };
  }
  if (data.email === "invalid@example.com") {
    return { error: "Invalid Email or Wrong Password." };
  }

  return {
    user: {
      id: "mock-id-123",
      name: "Demo User",
      email: data.email,
      role: "agent",
      trustScore: 0,
      isVerified: false,
      createdAt: new Date(),
    }
  };
}

export async function signup(data: SignupFormData): Promise<{ user?: User; error?: string }> {
  await wait(MOCK_DELAY_MS);
  
  if (data.email === "taken@example.com") {
    return { error: "Email Already Exists. Please sign in instead." };
  }

  return {
    user: {
      id: "mock-id-new",
      name: data.fullName,
      email: data.email,
      role: "agent",
      trustScore: 0,
      isVerified: false,
      createdAt: new Date(),
    }
  };
}
