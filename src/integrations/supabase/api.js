import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const queryClient = new QueryClient();

export const SupabaseProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('posts').select('*');
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useAddPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPost) => {
      const { data, error } = await supabase.from('posts').insert(newPost);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });
};

export const useReactions = (postId) => {
  return useQuery({
    queryKey: ['reactions', postId],
    queryFn: async () => {
      const { data, error } = await supabase.from('reactions').select('*').eq('post_id', postId);
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useAddReaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newReaction) => {
      const { data, error } = await supabase.from('reactions').insert(newReaction);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['reactions', variables.post_id]);
    },
  });
};