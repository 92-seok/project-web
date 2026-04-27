package com.pawmart.backend.pet.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.pawmart.backend.pet.PetType;

public record PetRequest(
    @NotBlank @Size(max = 50) String name,
    @NotNull PetType type,
    @Min(0) @Max(50) Integer age,
    @Size(max = 500) String imageUrl) {}
