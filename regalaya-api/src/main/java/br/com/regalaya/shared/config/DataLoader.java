package br.com.regalaya.shared.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import br.com.regalaya.auth.domain.model.Role;
import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.auth.repository.UserRepository;
import br.com.regalaya.category.domain.model.Category;
import br.com.regalaya.category.repository.CategoryRepository;
import br.com.regalaya.order.domain.model.Order;
import br.com.regalaya.order.domain.model.OrderItem;
import br.com.regalaya.order.domain.model.OrderStatus;
import br.com.regalaya.order.repository.OrderItemRepository;
import br.com.regalaya.order.repository.OrderRepository;
import br.com.regalaya.product.domain.model.Product;
import br.com.regalaya.product.repository.ProductRepository;

@Component
@Profile("dev")
public class DataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataLoader.class);

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public DataLoader(CategoryRepository categoryRepository,
                      ProductRepository productRepository,
                      UserRepository userRepository,
                      OrderRepository orderRepository,
                      OrderItemRepository orderItemRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            log.info("Data already seeded. Skipping DataLoader.");
            return;
        }

        log.info("Seeding database with initial data...");
        seedCategories();
        seedProducts();
        seedUsers();
        seedOrders();
        log.info("Database seeding completed successfully.");
    }

    private void seedCategories() {
        log.info("Seeding categories...");
        List<Category> categories = List.of(
            Category.builder().name("Chocolates").slug("chocolates").description("Chocolates artesanais e premium").sortOrder(1).isActive(true).build(),
            Category.builder().name("Flores").slug("flores").description("Buquês e arranjos florais").sortOrder(2).isActive(true).build(),
            Category.builder().name("Bebidas").slug("bebidas").description("Vinhos, Champagnes e mais").sortOrder(3).isActive(true).build(),
            Category.builder().name("Bem-estar").slug("bem-estar").description("Spa e relaxamento").sortOrder(4).isActive(true).build(),
            Category.builder().name("Acessórios").slug("acessorios").description("Relógios, joias e acessórios").sortOrder(5).isActive(true).build(),
            Category.builder().name("Personalizados").slug("personalizados").description("Presentes únicos e personalizados").sortOrder(6).isActive(true).build(),
            Category.builder().name("Decoração").slug("decoracao").description("Itens decorativos para casa").sortOrder(7).isActive(true).build(),
            Category.builder().name("Experiências").slug("experiencias").description("Vouchers de experiências").sortOrder(8).isActive(true).build(),
            Category.builder().name("Cestas de Presentes").slug("cestas-de-presentes").description("Cestas completas para presentear").sortOrder(9).isActive(true).build(),
            Category.builder().name("Livros e Papelaria").slug("livros-e-papelaria").description("Livros, agendas e itens de papelaria").sortOrder(10).isActive(true).build(),
            Category.builder().name("Eletrônicos").slug("eletronicos").description("Gadgets e acessórios tecnológicos").sortOrder(11).isActive(true).build(),
            Category.builder().name("Casa e Cozinha").slug("casa-e-cozinha").description("Itens práticos e decorativos").sortOrder(12).isActive(true).build()
        );
        categoryRepository.saveAll(categories);
        log.info("Seeded {} categories", categories.size());
    }

    private void seedProducts() {
        log.info("Seeding products...");
        List<Category> categories = categoryRepository.findAll();
        Random random = new Random();

        List<Product> products = List.of(
            buildProduct("Caixa de Bombons Belga", "caixa-bombons-belga", "Caixa com 12 chocolates belgas de diferentes sabores. Perfeito para presentear em qualquer ocasião.", "12 chocolates belgas artesanais", new BigDecimal("89.90"), new BigDecimal("109.90"), "CHOC-001", 50, getCategory(categories, "chocolates"), List.of("/images/products/chocolates.jpg")),
            buildProduct("Buquê de Flores Artesanais", "bouquet-flores-artesanais", "Buquê preparado com flores frescas e artesanais. Ideal para aniversários e celebrações.", "Flores artesanais exclusivas", new BigDecimal("159.90"), null, "FLO-001", 20, getCategory(categories, "flores"), List.of("/images/products/flores.jpg")),
            buildProduct("Vinho Tinto Premium", "vinho-tinto-premium", "Garrafa de vinho tinto premium com notas de carvalho. Seleção especial para apreciadores.", "Vinho tinto reserva", new BigDecimal("289.90"), new BigDecimal("349.90"), "VIN-001", 15, getCategory(categories, "bebidas"), List.of("/images/products/vinho.jpg")),
            buildProduct("Kit Spa Relaxante", "kit-spa-relaxante", "Kit completo com óleos essenciais, velas aromáticas e sais de banho para momentos de relaxamento.", "Kit completo de spa em casa", new BigDecimal("199.90"), null, "SPA-001", 30, getCategory(categories, "bem-estar"), List.of("/images/products/spa.jpg")),
            buildProduct("Relógio Elegante", "relogio-elegante", "Relógio com design elegante e pulseira de couro legítimo. Resistência à água IP67.", "Design clássico e elegante", new BigDecimal("459.90"), new BigDecimal("599.90"), "REL-001", 10, getCategory(categories, "acessorios"), List.of("/images/products/joias.jpg")),
            buildProduct("Caneca Personalizada", "caneca-personalizada", "Caneca térmica personalizada com mensagem especial. Mantém bebidas quentes por até 12 horas.", "Caneca térmica personalizada", new BigDecimal("79.90"), null, "CAN-001", 100, getCategory(categories, "personalizados"), List.of("/images/products/perfume.jpg")),
            buildProduct("Almofada Decorativa", "almofada-decorativa", "Almofada decorativa com estampa exclusiva. Tecido 100% algodão.", "Conforto e estilo", new BigDecimal("89.90"), null, "ALM-001", 45, getCategory(categories, "decoracao"), List.of("/images/products/chocolates.jpg")),
            buildProduct("Porta-joias Artesanal", "porta-joias-artesanal", "Porta-joias de madeira artesanal com veludo interno. Compartimentos organizados.", "Elegância e organização", new BigDecimal("129.90"), null, "JOI-001", 25, getCategory(categories, "decoracao"), List.of("/images/products/joias.jpg")),
            buildProduct("Cesta de Café da Manhã", "cesta-cafe-manha", "Cesta completa com pães, queijos, frutas e sucos naturais. Perfeita para surpreender.", "Cesta gourmet completa", new BigDecimal("249.90"), new BigDecimal("299.90"), "CES-001", 18, getCategory(categories, "cestas-de-presentes"), List.of("/images/products/cesta.jpg")),
            buildProduct("Jogo de Panelas Premium", "jogo-panelas-premium", "Jogo com 7 peças em aço inox. Antiaderente e compatível com indução.", "7 peças em aço inox", new BigDecimal("599.90"), new BigDecimal("799.90"), "PAN-001", 8, getCategory(categories, "casa-e-cozinha"), List.of("/images/products/panelas.jpg")),
            buildProduct("Fone Bluetooth Premium", "fone-bluetooth-premium", "Fone de ouvido sem fio com cancelamento de ruído ativo. Bateria de 30 horas.", "Cancelamento de ruído ativo", new BigDecimal("349.90"), new BigDecimal("449.90"), "FON-001", 22, getCategory(categories, "eletronicos"), List.of("/images/products/fone.jpg")),
            buildProduct("Vale Experiência Gourmet", "vale-experiencia-gourmet", "Voucher para jantar em restaurante estrelado. Válido para 2 pessoas.", "Jantar para 2 pessoas", new BigDecimal("499.90"), null, "EXP-001", 50, getCategory(categories, "experiencias"), List.of("/images/products/experiencia.jpg"))
        );
        productRepository.saveAll(products);
        log.info("Seeded {} products", products.size());
    }

    private void seedUsers() {
        log.info("Seeding users...");
        if (userRepository.count() > 0) {
            log.info("Users already exist. Skipping.");
            return;
        }

        List<User> users = List.of(
            buildUser("Administrador Principal", "admin@regalaya.com.br", "$2a$10$XoLvF5C2dz9.7Cq3OqMjGOs7qYnqCj6KqJm6KqJm6KqJm6KqJm6Kq", Role.ADMIN, "ACTIVE", true),
            buildUser("João Silva", "joao@email.com", "$2a$10$XoLvF5C2dz9.7Cq3OqMjGOs7qYnqCj6KqJm6KqJm6KqJm6KqJm6Kq", Role.CLIENT, "ACTIVE", true),
            buildUser("Maria Santos", "maria@email.com", "$2a$10$XoLvF5C2dz9.7Cq3OqMjGOs7qYnqCj6KqJm6KqJm6KqJm6KqJm6Kq", Role.CLIENT, "ACTIVE", true),
            buildUser("Pedro Costa", "pedro@email.com", "$2a$10$XoLvF5C2dz9.7Cq3OqMjGOs7qYnqCj6KqJm6KqJm6KqJm6KqJm6Kq", Role.CLIENT, "ACTIVE", true),
            buildUser("Ana Oliveira", "ana@email.com", "$2a$10$XoLvF5C2dz9.7Cq3OqMjGOs7qYnqCj6KqJm6KqJm6KqJm6KqJm6Kq", Role.CLIENT, "ACTIVE", true),
            buildUser("Carlos Lima", "carlos@email.com", "$2a$10$XoLvF5C2dz9.7Cq3OqMjGOs7qYnqCj6KqJm6KqJm6KqJm6KqJm6Kq", Role.CLIENT, "ACTIVE", true),
            buildUser("Fernanda Souza", "fernanda@email.com", "$2a$10$XoLvF5C2dz9.7Cq3OqMjGOs7qYnqCj6KqJm6KqJm6KqJm6KqJm6Kq", Role.CLIENT, "ACTIVE", true),
            buildUser("Ricardo Alves", "ricardo@email.com", "$2a$10$XoLvF5C2dz9.7Cq3OqMjGOs7qYnqCj6KqJm6KqJm6KqJm6KqJm6Kq", Role.CLIENT, "ACTIVE", true)
        );
        userRepository.saveAll(users);
        log.info("Seeded {} users", users.size());
    }

    private void seedOrders() {
        log.info("Seeding orders...");
        List<User> customers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.CLIENT)
                .toList();
        List<Product> products = productRepository.findAll();
        Random random = new Random();

        OrderStatus[] statuses = OrderStatus.values();
        String[] paymentMethods = {"credit_card", "pix", "debit_card", "boleto"};
        String[] paymentStatuses = {"paid", "pending", "failed"};

        List<Order> orders = new ArrayList<>();
        List<OrderItem> allItems = new ArrayList<>();

        for (int i = 0; i < 25; i++) {
            User customer = customers.get(random.nextInt(customers.size()));
            OrderStatus status = statuses[random.nextInt(statuses.length)];
            String paymentMethod = paymentMethods[random.nextInt(paymentMethods.length)];
            String paymentStatus = status == OrderStatus.CANCELLED ? "failed" : 
                                   status == OrderStatus.PENDING ? "pending" : "paid";

            int daysAgo = random.nextInt(60);
            LocalDateTime createdAt = LocalDateTime.now().minusDays(daysAgo)
                    .withHour(8 + random.nextInt(12))
                    .withMinute(random.nextInt(60));

            Order order = new Order();
            order.setOrderNumber(String.format("REG-2026-%04d", i + 1));
            order.setCustomerName(customer.getName());
            order.setCustomerEmail(customer.getEmail());
            order.setCustomerPhone("+55 11 99999-" + String.format("%04d", random.nextInt(10000)));
            order.setStatus(status);
            order.setPaymentMethod(paymentMethod);
            order.setPaymentStatus(paymentStatus);
            order.setNotes("");
            order.setShippingAddress("");
            if (status == OrderStatus.SHIPPED || status == OrderStatus.DELIVERED) {
                order.setTrackingCode("BR" + (100000000 + random.nextInt(900000000)));
            }

            int itemCount = 1 + random.nextInt(4);
            BigDecimal subtotal = BigDecimal.ZERO;
            List<OrderItem> items = new ArrayList<>();

            for (int j = 0; j < itemCount; j++) {
                Product product = products.get(random.nextInt(products.size()));
                int quantity = 1 + random.nextInt(3);
                BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
                subtotal = subtotal.add(itemTotal);

                OrderItem item = OrderItem.builder()
                        .productName(product.getName())
                        .productSku(product.getSku())
                        .quantity(quantity)
                        .unitPrice(product.getPrice())
                        .total(itemTotal)
                        .imageUrl(product.getImages() != null && !product.getImages().equals("[]") ? 
                                extractFirstImage(product.getImages()) : "")
                        .build();
                items.add(item);
            }

            BigDecimal shipping = subtotal.compareTo(new BigDecimal("299.90")) >= 0 ? BigDecimal.ZERO : new BigDecimal("29.90");
            BigDecimal discount = random.nextInt(10) == 0 ? subtotal.multiply(new BigDecimal("0.10")) : BigDecimal.ZERO;
            BigDecimal total = subtotal.add(shipping).subtract(discount);

            order.setSubtotal(subtotal);
            order.setShipping(shipping);
            order.setDiscount(discount);
            order.setTotal(total);

            orders.add(order);
            allItems.addAll(items);
        }

        orderRepository.saveAll(orders);

        for (int i = 0; i < allItems.size(); i++) {
            allItems.get(i).setOrder(orders.get(i / 3));
        }
        orderItemRepository.saveAll(allItems);

        log.info("Seeded {} orders with {} items", orders.size(), allItems.size());
    }

    private Product buildProduct(String name, String slug, String description, String shortDescription,
                                  BigDecimal price, BigDecimal compareAtPrice, String sku, Integer stock,
                                  Category category, List<String> images) {
        String imagesJson = "[\"" + String.join("\",\"", images) + "\"]";
        return Product.builder()
                .name(name)
                .slug(slug)
                .description(description)
                .shortDescription(shortDescription)
                .price(price)
                .compareAtPrice(compareAtPrice)
                .sku(sku)
                .stock(stock)
                .isActive(true)
                .images(imagesJson)
                .category(category)
                .build();
    }

    private User buildUser(String name, String email, String password, Role role, String status, boolean emailVerified) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        user.setStatus(status);
        user.setEmailVerified(emailVerified);
        return user;
    }

    private Category getCategory(List<Category> categories, String slug) {
        return categories.stream()
                .filter(c -> c.getSlug().equals(slug))
                .findFirst()
                .orElse(null);
    }

    private String extractFirstImage(String imagesJson) {
        if (imagesJson == null || imagesJson.length() <= 2) return "";
        int start = imagesJson.indexOf('"') + 1;
        int end = imagesJson.indexOf('"', start);
        if (start > 0 && end > start) {
            return imagesJson.substring(start, end);
        }
        return "";
    }
}
