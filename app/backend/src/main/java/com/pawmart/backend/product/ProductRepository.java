package com.pawmart.backend.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

  Page<Product> findByStatus(ProductStatus status, Pageable pageable);

  @Query(
      "SELECT p FROM Product p WHERE p.status = :status "
          + "AND (:petType IS NULL OR p.petType = :petType) "
          + "AND (:category IS NULL OR p.category = :category) "
          + "AND (:keyword IS NULL OR p.name LIKE %:keyword%)")
  Page<Product> search(
      @Param("status") ProductStatus status,
      @Param("petType") String petType,
      @Param("category") String category,
      @Param("keyword") String keyword,
      Pageable pageable);
}
