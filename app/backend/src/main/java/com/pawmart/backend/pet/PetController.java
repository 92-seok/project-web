package com.pawmart.backend.pet;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pawmart.backend.config.JwtPrincipal;
import com.pawmart.backend.pet.dto.PetRequest;
import com.pawmart.backend.pet.dto.PetResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

  private final PetService petService;

  @GetMapping
  public List<PetResponse> getMyPets(@AuthenticationPrincipal JwtPrincipal principal) {
    return petService.getMyPets(principal.memberId());
  }

  @PostMapping
  public ResponseEntity<PetResponse> create(
      @AuthenticationPrincipal JwtPrincipal principal, @Valid @RequestBody PetRequest request) {
    PetResponse response = petService.create(principal.memberId(), request);
    return ResponseEntity.status(201).body(response);
  }

  @PutMapping("/{id}")
  public PetResponse update(
      @AuthenticationPrincipal JwtPrincipal principal,
      @PathVariable Long id,
      @Valid @RequestBody PetRequest request) {
    return petService.update(principal.memberId(), id, request);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(
      @AuthenticationPrincipal JwtPrincipal principal, @PathVariable Long id) {
    petService.delete(principal.memberId(), id);
    return ResponseEntity.noContent().build();
  }
}
