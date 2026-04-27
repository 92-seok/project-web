package com.pawmart.backend.pet;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;
import com.pawmart.backend.pet.dto.PetRequest;
import com.pawmart.backend.pet.dto.PetResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PetService {

  private final PetRepository petRepository;

  public List<PetResponse> getMyPets(Long memberId) {
    return petRepository.findByMemberIdOrderByCreatedAtDesc(memberId).stream()
        .map(PetResponse::from)
        .toList();
  }

  @Transactional
  public PetResponse create(Long memberId, PetRequest request) {
    Pet pet =
        Pet.builder()
            .memberId(memberId)
            .name(request.name())
            .type(request.type())
            .age(request.age())
            .imageUrl(request.imageUrl())
            .build();
    return PetResponse.from(petRepository.save(pet));
  }

  @Transactional
  public PetResponse update(Long memberId, Long petId, PetRequest request) {
    Pet pet =
        petRepository
            .findByIdAndMemberId(petId, memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.PET_NOT_FOUND));
    pet.update(request.name(), request.type(), request.age(), request.imageUrl());
    return PetResponse.from(pet);
  }

  @Transactional
  public void delete(Long memberId, Long petId) {
    Pet pet =
        petRepository
            .findByIdAndMemberId(petId, memberId)
            .orElseThrow(() -> new BusinessException(ErrorCode.PET_NOT_FOUND));
    petRepository.delete(pet);
  }
}
