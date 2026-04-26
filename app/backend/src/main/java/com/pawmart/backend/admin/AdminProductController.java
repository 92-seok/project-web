package com.pawmart.backend.admin;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pawmart.backend.admin.dto.CreateProductRequest;
import com.pawmart.backend.product.Product;
import com.pawmart.backend.product.dto.ProductPageResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

  private final AdminProductService adminProductService;

  @GetMapping
  public ResponseEntity<ProductPageResponse> getProducts(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    return ResponseEntity.ok(adminProductService.getProducts(page, size));
  }

  @PostMapping
  public ResponseEntity<Void> createProduct(@Valid @RequestBody CreateProductRequest request) {
    Product created = adminProductService.createProduct(request);
    return ResponseEntity.created(
        java.net.URI.create("/api/admin/products/" + created.getId())
    ).build();
  }

  @PutMapping("/{id}")
  public ResponseEntity<Void> updateProduct(
      @PathVariable Long id,
      @Valid @RequestBody CreateProductRequest request) {
    adminProductService.updateProduct(id, request);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
    adminProductService.deleteProduct(id);
    return ResponseEntity.noContent().build();
  }
}
