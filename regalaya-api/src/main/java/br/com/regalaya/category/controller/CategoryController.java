package br.com.regalaya.category.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.regalaya.category.dto.requests.CreateCategoryRequest;
import br.com.regalaya.category.dto.responses.CategoryResponse;
import br.com.regalaya.category.services.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/v1/categories")
@Tag(name = "Categories", description = "Category management operations")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    @Operation(summary = "List all categories")
    public ResponseEntity<List<CategoryResponse>> findAll() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    @GetMapping("/active")
    @Operation(summary = "List active categories")
    public ResponseEntity<List<CategoryResponse>> findActive() {
        return ResponseEntity.ok(categoryService.findActive());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Find category by ID")
    @ApiResponse(responseCode = "404", description = "Category not found")
    public ResponseEntity<CategoryResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.findById(id));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Find category by slug")
    public ResponseEntity<CategoryResponse> findBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(categoryService.findBySlug(slug));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create new category")
    public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CreateCategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update category")
    public ResponseEntity<CategoryResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody CreateCategoryRequest request) {
        return ResponseEntity.ok(categoryService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete category")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
