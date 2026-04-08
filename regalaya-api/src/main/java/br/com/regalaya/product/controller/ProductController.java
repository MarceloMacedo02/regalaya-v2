package br.com.regalaya.product.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import br.com.regalaya.product.dto.requests.CreateProductRequest;
import br.com.regalaya.product.dto.responses.ProductResponse;
import br.com.regalaya.product.services.ProductService;
import br.com.regalaya.shared.service.StorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/v1/products")
@Tag(name = "Products", description = "Product management operations")
public class ProductController {

    private final ProductService productService;
    private final StorageService storageService;

    public ProductController(ProductService productService, StorageService storageService) {
        this.productService = productService;
        this.storageService = storageService;
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

    @PostMapping("/upload-image")
    @Operation(summary = "Upload product image to S3")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "productId", required = false) String productId) {
        
        String folder = "products";
        if (productId != null && !productId.isEmpty()) {
            folder = "products/" + productId;
        }
        
        Map<String, String> result = storageService.uploadFile(file, folder, null);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/with-image")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create new product with image upload")
    public ResponseEntity<ProductResponse> createWithImage(
            @RequestParam("name") String name,
            @RequestParam("slug") String slug,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "shortDescription", required = false) String shortDescription,
            @RequestParam("price") java.math.BigDecimal price,
            @RequestParam(value = "compareAtPrice", required = false) java.math.BigDecimal compareAtPrice,
            @RequestParam(value = "sku", required = false) String sku,
            @RequestParam("stock") Integer stock,
            @RequestParam("categoryId") java.util.UUID categoryId,
            @RequestParam(value = "isActive", required = false) Boolean isActive,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        // Upload image if provided
        List<String> images = new java.util.ArrayList<>();
        if (image != null && !image.isEmpty()) {
            Map<String, String> uploadResult = storageService.uploadFile(image, "products", null);
            images.add(uploadResult.get("url"));
        }
        
        CreateProductRequest request = new CreateProductRequest(
            name, slug, description, shortDescription,
            price, compareAtPrice, sku, stock, categoryId, images, isActive
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request));
    }
}
