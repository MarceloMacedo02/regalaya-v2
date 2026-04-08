package br.com.regalaya.communication.service.impl;

import br.com.regalaya.communication.domain.enums.CommunicationType;
import br.com.regalaya.communication.domain.model.CommunicationTemplate;
import br.com.regalaya.communication.dto.request.TemplateRequest;
import br.com.regalaya.communication.dto.response.TemplateResponse;
import br.com.regalaya.communication.exception.TemplateNotFoundException;
import br.com.regalaya.communication.exception.TemplateValidationException;
import br.com.regalaya.communication.repository.CommunicationTemplateRepository;
import br.com.regalaya.communication.service.TemplateService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class TemplateServiceImpl implements TemplateService {

    private static final Pattern VARIABLE_PATTERN = Pattern.compile("\\{\\{([^}]+)\\}\\}");

    private final CommunicationTemplateRepository repository;
    private final ObjectMapper objectMapper;

    @Override
    public List<TemplateResponse> findAll() {
        return repository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<TemplateResponse> findByType(CommunicationType type) {
        return repository.findByType(type).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<TemplateResponse> searchByName(String name) {
        return repository.findByNameContainingIgnoreCase(name).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public TemplateResponse findById(UUID id) {
        return repository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new TemplateNotFoundException("Template não encontrado: " + id));
    }

    @Override
    @Transactional
    public TemplateResponse create(TemplateRequest request) {
        validateTemplate(request.content());

        CommunicationTemplate template = CommunicationTemplate.builder()
                .name(request.name())
                .type(request.type())
                .subject(request.subject())
                .content(request.content())
                .variables(request.variables())
                .description(request.description())
                .isActive(request.isActive() != null ? request.isActive() : true)
                .version(1)
                .category(request.category())
                .build();

        template = repository.save(template);
        log.info("Template criado: {} (id={})", template.getName(), template.getId());
        return toResponse(template);
    }

    @Override
    @Transactional
    public TemplateResponse update(UUID id, TemplateRequest request) {
        CommunicationTemplate template = repository.findById(id)
                .orElseThrow(() -> new TemplateNotFoundException("Template não encontrado: " + id));

        validateTemplate(request.content());

        template.setName(request.name());
        template.setType(request.type());
        template.setSubject(request.subject());
        template.setContent(request.content());
        template.setVariables(request.variables());
        template.setDescription(request.description());
        template.setIsActive(request.isActive() != null ? request.isActive() : template.getIsActive());
        template.setCategory(request.category());
        template.incrementVersion();

        template = repository.save(template);
        log.info("Template atualizado: {} (id={}, version={})", template.getName(), template.getId(), template.getVersion());
        return toResponse(template);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        CommunicationTemplate template = repository.findById(id)
                .orElseThrow(() -> new TemplateNotFoundException("Template não encontrado: " + id));
        repository.delete(template);
        log.info("Template excluído: {} (id={})", template.getName(), template.getId());
    }

    @Override
    public List<TemplateResponse> getVersions(UUID id) {
        CommunicationTemplate template = repository.findById(id)
                .orElseThrow(() -> new TemplateNotFoundException("Template não encontrado: " + id));

        List<CommunicationTemplate> versions = new ArrayList<>();
        versions.add(template);

        return versions.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public String replaceVariables(UUID id, Map<String, String> variables) {
        CommunicationTemplate template = repository.findById(id)
                .orElseThrow(() -> new TemplateNotFoundException("Template não encontrado: " + id));

        return replaceVariablesInContent(template.getContent(), variables);
    }

    @Override
    public void validateTemplate(String content) {
        if (content == null || content.isBlank()) {
            throw new TemplateValidationException("O conteúdo do template não pode ser vazio");
        }

        Matcher matcher = VARIABLE_PATTERN.matcher(content);
        while (matcher.find()) {
            String variable = matcher.group(1);
            if (!isValidVariable(variable)) {
                throw new TemplateValidationException("Variável inválida: {{" + variable + "}}");
            }
        }
    }

    @Override
    public String exportTemplates() {
        List<CommunicationTemplate> templates = repository.findAll();
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(templates);
        } catch (JsonProcessingException e) {
            log.error("Erro ao exportar templates", e);
            throw new TemplateValidationException("Erro ao exportar templates: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public List<TemplateResponse> importTemplates(String jsonContent) {
        try {
            List<CommunicationTemplate> templates = objectMapper.readValue(jsonContent, new TypeReference<>() {});
            List<TemplateResponse> responses = new ArrayList<>();

            for (CommunicationTemplate template : templates) {
                template.setId(null);
                template.setCreatedAt(null);
                template.setUpdatedAt(null);
                template.setVersion(1);
                CommunicationTemplate saved = repository.save(template);
                responses.add(toResponse(saved));
            }

            log.info("Templates importados: {}", responses.size());
            return responses;
        } catch (JsonProcessingException e) {
            log.error("Erro ao importar templates", e);
            throw new TemplateValidationException("Erro ao importar templates: " + e.getMessage());
        }
    }

    private boolean isValidVariable(String variable) {
        return variable.matches("^[a-zA-Z0-9_]+$");
    }

    private String replaceVariablesInContent(String content, Map<String, String> variables) {
        String result = content;
        Matcher matcher = VARIABLE_PATTERN.matcher(result);
        StringBuffer sb = new StringBuffer();

        while (matcher.find()) {
            String variable = matcher.group(1);
            String value = variables.getOrDefault(variable, "");
            matcher.appendReplacement(sb, Matcher.quoteReplacement(value));
        }
        matcher.appendTail(sb);

        return sb.toString();
    }

    private TemplateResponse toResponse(CommunicationTemplate template) {
        return new TemplateResponse(
                template.getId(),
                template.getName(),
                template.getType(),
                template.getSubject(),
                template.getContent(),
                template.getVariables(),
                template.getDescription(),
                template.getIsActive(),
                template.getVersion(),
                template.getCategory(),
                template.getCreatedAt(),
                template.getUpdatedAt()
        );
    }
}
