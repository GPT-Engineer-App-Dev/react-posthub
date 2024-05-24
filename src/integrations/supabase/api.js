import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch all posts
const fetchPosts = async () => {
  const { data, error } = await supabase.from('posts').select('*');
  if (error) throw new Error(error.message);
  return data;
};

// Fetch all reactions for a post
const fetchReactions = async (postId) => {
  const { data, error } = await supabase.from('reactions').select('*').eq('post_id', postId);
  if (error) throw new Error(error.message);
  return data;
};

// Add a new post
const addPost = async (post) => {
  const { data, error } = await supabase.from('posts').insert(post);
  if (error) throw new Error(error.message);
  return data;
};

// Add a new reaction
const addReaction = async (reaction) => {
  const { data, error } = await supabase.from('reactions').insert(reaction);
  if (error) throw new Error(error.message);
  return data;
};

// Custom hooks
export const usePosts = () => {
  return useQuery(['posts'], fetchPosts);
};

export const useReactions = (postId) => {
  return useQuery(['reactions', postId], () => fetchReactions(postId));
};

export const useAddPost = () => {
  const queryClient = useQueryClient();
  return useMutation(addPost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    },
  });
};

export const useAddReaction = () => {
  const queryClient = useQueryClient();
  return useMutation(addReaction, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['reactions', variables.post_id]);
    },
  });
};