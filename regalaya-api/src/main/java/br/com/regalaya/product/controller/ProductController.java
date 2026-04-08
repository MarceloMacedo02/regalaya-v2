package br.com.regalaya.product.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.regalaya.product.dto.requests.CreateProductRequest;
import br.com.regalaya.product.dto.responses.ProductResponse;
import br.com.regalaya.product.services.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/v1/products")
@Tag(name = "Products", description = "Product management operations")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "List all products (paginated)")
    public ResponseEntity<Page<ProductResponse>> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ProductResponse> result;
        if (search != null && !search.isBlank()) {
            result = productService.search(search, pageable);
        } else if (categoryId != null) {
            result = productService.findByCategory(categoryId, pageable);
        } else {
            result = productService.findAll(pageable);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Find product by ID")
    @ApiResponse(responseCode = "200", description = "Product found")
    @ApiResponse(responseCode = "404", description = "Product not found")
    public ResponseEntity<ProductResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Find product by slug")
    public ResponseEntity<ProductResponse> findBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.findBySlug(slug));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create new product")
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update product")
    public ResponseEntity<ProductResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete product")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/suggestions")
    @Operation(summary = "Get product suggestions for autocomplete")
    public ResponseEntity<List<ProductResponse>> getSuggestions(
            @RequestParam String q) {
        return ResponseEntity.ok(productService.getSuggestions(q));
    }
}
