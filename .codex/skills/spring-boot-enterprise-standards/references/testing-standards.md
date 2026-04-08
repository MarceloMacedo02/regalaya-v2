# Testing Standards - Spring Boot Enterprise

## Estrutura de Testes

```
src/test/java/br/com/plataforma/conexaodigital/
├── shared/
│   └── TestDataFactory.java
├── [modulo]/
│   ├── controller/
│   ├── services/
│   ├── repository/
│   ├── mapper/
│   └── arch/
└── integration/
```

## Testes Unitários - Padrão

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private UserMapper userMapper;
    
    @InjectMocks
    private UserServiceImpl userService;
    
    @Test
    @DisplayName("Should create user successfully")
    void shouldCreateUserSuccessfully() {
        // Arrange
        CreateUserRequest request = createUserRequest();
        User user = createUser();
        UserResponse expected = createUserResponse();
        
        when(userRepository.existsByEmail(request.email())).thenReturn(false);
        when(userMapper.toEntity(request)).thenReturn(user);
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toResponse(user)).thenReturn(expected);
        
        // Act
        UserResponse result = userService.createUser(request);
        
        // Assert
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(expected.id());
        
        verify(userRepository).existsByEmail(request.email());
        verify(userMapper).toEntity(request);
        verify(userRepository).save(user);
    }
}
```

## Testes de Repository

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class UserRepositoryTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    @DisplayName("Should find user by email")
    void shouldFindUserByEmail() {
        // Arrange
        User user = createUser();
        userRepository.save(user);
        
        // Act
        Optional<User> found = userRepository.findByEmail(user.getEmail());
        
        // Assert
        assertThat(found).isPresent();
    }
}
```

## Testes de Controller

```java
@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserService userService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    @DisplayName("Should create user and return 201")
    void shouldCreateUserAndReturn201() throws Exception {
        CreateUserRequest request = createUserRequest();
        UserResponse response = createUserResponse();
        
        when(userService.createUser(any())).thenReturn(response);
        
        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists());
    }
}
```

## Testes ArchUnit

```java
@AnalyzeClasses(packages = "br.com.plataforma.conexaodigital")
class ArchitectureTest {
    
    @ArchTest
    static final ArchRule no_field_injection = 
        noFields().should().beAnnotatedWith(Autowired.class);
    
    @ArchTest
    static final ArchRule dtos_should_be_records = 
        classes()
            .that().haveSimpleNameEndingWith("Request")
            .or().haveSimpleNameEndingWith("Response")
            .should().beRecords();
    
    @ArchTest
    static final ArchRule controllers_should_not_access_repositories_directly = 
        noClasses()
            .that().resideInAPackage("..controller..")
            .should().accessClassesThat().resideInAPackage("..repository..");
}
```

## Cobertura Mínima

- Linhas: 80%
- Branches: 70%
- Metodos: 80%
- Classes: 100%
