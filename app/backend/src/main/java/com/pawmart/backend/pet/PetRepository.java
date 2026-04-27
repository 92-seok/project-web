package com.pawmart.backend.pet;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PetRepository extends JpaRepository<Pet, Long> {

  List<Pet> findByMemberIdOrderByCreatedAtDesc(Long memberId);

  Optional<Pet> findByIdAndMemberId(Long id, Long memberId);
}
