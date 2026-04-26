package com.pawmart.backend.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;
import com.pawmart.backend.product.dto.ProductDetailResponse;
import com.pawmart.backend.product.dto.ProductPageResponse;
import com.pawmart.backend.product.dto.ProductSummaryResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

  private final ProductRepository productRepository;

  public ProductPageResponse getProducts(
      String petType,
      String category,
      String keyword,
      String sort,
      int page,
      int size) {

    Sort sortObj =
        switch (sort) {
          case "price_asc" -> Sort.by("price").ascending();
          case "price_desc" -> Sort.by("price").descending();
          case "rating" -> Sort.by("rating").descending();
          case "newest" -> Sort.by("createdAt").descending();
          default -> Sort.by("reviewCount").descending(); // best
        };

    Pageable pageable = PageRequest.of(page, size, sortObj);
    Page<Product> productPage =
        productRepository.search(
            ProductStatus.ON_SALE,
            StringUtils.hasText(petType) ? petType : null,
            StringUtils.hasText(category) ? category : null,
            StringUtils.hasText(keyword) ? keyword : null,
            pageable);

    return new ProductPageResponse(
        productPage.getContent().stream().map(ProductSummaryResponse::from).toList(),
        productPage.getNumber(),
        productPage.getSize(),
        productPage.getTotalElements(),
        productPage.getTotalPages(),
        productPage.isLast());
  }

  public ProductDetailResponse getProduct(Long id) {
    Product product =
        productRepository
            .findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
    return ProductDetailResponse.from(product);
  }
}
