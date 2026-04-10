package br.com.regalaya.tag.controller;

import br.com.regalaya.tag.dto.requests.CreateTagRequest;
import br.com.regalaya.tag.dto.responses.TagResponse;
import br.com.regalaya.tag.services.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/tags")
@RequiredArgsConstructor
@io.swagger.v3.oas.annotations.tags.Tag(name = "Tags", description = "Tag management operations")
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ResponseEntity<Page<TagResponse>> findAll(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(tagService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TagResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(tagService.findById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<TagResponse>> search(@RequestParam String term) {
        return ResponseEntity.ok(tagService.search(term));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<TagResponse> create(@Valid @RequestBody CreateTagRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tagService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TagResponse> update(@PathVariable UUID id, @Valid @RequestBody CreateTagRequest request) {
        return ResponseEntity.ok(tagService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        tagService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
