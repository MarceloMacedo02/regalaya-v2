package br.com.regalaya.category.services;

import java.util.List;
import java.util.UUID;

import br.com.regalaya.category.dto.requests.CreateCategoryRequest;
import br.com.regalaya.category.dto.responses.CategoryResponse;

public interface CategoryService {
    List<CategoryResponse> findAll();
    List<CategoryResponse> findActive();
    CategoryResponse findById(UUID id);
    CategoryResponse findBySlug(String slug);
    CategoryResponse create(CreateCategoryRequest request);
    CategoryResponse update(UUID id, CreateCategoryRequest request);
    void delete(UUID id);
}
