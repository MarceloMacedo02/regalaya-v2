package br.com.regalaya.whatsapp.client;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import br.com.regalaya.whatsapp.config.WhatsAppProperties;
import br.com.regalaya.whatsapp.client.dto.WhatsAppSendMessageResponse;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WhatsAppClientTest {

    @Mock
    private RestTemplate restTemplate;

    private WhatsAppProperties properties;
    private WhatsAppClient client;

    @BeforeEach
    void setUp() {
        properties = new WhatsAppProperties();
        properties.setApiUrl("https://graph.facebook.com/v21.0");
        properties.setPhoneNumberId("123456789");
        properties.setAccessToken("test-token");
        properties.setTemplateLanguage("pt_BR");
        properties.setConnectionTimeoutMs(5000);
        properties.setReadTimeoutMs(10000);

        client = new WhatsAppClient(properties, restTemplate);
    }

    @Test
    void sendMessage_sucess_returnsResponse() {
        WhatsAppSendMessageResponse expectedResponse = new WhatsAppSendMessageResponse();
        expectedResponse.setMessageId("wamid.test123");

        when(restTemplate.postForObject(any(String.class), any(), eq(WhatsAppSendMessageResponse.class)))
                .thenReturn(expectedResponse);

        WhatsAppSendMessageResponse result = client.sendMessage("+5511988887777", "test_template", Map.of("1", "value"));

        assertNotNull(result);
        assertEquals("wamid.test123", result.getMessageId());
    }

    @Test
    void sendMessage_apiError_throwsException() {
        when(restTemplate.postForObject(any(String.class), any(), eq(WhatsAppSendMessageResponse.class)))
                .thenThrow(new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Error"));

        assertThrows(WhatsAppApiException.class, () -> 
                client.sendMessage("+5511988887777", "test_template", Map.of()));
    }

    @Test
    void sendMessage_invalidPhone_normalizesCorrectly() {
        WhatsAppSendMessageResponse response = new WhatsAppSendMessageResponse();
        response.setMessageId("wamid.test");

        when(restTemplate.postForObject(any(String.class), any(), eq(WhatsAppSendMessageResponse.class)))
                .thenReturn(response);

        client.sendMessage("5511988887777", "template", Map.of());
        
        verify(restTemplate).postForObject(any(String.class), any(), eq(WhatsAppSendMessageResponse.class));
    }
}