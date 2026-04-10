package br.com.regalaya.tag.services;

import br.com.regalaya.tag.dto.requests.CreateTagRequest;
import br.com.regalaya.tag.dto.responses.TagResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface TagService {

    Page<TagResponse> findAll(Pageable pageable);

    TagResponse findById(UUID id);

    TagResponse findByName(String name);

    List<TagResponse> search(String term);

    TagResponse create(CreateTagRequest request);

    TagResponse update(UUID id, CreateTagRequest request);

    void delete(UUID id);
}
