import { useMutation } from "@tanstack/react-query";

import * as lifeEnergyApi from "@core/apis/lifeEnergy.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { LifeEnergySaveRequest, LifeEnergyUpdateRequest } from "@core/types/lifeEnergy";

export const useUpdateLifeEnergy = (
    options?: CommonUseMutationOptions<LifeEnergyUpdateRequest>
) => {
    const mutation = useMutation({
        ...options,
        mutationFn: (params) => lifeEnergyApi.update(params),
    });

    return mutation;
};

export const useSaveLifeEnergy = (
    options?: CommonUseMutationOptions<LifeEnergySaveRequest>
) => {
    const mutation = useMutation({
        ...options,
        mutationFn: (params) => lifeEnergyApi.save(params),
    });

    return mutation;
};

export const useRemoveLifeEnergy = (
    options?: CommonUseMutationOptions<string>
) => {
    const mutation = useMutation({
        ...options,
        mutationFn: (characterName) => lifeEnergyApi.remove(characterName),
    });

    return mutation;
};