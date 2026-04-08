package br.com.regalaya.auth.exception;

public class UserAlreadyExistsException extends br.com.regalaya.shared.exception.BusinessException {

    private final String field;
    private final String value;

    public UserAlreadyExistsException(String message) {
        super(message);
        this.field = null;
        this.value = null;
    }

    public UserAlreadyExistsException(String field, String value) {
        super(String.format("Usuário já existe com %s: %s", field, value));
        this.field = field;
        this.value = value;
    }

    public String getFieldValue() {
        // Retorna o valor (email) para ser usado na mensagem internacionalizada
        return value != null ? value : "";
    }
}
