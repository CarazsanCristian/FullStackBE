import { User } from "../entities/user";

export async function checkForDuplicatedUsers(username: string) {
  const unavailableUser: User | null = await User.getUserByUsername(username);

  if (unavailableUser) {
    throw new Error("Username already taken!");
  }
}
