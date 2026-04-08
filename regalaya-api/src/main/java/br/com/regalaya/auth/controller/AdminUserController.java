package br.com.regalaya.auth.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import br.com.regalaya.auth.domain.model.User;
import br.com.regalaya.auth.domain.model.UserPlan;
import br.com.regalaya.auth.dto.responses.AdminUserResponse;
import br.com.regalaya.auth.repository.UserRepository;
import br.com.regalaya.order.repository.OrderRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/v1/admin/users")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin - Users", description = "Admin user management endpoints")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class AdminUserController {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AdminUserController(UserRepository userRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping
    @Operation(summary = "List all users", description = "Returns a paginated list of all users with order statistics")
    public ResponseEntity<Page<AdminUserResponse>> findAll(
            @Parameter(description = "Pagination parameters")
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(userRepository.findAll(pageable).map(this::toAdminResponse));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Returns detailed information about a specific user")
    public ResponseEntity<AdminUserResponse> findById(
            @Parameter(description = "User ID")
            @PathVariable UUID id) {
        return userRepository.findById(id)
                .map(this::toAdminResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    @Operation(summary = "Search users", description = "Search users by name, email or phone")
    public ResponseEntity<List<AdminUserResponse>> search(
            @Parameter(description = "Search query")
            @RequestParam String q) {
        List<User> users = userRepository.findAll((root, query, cb) -> {
            var name = cb.lower(root.get("name"));
            var email = cb.lower(root.get("email"));
            var phone = cb.lower(root.get("phone"));
            var search = cb.literal("%" + q.toLowerCase() + "%");
            return cb.or(
                    cb.like(name, search),
                    cb.like(email, search),
                    cb.like(phone, search)
            );
        });
        return ResponseEntity.ok(users.stream().map(this::toAdminResponse).collect(Collectors.toList()));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get user statistics", description = "Returns statistics about users")
    public ResponseEntity<UserStatsResponse> getStats() {
        long totalUsers = userRepository.count();
        return ResponseEntity.ok(new UserStatsResponse(totalUsers));
    }

    private AdminUserResponse toAdminResponse(User user) {
        long orderCount = orderRepository.countByUserId(user.getId());
        var totalSpent = orderRepository.sumTotalByUserId(user.getId());

        UserPlan plan = user.getPlan() != null ? user.getPlan() : UserPlan.FREE;

        return new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                plan.name(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                orderCount,
                totalSpent
        );
    }

    public record UserStatsResponse(long totalUsers) {}
}
