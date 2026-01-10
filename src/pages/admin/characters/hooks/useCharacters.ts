import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as adminApi from "@core/apis/admin.api";
import type {
  AdminCharacterListParams,
  AdminCharacterUpdateRequest,
} from "@core/types/admin";

export const useCharacters = (params: AdminCharacterListParams = {}) => {
  return useQuery({
    queryKey: ["admin", "characters", params],
    queryFn: () => adminApi.getCharacters(params),
    staleTime: 1000 * 60 * 2,
  });
};

export const useCharacter = (characterId: number | null) => {
  return useQuery({
    queryKey: ["admin", "characters", characterId],
    queryFn: () => adminApi.getCharacter(characterId!),
    enabled: characterId !== null,
    staleTime: 1000 * 60 * 2,
  });
};

export const useUpdateCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      characterId,
      data,
    }: {
      characterId: number;
      data: AdminCharacterUpdateRequest;
    }) => adminApi.updateCharacter(characterId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "characters"] });
    },
  });
};

export const useDeleteCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      characterId,
      hardDelete = false,
    }: {
      characterId: number;
      hardDelete?: boolean;
    }) => adminApi.deleteCharacter(characterId, hardDelete),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "characters"] });
    },
  });
};
