package br.com.regalaya.shared.config;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.hibernate.LazyInitializationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import br.com.regalaya.auth.exception.InvalidTokenException;
import br.com.regalaya.auth.exception.UserAlreadyExistsException;
import br.com.regalaya.shared.exception.BusinessException;
import br.com.regalaya.shared.exception.ConflictException;
import br.com.regalaya.shared.exception.InvalidCredentialsException;
import br.com.regalaya.shared.exception.ResourceNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private final MessageSource messageSource;

    @Autowired
    public GlobalExceptionHandler(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    private Locale getCurrentLocale() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                return attrs.getRequest().getLocale();
            }
        } catch (Exception e) {
            // Fallback to default
        }
        return Locale.getDefault();
    }

    private String getMessage(String code, Object... args) {
        return messageSource.getMessage(code, args, getCurrentLocale());
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ProblemDetail> handleBusinessException(BusinessException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setTitle("Business Error");
        problem.setDetail(getMessage("error.business", ex.getMessage()));
        problem.setProperty("timestamp", LocalDateTime.now());
        problem.setProperty("status", HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.badRequest().body(problem);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ProblemDetail> handleInvalidCredentials(InvalidCredentialsException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);
        problem.setTitle("Invalid Credentials");
        problem.setDetail(getMessage("error.invalid.credentials"));
        problem.setProperty("timestamp", LocalDateTime.now());
        problem.setProperty("status", HttpStatus.UNAUTHORIZED.value());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(problem);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ProblemDetail> handleAuthenticationException(AuthenticationException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);
        problem.setTitle("Authentication Error");
        problem.setDetail(getMessage("error.unauthorized"));
        problem.setProperty("timestamp", LocalDateTime.now());
        problem.setProperty("status", HttpStatus.UNAUTHORIZED.value());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(problem);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ProblemDetail> handleBadCredentials(BadCredentialsException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);
        problem.setTitle("Invalid Credentials");
        problem.setDetail(getMessage("error.invalid.credentials"));
        problem.setProperty("timestamp", LocalDateTime.now());
        problem.setProperty("status", HttpStatus.UNAUTHORIZED.value());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(problem);
    }

    @ExceptionHandler(AuthenticationCredentialsNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleAuthCredentialsNotFound(AuthenticationCredentialsNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);
        problem.setTitle("Authentication Required");
        problem.setDetail(getMessage("error.unauthorized"));
        problem.setProperty("timestamp", LocalDateTime.now());
        problem.setProperty("status", HttpStatus.UNAUTHORIZED.value());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(problem);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleResourceNotFound(ResourceNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problem.setTitle("Resource Not Found");
        // ResourceNotFoundException deve ter uma mensagem como "User not found: {0}"
        problem.setDetail(ex.getMessage()); // Já vem formatada
        problem.setProperty("timestamp", LocalDateTime.now());
        problem.setProperty("status", HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problem);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ProblemDetail> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.CONFLICT);
        problem.setTitle("User Already Exists");
        problem.setDetail(getMessage("error.user.already.exists", ex.getFieldValue()));
        problem.setProperty("timestamp", LocalDateTime.now());
        problem.setProperty("status", HttpStatus.CONFLICT.value());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(problem);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ProblemDetail> handleConflict(ConflictException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.CONFLICT);
        problem.setTitle("Conflict");
        problem.setDetail(getMessage("error.conflict", ex.getMessage()));
        problem.setProperty("timestamp", LocalDateTime.now());
        problem.setProperty("status", HttpStatus.CONFLICT.value());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(problem);
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ProblemDetail> handleInvalidToken(InvalidTokenException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setTitle("Invalid Token");
        problem.setDetail(getMessage("error.invalid.token"));
        problem.setProperty("timestamp", LocalDateTime.now());
        problem.setProperty("status", HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.badRequest().body(problem);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> handleValidationException(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setTitle("Validation Error");
        problem.setDetail(getMessage("error.validation.failed"));

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        problem.setProperty("errors", errors);
        problem.setProperty("timestamp", LocalDateTime.now());
        problem.setProperty("status", HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.badRequest().body(problem);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ProblemDetail> handleMissingParameter(MissingServletRequestParameterException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setTitle("Missing Parameter");
        problem.setDetail(getMessage("error.missing.parameter", ex.getParameterName()));
        problem.setProperty("timestamp", LocalDateTime.now());
        problem.setProperty("status", HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.badRequest().body(problem);
    }

    @ExceptionHandler(LazyInitializationException.class)
    public ResponseEntity<ProblemDetail> handleLazyInitialization(LazyInitializationException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        problem.setTitle("Lazy Initialization Error");
        problem.setDetail("Erro de inicialização tardia: " + ex.getMessage());
        problem.setProperty("timestamp", LocalDateTime.now());
        problem.setProperty("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        problem.setProperty("stackTrace", ex.getStackTrace()[0].toString());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(problem);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleGenericException(Exception ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        problem.setTitle("Internal Server Error");
        problem.setDetail(getMessage("error.internal"));
        problem.setProperty("timestamp", LocalDateTime.now());
        problem.setProperty("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        problem.setProperty("exceptionType", ex.getClass().getName());
        problem.setProperty("exceptionMessage", ex.getMessage());
        if (ex.getStackTrace().length > 0) {
            problem.setProperty("stackTrace", ex.getStackTrace()[0].toString());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(problem);
    }
}
