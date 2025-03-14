
export type ProfileResponse = {
  username: string;
  bio?: string;
  image?: string;
  following: boolean;
};

export function isProfileResponse(data: unknown): data is ProfileResponse {
  if (typeof data !== "object" || data === null) return false;

  const profile = data as Record<string, unknown>;

  return (
    typeof profile.username === "string" &&
    (profile.bio === undefined || typeof profile.bio === "string") &&
    (profile.image === undefined || typeof profile.image === "string") &&
    typeof profile.following === "boolean"
  );
}
