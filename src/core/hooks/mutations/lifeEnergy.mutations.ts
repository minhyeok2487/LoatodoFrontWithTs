import { useMutation } from "@tanstack/react-query";

import * as lifeEnergyApi from "@core/apis/lifeEnergy.api";
import * as memberApi from "@core/apis/member.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { LifeEnergySaveRequest, LifeEnergyUpdateRequest, LifeEnergySpendRequest } from "@core/types/lifeEnergy";
import type { Member, UpdateLifePotionRequest } from "@core/types/member";

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

export const useSpendLifeEnergy = (
    options?: CommonUseMutationOptions<LifeEnergySpendRequest>
) => {
    const mutation = useMutation({
        ...options,
        mutationFn: (params) => lifeEnergyApi.spend(params),
    });

    return mutation;
};

export const useUpdateLifePotion = (
    options?: CommonUseMutationOptions<UpdateLifePotionRequest, Member>
) => {
    const mutation = useMutation({
        ...options,
        mutationFn: (params) => memberApi.updateLifePotion(params),
    });

    return mutation;
};