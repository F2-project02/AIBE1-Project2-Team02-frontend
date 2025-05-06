// src/lib/getUserProfile.js
import { dummyMentors } from "../constants/mock/dummyMentors";

export async function getUserProfile(userId) {
  const mentor = dummyMentors.find((m) => m.userId === userId);
  if (!mentor) return null;

  return {
    ...mentor,
    isMentor: true,
  };
}
