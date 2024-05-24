import { Container, Text, VStack, Box, Input, Button, HStack, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaLaugh, FaSadTear } from "react-icons/fa";
import { usePosts, useAddPost, useAddReaction } from '../integrations/supabase/api';

const Index = () => {
  const { data: posts, isLoading, isError } = usePosts();
  const addPostMutation = useAddPost();
  const addReactionMutation = useAddReaction();
  const [newPost, setNewPost] = useState("");

  const handleAddPost = () => {
    if (newPost.trim() !== "") {
      addPostMutation.mutate({ title: newPost, body: newPost, author_id: 'some-author-id' });
      setNewPost("");
    }
  };

  const handleAddReaction = (postId, reaction) => {
    addReactionMutation.mutate({ post_id: postId, user_id: 'some-user-id', emoji: reaction });
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading posts</Text>;

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Text fontSize="3xl" fontWeight="bold">Public Postboard</Text>
        <HStack width="100%">
          <Input
            placeholder="Write a new post..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <Button onClick={handleAddPost} colorScheme="blue">Post</Button>
        </HStack>
        <VStack spacing={4} width="100%">
          {posts.map((post) => (
            <Box key={post.id} p={4} borderWidth="1px" borderRadius="md" width="100%">
              <Text>{post.title}</Text>
              <HStack spacing={2} mt={2}>
                <IconButton
                  aria-label="Like"
                  icon={<FaThumbsUp />}
                  onClick={() => handleAddReaction(post.id, "👍")}
                />
                <IconButton
                  aria-label="Dislike"
                  icon={<FaThumbsDown />}
                  onClick={() => handleAddReaction(post.id, "👎")}
                />
                <IconButton
                  aria-label="Laugh"
                  icon={<FaLaugh />}
                  onClick={() => handleAddReaction(post.id, "😂")}
                />
                <IconButton
                  aria-label="Sad"
                  icon={<FaSadTear />}
                  onClick={() => handleAddReaction(post.id, "😢")}
                />
              </HStack>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

export default Index;