import { useMutation } from "@tanstack/react-query";

import * as lifeEnergyApi from "@core/apis/lifeEnergy.api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { LifeEnergySaveRequest, LifeEnergyUpdateRequest, LifeEnergySpendRequest } from "@core/types/lifeEnergy";
import type { Member, UpdateLifePotionRequest, UpdateLifePotionsRequest, UsePotionRequest } from "@core/types/member";

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
    return useMutation({
        ...options,
        mutationFn: (params) => lifeEnergyApi.updatePotion(params),
    });
};

export const useUpdateLifePotions = (
    options?: CommonUseMutationOptions<UpdateLifePotionsRequest, Member>
) => {
    return useMutation({
        ...options,
        mutationFn: (params) => lifeEnergyApi.updatePotions(params),
    });
};

export const useUsePotion = (
    options?: CommonUseMutationOptions<UsePotionRequest, Member>
) => {
    return useMutation({
        ...options,
        mutationFn: (params) => lifeEnergyApi.usePotion(params),
    });
};