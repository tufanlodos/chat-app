import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useSocketContext, useUserContext } from "../contexts";
import { useRef, useState } from "react";

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
      <Text fontWeight="bold">Welcome {username}!</Text>
      <Text>Create a room {roomsCount ? "or join to existing one" : ""}</Text>
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
              <Button onClick={onCreate}>Create</Button>
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
  const { rooms, selectedRoomId } = useSocketContext();
  if (!selectedRoomId) return null;
  const roomName = rooms[selectedRoomId]?.name ?? "";
  if (!roomName) return null;

  return (
    <VStack mt="5">
      <Text>There is no message for room {roomName}</Text>
    </VStack>
  );
}
