package com.pawmart.backend.member;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberRepository extends JpaRepository<Member, Long> {

  Optional<Member> findByLoginId(String loginId);

  Optional<Member> findByEmail(String email);

  boolean existsByLoginId(String loginId);

  boolean existsByEmail(String email);

  @Query(
      "SELECT m FROM Member m WHERE "
          + "(:keyword IS NULL OR m.name LIKE %:keyword% OR m.email LIKE %:keyword%)")
  Page<Member> searchMembers(@Param("keyword") String keyword, Pageable pageable);
}
