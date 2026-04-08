package br.com.regalaya.auth.infrastructure.email;

import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.base-url:https://regalaya.com}")
    private String baseUrl;

    @Value("${app.email.from:noreply@regalaya.local}")
    private String fromEmail;

    @Value("${app.email.from-name:Regalaya}")
    private String fromName;

    private record EmailContent(String subject, String heading, String bodyText, String buttonText, String footerText) {}

    private static final Map<String, EmailContent> PASSWORD_RESET_CONTENT = Map.of(
        "pt", new EmailContent(
            "Regalaya - Recuperação de Senha",
            "Olá, %s!",
            "Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:",
            "Redefinir Minha Senha",
            "Este link expira em 1 hora. Se você não solicitou esta alteração, ignore este email."
        ),
        "es", new EmailContent(
            "Regalaya - Recuperación de Contraseña",
            "¡Hola, %s!",
            "Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña:",
            "Restablecer Mi Contraseña",
            "Este enlace expira en 1 hora. Si no solicitaste este cambio, ignora este correo."
        ),
        "en", new EmailContent(
            "Regalaya - Password Reset",
            "Hello, %s!",
            "We received a request to reset your password. Click the button below to create a new password:",
            "Reset My Password",
            "This link expires in 1 hour. If you did not request this change, please ignore this email."
        )
    );

    private static final Map<String, EmailContent> VERIFICATION_CONTENT = Map.of(
        "pt", new EmailContent(
            "Regalaya - Verifique sua conta",
            "Olá, %s!",
            "Obrigado por se registrar na Regalaya. Para ativar sua conta, clique no botão abaixo:",
            "Verificar Minha Conta",
            "Este link expira em 24 horas. Se você não criou uma conta, ignore este email."
        ),
        "es", new EmailContent(
            "Regalaya - Verifica tu cuenta",
            "¡Hola, %s!",
            "Gracias por registrarte en Regalaya. Para activar tu cuenta, haz clic en el botón de abajo:",
            "Verificar Mi Cuenta",
            "Este enlace expira en 24 horas. Si no creaste una cuenta, ignora este correo."
        ),
        "en", new EmailContent(
            "Regalaya - Verify Your Account",
            "Hello, %s!",
            "Thank you for registering with Regalaya. To activate your account, click the button below:",
            "Verify My Account",
            "This link expires in 24 hours. If you did not create an account, please ignore this email."
        )
    );

    private static final Map<String, EmailContent> WELCOME_CONTENT = Map.of(
        "pt", new EmailContent(
            "Bem-vindo à Regalaya!",
            "Bem-vindo à Regalaya, %s!",
            "Sua conta foi criada com sucesso. Agora você pode explorar nossa coleção exclusiva de presentes.",
            "Explorar Produtos",
            null
        ),
        "es", new EmailContent(
            "¡Bienvenido a Regalaya!",
            "¡Bienvenido a Regalaya, %s!",
            "Tu cuenta ha sido creada con éxito. Ahora puedes explorar nuestra colección exclusiva de regalos.",
            "Explorar Productos",
            null
        ),
        "en", new EmailContent(
            "Welcome to Regalaya!",
            "Welcome to Regalaya, %s!",
            "Your account has been created successfully. You can now explore our exclusive collection of gifts.",
            "Explore Products",
            null
        )
    );

    @Async
    public void sendVerificationEmail(String to, String token, String userName, Locale locale, boolean isAdmin) {
        String lang = getLanguageCode(locale);
        EmailContent content = VERIFICATION_CONTENT.getOrDefault(lang, VERIFICATION_CONTENT.get("en"));
        String path = isAdmin ? "/admin/verify-account" : "/verify-account";
        String verificationLink = baseUrl + path + "?token=" + token;
        String htmlContent = buildHtmlEmail(content, userName, verificationLink);
        sendHtmlEmail(to, content.subject(), htmlContent);
    }

    @Async
    public void sendPasswordResetEmail(String to, String token, String userName, Locale locale, boolean isAdmin) {
        String lang = getLanguageCode(locale);
        EmailContent content = PASSWORD_RESET_CONTENT.getOrDefault(lang, PASSWORD_RESET_CONTENT.get("en"));
        String path = isAdmin ? "/admin/reset-password" : "/reset-password";
        String resetLink = baseUrl + path + "?token=" + token;
        String htmlContent = buildHtmlEmail(content, userName, resetLink);
        sendHtmlEmail(to, content.subject(), htmlContent);
    }

    @Async
    public void sendAccountWelcomeEmail(String to, String userName, Locale locale, boolean isAdmin) {
        String lang = getLanguageCode(locale);
        EmailContent content = WELCOME_CONTENT.getOrDefault(lang, WELCOME_CONTENT.get("en"));
        String htmlContent = buildWelcomeHtml(content, userName);
        sendHtmlEmail(to, content.subject(), htmlContent);
    }

    private String getLanguageCode(Locale locale) {
        if (locale == null) return "pt";
        String lang = locale.getLanguage();
        return switch (lang) {
            case "es" -> "es";
            case "en" -> "en";
            default -> "pt";
        };
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email enviado com sucesso para: {}", to);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Falha ao enviar email para {}: {}", to, e.getMessage());
        }
    }

    private String buildHtmlEmail(EmailContent content, String userName, String link) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: 'Manrope', sans-serif; background: #fcf9f8; padding: 40px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px;">
                    <h1 style="color: #775a19; font-family: 'Noto Serif', serif;">%s</h1>
                    <p style="color: #788090;">%s</p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="%s" style="background: #be7374; color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 14px;">
                            %s
                        </a>
                    </div>
                    <p style="color: #788090; font-size: 12px;">%s</p>
                </div>
            </body>
            </html>
            """.formatted(content.heading().formatted(userName), content.bodyText(), link, content.buttonText(), content.footerText());
    }

    private String buildWelcomeHtml(EmailContent content, String userName) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: 'Manrope', sans-serif; background: #fcf9f8; padding: 40px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px;">
                    <h1 style="color: #775a19; font-family: 'Noto Serif', serif;">%s</h1>
                    <p style="color: #788090;">%s</p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="%s" style="background: #775a19; color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 14px;">
                            %s
                        </a>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(content.heading().formatted(userName), content.bodyText(), baseUrl, content.buttonText());
    }
}
