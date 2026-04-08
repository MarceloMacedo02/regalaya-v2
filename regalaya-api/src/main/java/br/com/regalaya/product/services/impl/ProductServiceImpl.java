package br.com.regalaya.product.services.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.regalaya.category.domain.model.Category;
import br.com.regalaya.category.repository.CategoryRepository;
import br.com.regalaya.product.domain.model.Product;
import br.com.regalaya.product.dto.requests.CreateProductRequest;
import br.com.regalaya.product.dto.responses.ProductResponse;
import br.com.regalaya.product.exception.ProductNotFoundException;
import br.com.regalaya.product.mapper.ProductMapper;
import br.com.regalaya.product.repository.ProductRepository;
import br.com.regalaya.product.services.ProductService;
import br.com.regalaya.shared.exception.ResourceNotFoundException;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public ProductServiceImpl(ProductRepository productRepository,
                              CategoryRepository categoryRepository,
                              ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productMapper = productMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> findAll(Pageable pageable) {
        return productRepository.findByIsActiveTrue(pageable).map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> search(String search, Pageable pageable) {
        return productRepository.searchActive(search, pageable).map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> findByCategory(UUID categoryId, Pageable pageable) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Categoria não encontrada com id: " + categoryId);
        }
        return productRepository.findByCategoryId(categoryId, pageable).map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse findById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Produto não encontrado com id: " + id));
        return productMapper.toResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse findBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ProductNotFoundException("Produto não encontrado com slug: " + slug));
        return productMapper.toResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse create(CreateProductRequest request) {
        if (productRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Já existe um produto com o slug: " + request.slug());
        }
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com id: " + request.categoryId()));
        Product product = productMapper.toEntity(request, category);
        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ProductResponse update(UUID id, CreateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Produto não encontrado com id: " + id));
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com id: " + request.categoryId()));
        productMapper.updateEntity(product, request, category);
        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException("Produto não encontrado com id: " + id);
        }
        productRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getSuggestions(String query) {
        Pageable top5 = PageRequest.of(0, 5);
        return productRepository.findSuggestions(query, top5)
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }
}
