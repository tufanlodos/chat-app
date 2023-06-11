import { useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useSocketContext, useUserContext } from "../contexts";

export function Main() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showCreate, setShowCreate] = useState(false);
  const { username } = useUserContext();
  const { rooms, onCreateRoom } = useSocketContext();
  const roomsCount = Object.keys(rooms).length;

  const onCreate = () => {
    const roomName = inputRef.current?.value;
    if (!roomName?.trim()) return;
    onCreateRoom(roomName);
    inputRef.current!.value = "";
    setShowCreate(false);
  };

  return (
    <VStack>
      <Text mt={4} fontWeight="bold">
        Welcome {username}!
      </Text>
      <Text>Create a room {roomsCount ? "or join to existing one" : ""}</Text>
      <Divider />
      {roomsCount === 0 && !showCreate && (
        <Button onClick={() => setShowCreate(true)} variant="outline">
          Create
        </Button>
      )}
      <Box mt="5">
        {showCreate ? (
          <VStack>
            <Input ref={inputRef} placeholder="Room name" size="md" />
            <HStack>
              <Button
                onClick={() => setShowCreate(false)}
                variant="outline"
                color="red"
              >
                Cancel
              </Button>
              <Button onClick={onCreate} variant="outline">
                Create
              </Button>
            </HStack>
          </VStack>
        ) : (
          <RoomsView onShowCreate={() => setShowCreate(true)} />
        )}
      </Box>

      {!showCreate && <MessagesView />}
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
              disabled={selectedRoomId === id}
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
    <VStack mt="5" w="100vw">
      <Divider />
      {messages.length === 0 && (
        <Text>There is no message for room {roomName}</Text>
      )}

      {messages.length > 0 && (
        <VStack spacing={4} w="70vw">
          <Text fontWeight="semibold">Messages</Text>
          {messages.map((m, index) => (
            <Box
              key={index}
              border="1px"
              borderColor="gray.400"
              borderRadius="md"
              padding={2}
              w="30vw"
            >
              <Text
                color="gray.600"
                textAlign={m.username === username ? "right" : "left"}
              >
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
            w="50vw"
          />
          <Button
            onClick={() => {
              onSendMessage(message);
              setMessage("");
            }}
            disabled={!message}
            variant="outline"
          >
            Send
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
}
