package br.com.regalaya.auth.infrastructure.jwt;

import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Set;
import java.util.UUID;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@SuppressWarnings("unchecked")
public class JwtUtil {

    private static final String CLAIM_JTI = "jti";
    private static final String CLAIM_TYPE = "type";

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private Long expiration;

    @Value("${app.jwt.refresh-expiration}")
    private Long refreshExpiration;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateAccessToken(UUID userId, String email, Set<String> roles) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        String jti = UUID.randomUUID().toString();

        return Jwts.builder()
                .setId(jti)
                .setSubject(userId.toString())
                .claim("email", email)
                .claim("roles", roles)
                .claim("role", extractRoleName(roles))
                .claim(CLAIM_TYPE, "access")
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    private String extractRoleName(Set<String> permissions) {
        if (permissions.contains("ROLE_CREATE_USER")) return "ADMIN";
        if (permissions.contains("ROLE_MANAGE_SYSTEM")) return "ADMIN";
        return "USER";
    }

    public String generateRefreshToken(UUID userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshExpiration);
        String jti = UUID.randomUUID().toString();

        return Jwts.builder()
                .setId(jti)
                .setSubject(userId.toString())
                .claim(CLAIM_TYPE, "refresh")
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getJtiFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getId();
    }

    public UUID validateAccessToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return UUID.fromString(claims.getSubject());
    }

    public UUID validateRefreshToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return UUID.fromString(claims.getSubject());
    }

    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("email", String.class);
    }

    public Set<String> getRolesFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("roles", Set.class);
    }

    public LocalDateTime getExpirationFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        Date expiration = claims.getExpiration();
        return LocalDateTime.ofInstant(expiration.toInstant(), ZoneId.systemDefault());
    }

    public Long getExpirationInMillisFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        Date expiration = claims.getExpiration();
        Date now = new Date();
        return expiration.getTime() - now.getTime();
    }

    public UUID getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return UUID.fromString(claims.getSubject());
    }

    public String getTokenType(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get(CLAIM_TYPE, String.class);
    }

    public boolean isTokenExpired(String token) {
        try {
            Date expiration = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}
