import { useMutation } from "@tanstack/react-query";
import { updateFriendSort } from "@core/apis/friend.api";

export const useUpdateFriendSort = ({ onSuccess }: { onSuccess: () => void }) => {
    return useMutation({
        mutationFn: updateFriendSort,
        onSuccess,
    });
};