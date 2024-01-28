import { IgApiClient } from 'instagram-private-api';

export async function getInstagramUserId(ig: IgApiClient, username: string) {
  try {
    const userId = await ig.user.getIdByUsername(username);
    return userId;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error retrieving Instagram user ID';

    throw new Error(errorMessage);
  }
}
