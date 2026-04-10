package br.com.regalaya.tag.mapper;

import br.com.regalaya.tag.domain.model.Tag;
import br.com.regalaya.tag.dto.requests.CreateTagRequest;
import br.com.regalaya.tag.dto.responses.TagResponse;
import org.springframework.stereotype.Component;

@Component
public class TagMapper {

    public TagResponse toResponse(Tag tag) {
        return new TagResponse(
            tag.getId(),
            tag.getName(),
            tag.getDescription()
        );
    }

    public Tag toEntity(CreateTagRequest request) {
        return Tag.builder()
            .name(request.name())
            .description(request.description())
            .build();
    }

    public void updateEntity(Tag tag, CreateTagRequest request) {
        tag.setName(request.name());
        tag.setDescription(request.description());
    }
}
