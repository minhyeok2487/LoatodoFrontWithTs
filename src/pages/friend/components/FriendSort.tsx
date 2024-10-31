import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    MouseSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
  } from "@dnd-kit/core";
  import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
  } from "@dnd-kit/sortable";
  import { useState } from "react";
  import styled from "styled-components";
  
  import { Friend } from "@core/types/friend";
import { useUpdateFriendSort } from "@core/hooks/mutations/friend/useUpdateFriendSort";
import queryClient from "@core/lib/queryClient";
import FriendItem from "./FriendItem";
import FriendSortableItem from "./FriendSortableItem";
  
  interface Props {
    friends: Friend[];
  }
  
  const FriendSort = ({ friends }: Props) => {
    const [sortedFriends, setSortedFriends] = useState(friends);
    const [activeId, setActiveId] = useState<number | null>();
    
    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  
    const updateFriendSort = useUpdateFriendSort({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["friends"],
        });
      },
    });
  
    const handleDragStart = (event: DragStartEvent) => {
      setActiveId(event.active.id as number);
    };
  
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      
      if (!over || active.id === over.id) return;
  
      setSortedFriends((friends) => {
        const oldIndex = friends.findIndex((f) => f.friendId === active.id);
        const newIndex = friends.findIndex((f) => f.friendId === over.id);
  
        const newFriends = arrayMove(friends, oldIndex, newIndex);
        
        updateFriendSort.mutate({
          friendIdList: newFriends.map((friend) => friend.friendId),
        });
  
        return newFriends;
      });
  
      setActiveId(null);
    };
  
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedFriends.map((friend) => friend.friendId)}
          strategy={rectSortingStrategy}
        >
          <FriendList>
            {sortedFriends.map((friend) => (
                <FriendSortableItem 
                key={friend.friendId}
                friend={friend}
                />
            ))}
            </FriendList>
        </SortableContext>
        
        <DragOverlay>
          {activeId ? (
            <FriendItem
              friend={sortedFriends.find(f => f.friendId === activeId)!}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  };
  
  export default FriendSort;
  
  const FriendList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `;