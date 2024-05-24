import { Container, Text, VStack, Box, Input, Button, HStack, IconButton, Spinner } from "@chakra-ui/react";
import { FaThumbsUp, FaThumbsDown, FaLaugh, FaSadTear } from "react-icons/fa";
import { usePosts, useAddPost, useReactions, useAddReaction } from "../integrations/supabase/api";

const Index = () => {
  const { data: posts, isLoading: postsLoading, error: postsError } = usePosts();
  const addPostMutation = useAddPost();
  const [newPost, setNewPost] = useState("");

  const addPost = () => {
    if (newPost.trim() !== "") {
      addPostMutation.mutate({ title: newPost, body: newPost, author_id: "user-id-placeholder" });
      setNewPost("");
    }
  };

  if (postsLoading) return <Spinner />;
  if (postsError) return <Text>Error loading posts</Text>;

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
          <Button onClick={addPost} colorScheme="blue" isLoading={addPostMutation.isLoading}>Post</Button>
        </HStack>
        <VStack spacing={4} width="100%">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

const PostItem = ({ post }) => {
  const { data: reactions, isLoading: reactionsLoading, error: reactionsError } = useReactions(post.id);
  const addReactionMutation = useAddReaction();

  const addReaction = (emoji) => {
    addReactionMutation.mutate({ post_id: post.id, user_id: "user-id-placeholder", emoji });
  };

  if (reactionsLoading) return <Spinner />;
  if (reactionsError) return <Text>Error loading reactions</Text>;

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" width="100%">
      <Text>{post.body}</Text>
      <HStack spacing={2} mt={2}>
        <IconButton
          aria-label="Like"
          icon={<FaThumbsUp />}
          onClick={() => addReaction("👍")}
        />
        <Text>{reactions.filter(r => r.emoji === "👍").length}</Text>
        <IconButton
          aria-label="Dislike"
          icon={<FaThumbsDown />}
          onClick={() => addReaction("👎")}
        />
        <Text>{reactions.filter(r => r.emoji === "👎").length}</Text>
        <IconButton
          aria-label="Laugh"
          icon={<FaLaugh />}
          onClick={() => addReaction("😂")}
        />
        <Text>{reactions.filter(r => r.emoji === "😂").length}</Text>
        <IconButton
          aria-label="Sad"
          icon={<FaSadTear />}
          onClick={() => addReaction("😢")}
        />
        <Text>{reactions.filter(r => r.emoji === "😢").length}</Text>
      </HStack>
    </Box>
  );
};

export default Index;