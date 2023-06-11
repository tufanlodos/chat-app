import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  theme,
} from "@chakra-ui/react";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box minH="100vh" display="flex" flexDir="column" justifyContent="center">
      <VStack>
        <Text>Chat</Text>
        <Link
          color="teal.500"
          href="/"
          fontSize="2xl"
          target="_blank"
          rel="noopener noreferrer"
        >
          App
        </Link>
      </VStack>
    </Box>
  </ChakraProvider>
);
