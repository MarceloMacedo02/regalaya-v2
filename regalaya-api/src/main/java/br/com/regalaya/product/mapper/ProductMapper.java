package br.com.regalaya.product.mapper;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.regalaya.category.domain.model.Category;
import br.com.regalaya.product.domain.model.Product;
import br.com.regalaya.product.dto.requests.CreateProductRequest;
import br.com.regalaya.product.dto.responses.ProductResponse;

@Component
public class ProductMapper {

    private final ObjectMapper objectMapper;

    public ProductMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public ProductResponse toResponse(Product product) {
        UUID categoryId = product.getCategory() != null ? product.getCategory().getId() : null;
        String categoryName = product.getCategory() != null ? product.getCategory().getName() : null;
        List<String> images = parseImages(product.getImages());

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getShortDescription(),
                product.getPrice(),
                product.getCompareAtPrice(),
                product.getSku(),
                product.getStock(),
                product.getIsActive(),
                images,
                categoryId,
                categoryName
        );
    }

    public Product toEntity(CreateProductRequest request, Category category) {
        return Product.builder()
                .name(request.name())
                .slug(request.slug())
                .description(request.description())
                .shortDescription(request.shortDescription())
                .price(request.price())
                .compareAtPrice(request.compareAtPrice())
                .sku(request.sku())
                .stock(request.stock())
                .images(serializeImages(request.images()))
                .isActive(request.isActive() != null ? request.isActive() : true)
                .category(category)
                .build();
    }

    public void updateEntity(Product product, CreateProductRequest request, Category category) {
        product.setName(request.name());
        product.setSlug(request.slug());
        product.setDescription(request.description());
        product.setShortDescription(request.shortDescription());
        product.setPrice(request.price());
        product.setCompareAtPrice(request.compareAtPrice());
        product.setSku(request.sku());
        product.setStock(request.stock());
        product.setImages(serializeImages(request.images()));
        if (request.isActive() != null) {
            product.setIsActive(request.isActive());
        }
        if (category != null) {
            product.setCategory(category);
        }
    }

    private List<String> parseImages(String imagesJson) {
        if (imagesJson == null || imagesJson.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(imagesJson, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return Collections.emptyList();
        }
    }

    private String serializeImages(List<String> images) {
        if (images == null || images.isEmpty()) {
            return "[]";
        }
        try {
            return objectMapper.writeValueAsString(images);
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }
}
