package br.com.regalaya.product.service;

import br.com.regalaya.product.domain.model.Product;
import br.com.regalaya.product.domain.model.Tag;
import br.com.regalaya.product.repository.ProductRepository;
import br.com.regalaya.product.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Popula a tabela de tags e associa aos produtos existentes.
 * Executado uma vez na inicialização — idempotente (não duplica dados).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class TagDataInitializer implements ApplicationRunner {

    private final TagRepository tagRepository;
    private final ProductRepository productRepository;

    // Mapa: palavra-chave no nome/descrição do produto → lista de tags a associar
    private static final Map<String, List<String>> KEYWORD_TO_TAGS = new LinkedHashMap<>();

    static {
        // Bebidas
        KEYWORD_TO_TAGS.put("vinho", List.of("vinho", "bebida", "harmonização", "presente-gourmet", "adulto", "luxo"));
        KEYWORD_TO_TAGS.put("espumante", List.of("espumante", "bebida", "celebração", "casamento", "aniversário", "luxo"));
        KEYWORD_TO_TAGS.put("cerveja", List.of("cerveja", "bebida", "informal", "masculino"));
        KEYWORD_TO_TAGS.put("whisky", List.of("whisky", "bebida", "premium", "masculino", "luxo", "adulto"));
        KEYWORD_TO_TAGS.put("gin", List.of("gin", "bebida", "premium", "adulto"));
        KEYWORD_TO_TAGS.put("cachaça", List.of("cachaça", "bebida", "nacional", "adulto"));

        // Alimentação / Gourmet
        KEYWORD_TO_TAGS.put("chocolate", List.of("chocolate", "doce", "gourmet", "presente-gourmet", "romântico", "aniversário"));
        KEYWORD_TO_TAGS.put("azeite", List.of("azeite", "gourmet", "culinária", "presente-gourmet", "luxo"));
        KEYWORD_TO_TAGS.put("queijo", List.of("queijo", "gourmet", "harmonização", "presente-gourmet"));
        KEYWORD_TO_TAGS.put("cesta", List.of("cesta", "kit", "presente-gourmet", "luxo", "dia-dos-pais", "dia-das-maes"));
        KEYWORD_TO_TAGS.put("café", List.of("café", "bebida", "gourmet", "manhã", "presente-corporativo"));
        KEYWORD_TO_TAGS.put("chá", List.of("chá", "bebida", "bem-estar", "relaxamento", "saúde"));

        // Bem-Estar / Saúde
        KEYWORD_TO_TAGS.put("spa", List.of("spa", "bem-estar", "relaxamento", "feminino", "luxo", "mãe"));
        KEYWORD_TO_TAGS.put("aromaterapia", List.of("aromaterapia", "bem-estar", "relaxamento", "saúde"));
        KEYWORD_TO_TAGS.put("vela", List.of("vela", "bem-estar", "relaxamento", "decoração", "romântico", "aromaterapia"));
        KEYWORD_TO_TAGS.put("massagem", List.of("massagem", "bem-estar", "relaxamento", "saúde", "spa"));
        KEYWORD_TO_TAGS.put("skincare", List.of("skincare", "beleza", "cuidados", "feminino", "luxo"));
        KEYWORD_TO_TAGS.put("perfume", List.of("perfume", "beleza", "luxo", "romântico", "feminino", "masculino"));
        KEYWORD_TO_TAGS.put("kit", List.of("kit", "presente-completo", "curadoria"));

        // Decoração / Casa
        KEYWORD_TO_TAGS.put("décor", List.of("decoração", "casa", "presente-casa", "luxo"));
        KEYWORD_TO_TAGS.put("decor", List.of("decoração", "casa", "presente-casa", "luxo"));
        KEYWORD_TO_TAGS.put("quadro", List.of("decoração", "arte", "casa", "presente-casa"));
        KEYWORD_TO_TAGS.put("planta", List.of("plantas", "natureza", "casa", "bem-estar", "sustentável"));
        KEYWORD_TO_TAGS.put("xícara", List.of("utensílios", "café", "chá", "casa", "presente-casa"));
        KEYWORD_TO_TAGS.put("taça", List.of("utensílios", "vinho", "bebida", "casa", "presente-casa"));

        // Moda / Acessórios
        KEYWORD_TO_TAGS.put("joia", List.of("joia", "acessório", "luxo", "feminino", "romântico", "aniversário"));
        KEYWORD_TO_TAGS.put("pulseira", List.of("pulseira", "joia", "acessório", "feminino", "romântico"));
        KEYWORD_TO_TAGS.put("colar", List.of("colar", "joia", "acessório", "feminino", "luxo", "romântico"));
        KEYWORD_TO_TAGS.put("bolsa", List.of("bolsa", "moda", "feminino", "luxo", "acessório"));
        KEYWORD_TO_TAGS.put("carteira", List.of("carteira", "moda", "masculino", "acessório", "presente-corporativo"));
        KEYWORD_TO_TAGS.put("relógio", List.of("relógio", "acessório", "masculino", "luxo", "presente-corporativo"));

        // Ocasiões
        KEYWORD_TO_TAGS.put("namorad", List.of("romântico", "dia-dos-namorados", "casal", "amor"));
        KEYWORD_TO_TAGS.put("casamento", List.of("casamento", "celebração", "casal", "noivado"));
        KEYWORD_TO_TAGS.put("bebê", List.of("bebê", "maternidade", "recém-nascido", "chá-de-bebê"));
        KEYWORD_TO_TAGS.put("bebe", List.of("bebê", "maternidade", "recém-nascido"));
        KEYWORD_TO_TAGS.put("infantil", List.of("infantil", "criança", "brinquedo", "aniversário-infantil"));
        KEYWORD_TO_TAGS.put("mãe", List.of("mãe", "dia-das-maes", "feminino", "família", "afeto"));
        KEYWORD_TO_TAGS.put("pai", List.of("pai", "dia-dos-pais", "masculino", "família"));
        KEYWORD_TO_TAGS.put("corporativo", List.of("presente-corporativo", "empresarial", "profissional", "networking"));
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        try {
            long tagCount = tagRepository.count();
            log.info("Tags existentes no banco: {}", tagCount);

            // 1. Garantir que todas as tags existam
            Set<String> allTagNames = new LinkedHashSet<>();
            KEYWORD_TO_TAGS.values().forEach(allTagNames::addAll);
            // Tags de ocasião padrão
            allTagNames.addAll(List.of(
                "aniversário", "natal", "dia-das-maes", "dia-dos-pais", "dia-dos-namorados",
                "casamento", "formatura", "chá-de-bebê", "presente-corporativo",
                "luxo", "premium", "gourmet", "sustentável", "artesanal",
                "masculino", "feminino", "unissex", "infantil",
                "até-50", "até-100", "até-200", "acima-200"
            ));

            Map<String, Tag> tagMap = new HashMap<>();
            for (String name : allTagNames) {
                Tag tag = tagRepository.findByName(name)
                    .orElseGet(() -> tagRepository.save(Tag.builder().name(name).build()));
                tagMap.put(name, tag);
            }
            log.info("Total de tags garantidas: {}", tagMap.size());

            // 2. Associar tags aos produtos com base em palavras-chave
            List<Product> products = productRepository.findAll();
            int updated = 0;
            for (Product product : products) {
                Set<Tag> productTags = new HashSet<>(product.getTagSet());
                String searchText = (
                    product.getName() + " " +
                    (product.getDescription() != null ? product.getDescription() : "") + " " +
                    (product.getShortDescription() != null ? product.getShortDescription() : "") + " " +
                    (product.getTags() != null ? product.getTags() : "")
                ).toLowerCase();

                // Adiciona tag de faixa de preço
                if (product.getPrice() != null) {
                    double price = product.getPrice().doubleValue();
                    if (price <= 50 && tagMap.containsKey("até-50")) productTags.add(tagMap.get("até-50"));
                    else if (price <= 100 && tagMap.containsKey("até-100")) productTags.add(tagMap.get("até-100"));
                    else if (price <= 200 && tagMap.containsKey("até-200")) productTags.add(tagMap.get("até-200"));
                    else if (tagMap.containsKey("acima-200")) productTags.add(tagMap.get("acima-200"));
                }

                // Associa tags por keyword no conteúdo do produto
                for (Map.Entry<String, List<String>> entry : KEYWORD_TO_TAGS.entrySet()) {
                    if (searchText.contains(entry.getKey().toLowerCase())) {
                        for (String tagName : entry.getValue()) {
                            if (tagMap.containsKey(tagName)) {
                                productTags.add(tagMap.get(tagName));
                            }
                        }
                    }
                }

                if (!productTags.equals(product.getTagSet())) {
                    product.setTagSet(productTags);
                    productRepository.save(product);
                    updated++;
                    log.debug("Produto '{}' → {} tags associadas", product.getName(), productTags.size());
                }
            }
            log.info("TagDataInitializer concluído: {} produtos atualizados com tags.", updated);
        } catch (Exception e) {
            log.error("Erro ao inicializar tags: {}", e.getMessage(), e);
        }
    }
}
