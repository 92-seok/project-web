package com.pawmart.backend.pet.dto;

import java.time.LocalDateTime;

import com.pawmart.backend.pet.Pet;

public record PetResponse(
    Long id, String name, String type, Integer age, String imageUrl, LocalDateTime createdAt) {

  public static PetResponse from(Pet pet) {
    return new PetResponse(
        pet.getId(),
        pet.getName(),
        pet.getType().name(),
        pet.getAge(),
        pet.getImageUrl(),
        pet.getCreatedAt());
  }
}
