package com.pawmart.backend.product;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pawmart.backend.product.dto.ProductDetailResponse;
import com.pawmart.backend.product.dto.ProductPageResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

  private final ProductService productService;

  @GetMapping
  public ProductPageResponse getProducts(
      @RequestParam(required = false) String petType,
      @RequestParam(required = false) String category,
      @RequestParam(required = false) String badge,
      @RequestParam(required = false) String keyword,
      @RequestParam(defaultValue = "best") String sort,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    return productService.getProducts(petType, category, badge, keyword, sort, page, size);
  }

  @GetMapping("/{id}")
  public ProductDetailResponse getProduct(@PathVariable Long id) {
    return productService.getProduct(id);
  }
}
