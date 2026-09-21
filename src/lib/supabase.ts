import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SUPABASE_URL as string) : '') || '';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SUPABASE_ANON_KEY as string) : '') || '';

// Fallback in-memory/blob storage for preview environments before credentials are configured
const localBlobMap = new Map<string, string>();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('YOUR_SUPABASE')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({
      auth: {
        signInWithOAuth: async ({ provider }: { provider: string }) => {
          console.log(`[Supabase Auth] signInWithOAuth called with provider: ${provider}`);
          return { data: { provider, url: null }, error: null };
        },
        signInWithPassword: async (creds: any) => {
          return { data: { user: null, session: null }, error: null };
        },
        signUp: async (creds: any) => {
          return { data: { user: null, session: null }, error: null };
        },
        signOut: async () => {
          return { error: null };
        },
        getUser: async () => {
          return { data: { user: null }, error: null };
        },
        getSession: async () => {
          return { data: { session: null }, error: null };
        },
        onAuthStateChange: (callback: any) => ({
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        }),
      },
      storage: {
        from: (bucket: string) => ({
          upload: async (path: string, file: File | Blob) => {
            try {
              const localUrl = URL.createObjectURL(file);
              localBlobMap.set(`${bucket}:${path}`, localUrl);
              return { data: { path }, error: null };
            } catch (err: any) {
              return { data: null, error: err };
            }
          },
          getPublicUrl: (path: string) => {
            const cached = localBlobMap.get(`${bucket}:${path}`);
            return {
              data: {
                publicUrl: cached || '',
              },
            };
          },
        }),
      },
    } as any);
