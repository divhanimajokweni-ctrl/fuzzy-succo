import { APIKey } from '../types';

const SUPABASE_MANAGEMENT_URL = 'https://api.supabase.com/v1'; // Assuming this is the base URL

export async function getAPIKey(apiKeyId: string, accessToken: string): Promise<APIKey> {
  const response = await fetch(`${SUPABASE_MANAGEMENT_URL}/organizations/api_keys/${apiKeyId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch API key: ${response.statusText}`);
  }

  return response.json();
}
