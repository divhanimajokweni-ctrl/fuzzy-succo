export interface APIKey {
  id: string;
  created_at: string; // RFC 3339 datetime string
  created_by: {
    id: string;
    type: string;
  };
  name: string;
  partial_key_hint: string;
  status: 'active' | 'inactive' | 'archived';
  type: 'api_key';
  workspace_id: string | null;
}
