package br.com.regalaya.category.mapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import br.com.regalaya.category.domain.model.Category;
import br.com.regalaya.category.dto.requests.CreateCategoryRequest;
import br.com.regalaya.category.dto.responses.CategoryResponse;
import br.com.regalaya.category.repository.CategoryRepository;

@Component
public class CategoryMapper {

    private final CategoryRepository categoryRepository;

    public CategoryMapper(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CategoryResponse toResponse(Category category) {
        Long productCount = category.getId() != null
                ? categoryRepository.countActiveProductsByCategoryId(category.getId())
                : 0L;

        UUID parentId = category.getParent() != null ? category.getParent().getId() : null;

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getImageUrl(),
                parentId,
                category.getSortOrder(),
                category.getIsActive(),
                productCount
        );
    }

    public Category toEntity(CreateCategoryRequest request) {
        Category.CategoryBuilder builder = Category.builder()
                .name(request.name())
                .slug(request.slug())
                .description(request.description())
                .imageUrl(request.imageUrl())
                .sortOrder(request.sortOrder() != null ? request.sortOrder() : 0)
                .isActive(request.isActive() != null ? request.isActive() : true);

        if (request.parentId() != null) {
            Category parent = new Category();
            parent.setId(request.parentId());
            builder.parent(parent);
        }

        return builder.build();
    }

    public void updateEntity(Category category, CreateCategoryRequest request) {
        category.setName(request.name());
        category.setSlug(request.slug());
        category.setDescription(request.description());
        category.setImageUrl(request.imageUrl());
        if (request.sortOrder() != null) {
            category.setSortOrder(request.sortOrder());
        }
        if (request.isActive() != null) {
            category.setIsActive(request.isActive());
        }
        if (request.parentId() != null) {
            Category parent = new Category();
            parent.setId(request.parentId());
            category.setParent(parent);
        } else {
            category.setParent(null);
        }
    }
}
