package br.com.regalaya.communication.service;

import br.com.regalaya.communication.domain.enums.CommunicationType;
import br.com.regalaya.communication.dto.request.TemplateRequest;
import br.com.regalaya.communication.dto.response.TemplateResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface TemplateService {

    List<TemplateResponse> findAll();

    List<TemplateResponse> findByType(CommunicationType type);

    List<TemplateResponse> searchByName(String name);

    TemplateResponse findById(UUID id);

    TemplateResponse create(TemplateRequest request);

    TemplateResponse update(UUID id, TemplateRequest request);

    void delete(UUID id);

    List<TemplateResponse> getVersions(UUID id);

    String replaceVariables(UUID id, Map<String, String> variables);

    void validateTemplate(String content);

    String exportTemplates();

    List<TemplateResponse> importTemplates(String jsonContent);
}
