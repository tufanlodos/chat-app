import { ChakraProvider, theme } from "@chakra-ui/react";
import { Intro, Main } from "./components";
import { useUserContext } from "./contexts";

export const App = () => {
  const { username } = useUserContext();

  return (
    <ChakraProvider theme={theme}>
      {username ? <Main /> : <Intro />}
    </ChakraProvider>
  );
};
