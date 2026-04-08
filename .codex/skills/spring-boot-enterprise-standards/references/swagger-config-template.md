# Swagger/OpenAPI Configuration Template

## OpenApiConfig

```java
@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("API Documentation")
                .version("1.0.0")
                .description("API documentation for the platform")
                .contact(new Contact()
                    .name("Support")
                    .email("support@company.com"))
                .license(new License()
                    .name("Apache 2.0")
                    .url("https://www.apache.org/licenses/LICENSE-2.0")))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            .components(new Components()
                .addSecuritySchemes("bearerAuth", 
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
    }
}
```

## Controller Documentation

```java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management operations")
public class UserController {
    
    private final UserService userService;
    
    @PostMapping
    @Operation(
        summary = "Create a new user",
        description = "Creates a new user with the provided information"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "User created successfully",
            content = @Content(schema = @Schema(implementation = UserResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input data",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class))
        ),
        @ApiResponse(
            responseCode = "409",
            description = "Email already exists",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class))
        )
    })
    public ResponseEntity<UserResponse> create(
            @Valid @RequestBody 
            @Parameter(description = "User creation request", required = true)
            CreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(userService.createUser(request));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Find user by ID")
    @ApiResponse(responseCode = "200", description = "User found")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<UserResponse> findById(
            @Parameter(description = "User ID", required = true)
            @PathVariable UUID id) {
        return ResponseEntity.ok(userService.findById(id));
    }
    
    @GetMapping
    @Operation(summary = "List users with pagination")
    public ResponseEntity<Page<UserResponse>> findAll(
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(userService.findAll(pageable));
    }
}
```

## Schema Documentation

```java
@Schema(description = "User creation request")
public record CreateUserRequest(
    @Schema(description = "User name", example = "John Doe", minLength = 2, maxLength = 100)
    @NotBlank
    @Size(min = 2, max = 100)
    String name,

    @Schema(description = "User email", example = "john@example.com")
    @NotBlank
    @Email
    String email,

    @Schema(description = "User role", example = "USER", allowableValues = {"ADMIN", "USER", "MANAGER"})
    @NotNull
    UserRole role
) {}

@Schema(description = "User response")
public record UserResponse(
    @Schema(description = "User ID", example = "550e8400-e29b-41d4-a716-446655440000")
    UUID id,
    
    @Schema(description = "User name", example = "John Doe")
    String name,
    
    @Schema(description = "User email", example = "john@example.com")
    String email,
    
    @Schema(description = "User status", example = "ACTIVE")
    UserStatus status,
    
    @Schema(description = "Creation timestamp")
    LocalDateTime createdAt
) {}
```

## Configuracao application.yml

```yaml
springdoc:
  api-docs:
    path: /api-docs
    enabled: true
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
    operationsSorter: method
    tagsSorter: alpha
  show-actuator: true
  default-produces-media-type: application/json
  default-consumes-media-type: application/json
```

## Acesso

- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api-docs
