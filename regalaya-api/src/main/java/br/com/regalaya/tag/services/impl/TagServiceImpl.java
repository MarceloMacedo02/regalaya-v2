package br.com.regalaya.tag.services.impl;

import br.com.regalaya.tag.domain.model.Tag;
import br.com.regalaya.tag.dto.requests.CreateTagRequest;
import br.com.regalaya.tag.dto.responses.TagResponse;
import br.com.regalaya.tag.exception.TagNotFoundException;
import br.com.regalaya.tag.mapper.TagMapper;
import br.com.regalaya.tag.repository.TagRepository;
import br.com.regalaya.tag.services.TagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;
    private final TagMapper tagMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<TagResponse> findAll(Pageable pageable) {
        return tagRepository.findAll(pageable).map(tagMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public TagResponse findById(UUID id) {
        Tag tag = tagRepository.findById(id)
            .orElseThrow(() -> new TagNotFoundException("Tag não encontrada com id: " + id));
        return tagMapper.toResponse(tag);
    }

    @Override
    @Transactional(readOnly = true)
    public TagResponse findByName(String name) {
        Tag tag = tagRepository.findByName(name)
            .orElseThrow(() -> new TagNotFoundException("Tag não encontrada com nome: " + name));
        return tagMapper.toResponse(tag);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TagResponse> search(String term) {
        return tagRepository.findByNameContaining(term).stream()
            .map(tagMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional
    public TagResponse create(CreateTagRequest request) {
        if (tagRepository.existsByName(request.name())) {
            throw new IllegalArgumentException("Já existe uma tag com o nome: " + request.name());
        }
        Tag tag = tagMapper.toEntity(request);
        Tag saved = tagRepository.save(tag);
        log.info("Tag criada: {}", saved.getName());
        return tagMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public TagResponse update(UUID id, CreateTagRequest request) {
        Tag tag = tagRepository.findById(id)
            .orElseThrow(() -> new TagNotFoundException("Tag não encontrada com id: " + id));
        
        tagRepository.findByName(request.name())
            .ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new IllegalArgumentException("Já existe uma tag com o nome: " + request.name());
                }
            });
        
        tagMapper.updateEntity(tag, request);
        Tag saved = tagRepository.save(tag);
        log.info("Tag atualizada: {}", saved.getName());
        return tagMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!tagRepository.existsById(id)) {
            throw new TagNotFoundException("Tag não encontrada com id: " + id);
        }
        tagRepository.deleteById(id);
        log.info("Tag deletada: {}", id);
    }
}
