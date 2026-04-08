package br.com.regalaya.category.services.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.regalaya.category.domain.model.Category;
import br.com.regalaya.category.dto.requests.CreateCategoryRequest;
import br.com.regalaya.category.dto.responses.CategoryResponse;
import br.com.regalaya.category.mapper.CategoryMapper;
import br.com.regalaya.category.repository.CategoryRepository;
import br.com.regalaya.category.services.CategoryService;
import br.com.regalaya.shared.exception.ResourceNotFoundException;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> findAll() {
        return categoryRepository.findAllRootsWithChildren()
                .stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> findActive() {
        return categoryRepository.findByIsActiveTrueOrderBySortOrderAsc()
                .stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse findById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com id: " + id));
        return categoryMapper.toResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse findBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com slug: " + slug));
        return categoryMapper.toResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse create(CreateCategoryRequest request) {
        if (categoryRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Já existe uma categoria com o slug: " + request.slug());
        }
        Category category = categoryMapper.toEntity(request);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public CategoryResponse update(UUID id, CreateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com id: " + id));
        categoryMapper.updateEntity(category, request);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoria não encontrada com id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
