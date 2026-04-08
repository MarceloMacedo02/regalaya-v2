package br.com.regalaya.communication.service.impl;

import br.com.regalaya.communication.domain.enums.CommunicationType;
import br.com.regalaya.communication.domain.model.CommunicationTemplate;
import br.com.regalaya.communication.dto.request.TemplateRequest;
import br.com.regalaya.communication.dto.response.TemplateResponse;
import br.com.regalaya.communication.exception.TemplateNotFoundException;
import br.com.regalaya.communication.exception.TemplateValidationException;
import br.com.regalaya.communication.repository.CommunicationTemplateRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class TemplateServiceImplTest {

    @Mock
    private CommunicationTemplateRepository repository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private TemplateServiceImpl templateService;

    private final UUID TEST_ID = UUID.randomUUID();
    private final String TEST_NAME = "Template de Boas-Vindas";
    private final String TEST_CONTENT = "Olá {{nome}}, bem-vindo à Regalaya!";
    private final String TEST_VARIABLES = "nome,email";

    private CommunicationTemplate testTemplate;
    private TemplateRequest testRequest;

    @BeforeEach
    void setUp() {
        testTemplate = new CommunicationTemplate();
        testTemplate.setId(TEST_ID);
        testTemplate.setName(TEST_NAME);
        testTemplate.setType(CommunicationType.EMAIL);
        testTemplate.setSubject("Bem-vindo!");
        testTemplate.setContent(TEST_CONTENT);
        testTemplate.setVariables(TEST_VARIABLES);
        testTemplate.setDescription("Template de boas-vindas");
        testTemplate.setIsActive(true);
        testTemplate.setVersion(1);
        testTemplate.setCategory("ONBOARDING");

        testRequest = new TemplateRequest(
                TEST_NAME,
                CommunicationType.EMAIL,
                "Bem-vindo!",
                TEST_CONTENT,
                TEST_VARIABLES,
                "Template de boas-vindas",
                true,
                "ONBOARDING"
        );
    }

    @Test
    void findAll_ShouldReturnAllTemplates() {
        when(repository.findAll()).thenReturn(List.of(testTemplate));

        List<TemplateResponse> result = templateService.findAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(TEST_NAME, result.getFirst().name());
        verify(repository).findAll();
    }

    @Test
    void findByType_ShouldReturnTemplatesOfType() {
        when(repository.findByType(CommunicationType.EMAIL)).thenReturn(List.of(testTemplate));

        List<TemplateResponse> result = templateService.findByType(CommunicationType.EMAIL);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(CommunicationType.EMAIL, result.getFirst().type());
        verify(repository).findByType(CommunicationType.EMAIL);
    }

    @Test
    void searchByName_ShouldReturnMatchingTemplates() {
        when(repository.findByNameContainingIgnoreCase("Boas")).thenReturn(List.of(testTemplate));

        List<TemplateResponse> result = templateService.searchByName("Boas");

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(repository).findByNameContainingIgnoreCase("Boas");
    }

    @Test
    void findById_WhenExists_ShouldReturnTemplate() {
        when(repository.findById(TEST_ID)).thenReturn(Optional.of(testTemplate));

        TemplateResponse result = templateService.findById(TEST_ID);

        assertNotNull(result);
        assertEquals(TEST_ID, result.id());
        assertEquals(TEST_NAME, result.name());
        assertEquals(1, result.version());
    }

    @Test
    void findById_WhenNotExists_ShouldThrowException() {
        when(repository.findById(TEST_ID)).thenReturn(Optional.empty());

        assertThrows(TemplateNotFoundException.class, () -> templateService.findById(TEST_ID));
    }

    @Test
    void create_WithValidContent_ShouldCreateTemplate() {
        when(repository.save(any(CommunicationTemplate.class))).thenReturn(testTemplate);

        TemplateResponse result = templateService.create(testRequest);

        assertNotNull(result);
        assertEquals(TEST_NAME, result.name());
        assertEquals(1, result.version());
        verify(repository).save(any(CommunicationTemplate.class));
    }

    @Test
    void create_WithEmptyContent_ShouldThrowValidationException() {
        TemplateRequest invalidRequest = new TemplateRequest(
                "Test",
                CommunicationType.EMAIL,
                null,
                "",
                null,
                null,
                true,
                null
        );

        assertThrows(TemplateValidationException.class, () -> templateService.create(invalidRequest));
    }

    @Test
    void update_WhenExists_ShouldUpdateAndIncrementVersion() {
        when(repository.findById(TEST_ID)).thenReturn(Optional.of(testTemplate));
        when(repository.save(any(CommunicationTemplate.class))).thenReturn(testTemplate);

        TemplateRequest updateRequest = new TemplateRequest(
                "Template Atualizado",
                CommunicationType.EMAIL,
                "Assunto Atualizado",
                "Conteúdo atualizado {{nome}}",
                "nome",
                "Descrição atualizada",
                true,
                "PROMO"
        );

        TemplateResponse result = templateService.update(TEST_ID, updateRequest);

        assertNotNull(result);
        verify(repository).save(argThat(template -> template.getVersion() == 2));
    }

    @Test
    void update_WhenNotExists_ShouldThrowException() {
        when(repository.findById(TEST_ID)).thenReturn(Optional.empty());

        assertThrows(TemplateNotFoundException.class, () -> templateService.update(TEST_ID, testRequest));
    }

    @Test
    void delete_WhenExists_ShouldDeleteTemplate() {
        when(repository.findById(TEST_ID)).thenReturn(Optional.of(testTemplate));

        templateService.delete(TEST_ID);

        verify(repository).delete(testTemplate);
    }

    @Test
    void delete_WhenNotExists_ShouldThrowException() {
        when(repository.findById(TEST_ID)).thenReturn(Optional.empty());

        assertThrows(TemplateNotFoundException.class, () -> templateService.delete(TEST_ID));
    }

    @Test
    void getVersions_WhenExists_ShouldReturnVersions() {
        when(repository.findById(TEST_ID)).thenReturn(Optional.of(testTemplate));

        List<TemplateResponse> result = templateService.getVersions(TEST_ID);

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void getVersions_WhenNotExists_ShouldThrowException() {
        when(repository.findById(TEST_ID)).thenReturn(Optional.empty());

        assertThrows(TemplateNotFoundException.class, () -> templateService.getVersions(TEST_ID));
    }

    @Test
    void replaceVariables_ShouldReplaceAllVariables() {
        when(repository.findById(TEST_ID)).thenReturn(Optional.of(testTemplate));

        Map<String, String> variables = Map.of(
                "nome", "João Silva",
                "email", "joao@email.com"
        );

        String result = templateService.replaceVariables(TEST_ID, variables);

        assertNotNull(result);
        assertEquals("Olá João Silva, bem-vindo à Regalaya!", result);
    }

    @Test
    void replaceVariables_WhenTemplateNotFound_ShouldThrowException() {
        when(repository.findById(TEST_ID)).thenReturn(Optional.empty());

        assertThrows(TemplateNotFoundException.class,
                () -> templateService.replaceVariables(TEST_ID, Map.of()));
    }

    @Test
    void validateTemplate_WithValidContent_ShouldNotThrow() {
        assertDoesNotThrow(() -> templateService.validateTemplate("Olá {{nome}}, tudo bem?"));
    }

    @Test
    void validateTemplate_WithEmptyContent_ShouldThrowException() {
        assertThrows(TemplateValidationException.class, () -> templateService.validateTemplate(""));
        assertThrows(TemplateValidationException.class, () -> templateService.validateTemplate(null));
    }

    @Test
    void validateTemplate_WithInvalidVariable_ShouldThrowException() {
        assertThrows(TemplateValidationException.class,
                () -> templateService.validateTemplate("Olá {{nome-invalido}}!"));
    }

    @Test
    void exportTemplates_ShouldReturnJson() throws JsonProcessingException {
        when(repository.findAll()).thenReturn(List.of(testTemplate));
        when(objectMapper.writerWithDefaultPrettyPrinter()).thenReturn(mock(ObjectWriter.class));
        when(objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(anyList())).thenReturn("[{}]");

        String result = templateService.exportTemplates();

        assertNotNull(result);
        verify(repository).findAll();
    }

    @Test
    void importTemplates_WithValidJson_ShouldImportTemplates() throws JsonProcessingException {
        String json = "[{\"name\":\"Test\",\"type\":\"EMAIL\",\"content\":\"Hello\"}]";
        when(objectMapper.readValue(eq(json), any(com.fasterxml.jackson.core.type.TypeReference.class)))
                .thenReturn(List.of(testTemplate));
        when(repository.save(any(CommunicationTemplate.class))).thenReturn(testTemplate);

        List<TemplateResponse> result = templateService.importTemplates(json);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(repository).save(argThat(t -> t.getVersion() == 1));
    }
}
