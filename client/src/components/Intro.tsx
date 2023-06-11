import { Button, Input, Text, VStack } from "@chakra-ui/react";
import { useRef } from "react";
import { useUserContext } from "../contexts";

export function Intro() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setUsername } = useUserContext();

  const onContinue = () => {
    const username = inputRef.current?.value;
    if (!username?.trim()) return;

    setUsername(username);
  };

  return (
    <VStack
      minH="100vh"
      display="flex"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
    >
      <Text fontWeight="bold">Welcome to the Chat App!</Text>
      <Text>Pick a username to continue</Text>
      <Input ref={inputRef} placeholder="Username" size="md" w="50vw" />
      <Button onClick={onContinue}>Continue</Button>
    </VStack>
  );
}
