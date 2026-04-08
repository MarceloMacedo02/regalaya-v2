package br.com.regalaya.product.services;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.com.regalaya.product.dto.requests.CreateProductRequest;
import br.com.regalaya.product.dto.responses.ProductResponse;

public interface ProductService {
    Page<ProductResponse> findAll(Pageable pageable);
    Page<ProductResponse> search(String search, Pageable pageable);
    Page<ProductResponse> findByCategory(UUID categoryId, Pageable pageable);
    ProductResponse findById(UUID id);
    ProductResponse findBySlug(String slug);
    ProductResponse create(CreateProductRequest request);
    ProductResponse update(UUID id, CreateProductRequest request);
    void delete(UUID id);
    List<ProductResponse> getSuggestions(String query);
}
