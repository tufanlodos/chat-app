import { useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useSocketContext, useUserContext } from "../contexts";

export function Main() {
  const [showCreate, setShowCreate] = useState(false);
  const { username } = useUserContext();
  const { rooms } = useSocketContext();
  const roomsCount = Object.keys(rooms).length;

  const onShowCreate = () => setShowCreate(true);
  const onHideCreate = () => setShowCreate(false);

  return (
    <VStack h="100vh">
      <Text mt={4} fontWeight="bold">
        Welcome {username}!
      </Text>
      <Text>Create a room {roomsCount ? "or join to existing one" : ""}</Text>
      {roomsCount === 0 && !showCreate && (
        <Button onClick={onShowCreate} variant="outline">
          Create
        </Button>
      )}
      <Divider />

      <Box mt="5">
        {showCreate ? (
          <CreateRoomView onHideCreate={onHideCreate} />
        ) : (
          <RoomsView onShowCreate={onShowCreate} />
        )}
      </Box>

      {!showCreate && <MessagesView />}
    </VStack>
  );
}

type CreateRoomViewProps = {
  onHideCreate: () => void;
};

function CreateRoomView({ onHideCreate }: CreateRoomViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { onCreateRoom } = useSocketContext();

  const onCreate = () => {
    const roomName = inputRef.current?.value;
    if (!roomName?.trim()) return;
    onCreateRoom(roomName);
    inputRef.current!.value = "";
    onHideCreate();
  };

  return (
    <VStack>
      <Text fontWeight="semibold">Create a room</Text>
      <Input ref={inputRef} placeholder="Room name" size="md" />
      <HStack>
        <Button onClick={onHideCreate} variant="outline" color="red">
          Cancel
        </Button>
        <Button onClick={onCreate} variant="outline">
          Create
        </Button>
      </HStack>
    </VStack>
  );
}

type RoomsViewProps = {
  onShowCreate: () => void;
};

function RoomsView({ onShowCreate }: RoomsViewProps) {
  const { rooms, selectedRoomId, onJoinRoom } = useSocketContext();
  const roomsCount = Object.keys(rooms).length;
  if (!roomsCount) return null;

  return (
    <VStack>
      <Text fontWeight="bold">Rooms</Text>
      <HStack>
        {roomsCount ? (
          Object.entries(rooms).map(([id, room]) => (
            <Button
              key={id}
              isDisabled={selectedRoomId === id}
              variant={selectedRoomId === id ? "solid" : "outline"}
              onClick={() => onJoinRoom(id)}
            >
              {room.name}
            </Button>
          ))
        ) : (
          <Text>No room, you can</Text>
        )}
        <Button onClick={() => onShowCreate()} variant="outline">
          Create
        </Button>
      </HStack>
    </VStack>
  );
}

function MessagesView() {
  const [message, setMessage] = useState("");
  const { username } = useUserContext();
  const { rooms, selectedRoomId, messages, onSendMessage } = useSocketContext();
  if (!selectedRoomId) return null;
  const roomName = rooms[selectedRoomId]?.name ?? "";
  if (!roomName) return null;

  return (
    <Flex flexDirection="column" mt="5" h="full">
      <Divider />
      {messages.length === 0 && (
        <VStack w="70vw" h="full" spacing={4} mb={4}>
          <Text textAlign="center" my={2}>
            There is no message for room <Text as="b">{roomName}</Text>. Start a
            conversation!
          </Text>
        </VStack>
      )}

      {messages.length > 0 && (
        <VStack w="70vw" h="full" spacing={4} mb={4}>
          <Text fontWeight="semibold" mt={2}>
            Messages
          </Text>
          {messages.map((m, index) => (
            <Box
              key={index}
              border="1px"
              borderColor="gray.100"
              borderRadius="md"
              padding={2}
              minW="25vw"
              alignSelf={m.username === username ? "flex-end" : "flex-start"}
              textAlign={m.username === username ? "right" : "left"}
            >
              <Text color="gray.600">
                {m.username === username ? "You" : m.username} - {m.time}
              </Text>
              <Text>{m.message}</Text>
            </Box>
          ))}
        </VStack>
      )}

      <Box position="sticky" bottom={0} bg="white">
        <HStack mb={4}>
          <Textarea
            value={message}
            onChange={({ currentTarget }) => setMessage(currentTarget.value)}
            placeholder="Type your message"
            w="60vw"
          />
          <Button
            onClick={() => {
              onSendMessage(message);
              setMessage("");
            }}
            isDisabled={message === ""}
            variant="outline"
          >
            Send
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
}
