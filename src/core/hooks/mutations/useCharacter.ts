import type { CommonUseMutationOptions } from "@core/types/app";
import { useMutation } from "@tanstack/react-query";
import * as characterApi from '@core/apis/character.api';

export const useRemoveCharacter = (
    options?: CommonUseMutationOptions<number>
) => {
    const mutation = useMutation({
        ...options,
        mutationFn: (params) => characterApi.removeCharacter(params),
    });

    return mutation;
};