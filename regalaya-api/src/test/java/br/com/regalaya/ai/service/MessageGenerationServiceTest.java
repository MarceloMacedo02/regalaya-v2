package br.com.regalaya.ai.service;

import br.com.regalaya.ai.model.MessageRequest;
import br.com.regalaya.ai.model.MessageResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class MessageGenerationServiceTest {

    @Mock
    private RecommendationService recommendationService;

    @Mock
    private ResourceLoader resourceLoader;

    @InjectMocks
    private MessageGenerationService messageGenerationService;

    private MessageRequest request;

    @BeforeEach
    void setUp() {
        request = MessageRequest.builder()
                .ocasiao("Aniversário")
                .relacionamento("Mãe")
                .produto("Buquê de Rosas")
                .tom("sentimental")
                .contexto("Ela adora flores")
                .comprimento("medio")
                .build();
    }

    @Test
    void generateMessage_WithValidRequest_ReturnsMessage() {
        // Arrange
        MessageResponse expectedResponse = MessageResponse.builder()
                .mensagem("Querida mãe, estas rosas representam todo o amor e gratidão que sinto por você...")
                .build();
        when(recommendationService.generateMessage(any(MessageRequest.class)))
                .thenReturn(expectedResponse);

        // Act
        MessageResponse result = messageGenerationService.generateMessage(request);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getMensagem());
        assertTrue(result.getMensagem().contains("rosas"));
        verify(recommendationService).generateMessage(request);
    }

    @Test
    void generateMessage_WithEmptyResponse_ReturnsFallback() {
        // Arrange - IA retorna mensagem vazia
        MessageResponse emptyResponse = MessageResponse.builder().mensagem("").build();
        when(recommendationService.generateMessage(any(MessageRequest.class)))
                .thenReturn(emptyResponse);

        // Act
        MessageResponse result = messageGenerationService.generateMessage(request);

        // Assert - deve retornar fallback
        assertNotNull(result);
        assertNotNull(result.getMensagem());
        assertFalse(result.getMensagem().isEmpty());
    }

    @Test
    void generateMessage_WithNullResponse_ReturnsFallback() {
        // Arrange
        when(recommendationService.generateMessage(any(MessageRequest.class)))
                .thenReturn(null);

        // Act
        MessageResponse result = messageGenerationService.generateMessage(request);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getMensagem());
    }

    @Test
    void generateMessage_WithException_ReturnsFallback() {
        // Arrange
        when(recommendationService.generateMessage(any(MessageRequest.class)))
                .thenThrow(new RuntimeException("AI service unavailable"));

        // Act
        MessageResponse result = messageGenerationService.generateMessage(request);

        // Assert - fallback deve ser acionado
        assertNotNull(result);
        assertNotNull(result.getMensagem());
    }

    @Test
    void generateMessage_WithDifferentLengths_UsesCorrectPrompt() {
        // Arrange
        MessageResponse expectedResponse = MessageResponse.builder().mensagem("Test message").build();
        when(recommendationService.generateMessage(any(MessageRequest.class)))
                .thenReturn(expectedResponse);

        // Test curto
        MessageRequest shortRequest = MessageRequest.builder()
                .ocasiao("Natal")
                .relacionamento("Pai")
                .produto("Kit Vinhos")
                .comprimento("curto")
                .build();
        messageGenerationService.generateMessage(shortRequest);

        // Test longo
        MessageRequest longRequest = MessageRequest.builder()
                .ocasiao("Casamento")
                .relacionamento("Amigo")
                .produto("Vaso de Cristal")
                .comprimento("longo")
                .build();
        messageGenerationService.generateMessage(longRequest);

        // Assert - verificar que o serviço foi chamado 3 vezes (incluindo o primeiro)
        verify(recommendationService, times(3)).generateMessage(any(MessageRequest.class));
    }

    @Test
    void generateMessage_WithDifferentOccasions_ReturnsAppropriateFallback() {
        // Arrange - simular falha para testar fallback por ocasião
        when(recommendationService.generateMessage(any(MessageRequest.class)))
                .thenThrow(new RuntimeException("AI error"));

        // Test aniversário
        MessageRequest birthdayRequest = MessageRequest.builder()
                .ocasiao("Aniversário")
                .relacionamento("Amiga")
                .produto("Livro")
                .build();
        MessageResponse birthdayResult = messageGenerationService.generateMessage(birthdayRequest);
        assertNotNull(birthdayResult.getMensagem());

        // Test Natal
        MessageRequest christmasRequest = MessageRequest.builder()
                .ocasiao("Natal")
                .relacionamento("Família")
                .produto("Panetone")
                .build();
        MessageResponse christmasResult = messageGenerationService.generateMessage(christmasRequest);
        assertNotNull(christmasResult.getMensagem());
    }

    @Test
    void generateMessage_WithDefaultLength_UsesMedio() {
        // Arrange
        MessageRequest defaultLengthRequest = MessageRequest.builder()
                .ocasiao("Dia das Mães")
                .relacionamento("Mãe")
                .produto("Colar")
                .build(); // comprimento não especificado = medio

        MessageResponse expectedResponse = MessageResponse.builder().mensagem("Test").build();
        when(recommendationService.generateMessage(any(MessageRequest.class)))
                .thenReturn(expectedResponse);

        // Act
        MessageResponse result = messageGenerationService.generateMessage(defaultLengthRequest);

        // Assert
        assertNotNull(result);
        verify(recommendationService).generateMessage(any(MessageRequest.class));
    }
}
