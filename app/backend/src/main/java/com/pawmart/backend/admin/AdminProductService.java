package com.pawmart.backend.admin;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pawmart.backend.admin.dto.CreateProductRequest;
import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;
import com.pawmart.backend.product.Product;
import com.pawmart.backend.product.ProductRepository;
import com.pawmart.backend.product.dto.ProductPageResponse;
import com.pawmart.backend.product.dto.ProductSummaryResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminProductService {

  private final ProductRepository productRepository;

  public ProductPageResponse getProducts(int page, int size) {
    Page<Product> productPage =
        productRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));

    return new ProductPageResponse(
        productPage.getContent().stream().map(ProductSummaryResponse::from).toList(),
        productPage.getNumber(),
        productPage.getSize(),
        productPage.getTotalElements(),
        productPage.getTotalPages(),
        productPage.isLast());
  }

  @Transactional
  public Product createProduct(CreateProductRequest req) {
    Product product =
        Product.create(
            req.name(),
            req.description(),
            req.price(),
            req.originalPrice(),
            req.imageUrl(),
            req.badge(),
            req.category(),
            req.petType(),
            req.stock());
    return productRepository.save(product);
  }

  @Transactional
  public void updateProduct(Long id, CreateProductRequest req) {
    Product product =
        productRepository
            .findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
    product.adminUpdate(
        req.name(),
        req.description(),
        req.price(),
        req.originalPrice(),
        req.imageUrl(),
        req.badge(),
        req.category(),
        req.petType(),
        req.stock());
  }

  @Transactional
  public void deleteProduct(Long id) {
    Product product =
        productRepository
            .findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
    product.hide();
  }
}
