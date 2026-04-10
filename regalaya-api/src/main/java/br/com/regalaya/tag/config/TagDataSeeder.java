package br.com.regalaya.tag.config;

import br.com.regalaya.tag.domain.model.Tag;
import br.com.regalaya.tag.domain.model.TagKeyword;
import br.com.regalaya.tag.repository.TagKeywordRepository;
import br.com.regalaya.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class TagDataSeeder implements ApplicationRunner {

    private final TagRepository tagRepository;
    private final TagKeywordRepository tagKeywordRepository;

    private static final Map<String, List<String>> KEYWORD_TO_TAGS = new LinkedHashMap<>();

    static {
        KEYWORD_TO_TAGS.put("vinho", List.of("vinho", "bebida", "harmonização", "presente-gourmet", "adulto", "luxo"));
        KEYWORD_TO_TAGS.put("espumante", List.of("espumante", "bebida", "celebração", "casamento", "aniversário", "luxo"));
        KEYWORD_TO_TAGS.put("cerveja", List.of("cerveja", "bebida", "informal", "masculino"));
        KEYWORD_TO_TAGS.put("whisky", List.of("whisky", "bebida", "premium", "masculino", "luxo", "adulto"));
        KEYWORD_TO_TAGS.put("gin", List.of("gin", "bebida", "premium", "adulto"));
        KEYWORD_TO_TAGS.put("cachaça", List.of("cachaça", "bebida", "nacional", "adulto"));
        KEYWORD_TO_TAGS.put("chocolate", List.of("chocolate", "doce", "gourmet", "presente-gourmet", "romântico", "aniversário"));
        KEYWORD_TO_TAGS.put("azeite", List.of("azeite", "gourmet", "culinária", "presente-gourmet", "luxo"));
        KEYWORD_TO_TAGS.put("queijo", List.of("queijo", "gourmet", "harmonização", "presente-gourmet"));
        KEYWORD_TO_TAGS.put("cesta", List.of("cesta", "kit", "presente-gourmet", "luxo", "dia-dos-pais", "dia-das-maes"));
        KEYWORD_TO_TAGS.put("café", List.of("café", "bebida", "gourmet", "manhã", "presente-corporativo"));
        KEYWORD_TO_TAGS.put("chá", List.of("chá", "bebida", "bem-estar", "relaxamento", "saúde"));
        KEYWORD_TO_TAGS.put("spa", List.of("spa", "bem-estar", "relaxamento", "feminino", "luxo", "mãe"));
        KEYWORD_TO_TAGS.put("aromaterapia", List.of("aromaterapia", "bem-estar", "relaxamento", "saúde"));
        KEYWORD_TO_TAGS.put("vela", List.of("vela", "bem-estar", "relaxamento", "decoração", "romântico", "aromaterapia"));
        KEYWORD_TO_TAGS.put("massagem", List.of("massagem", "bem-estar", "relaxamento", "saúde", "spa"));
        KEYWORD_TO_TAGS.put("skincare", List.of("skincare", "beleza", "cuidados", "feminino", "luxo"));
        KEYWORD_TO_TAGS.put("perfume", List.of("perfume", "beleza", "luxo", "romântico", "feminino", "masculino"));
        KEYWORD_TO_TAGS.put("kit", List.of("kit", "presente-completo", "curadoria"));
        KEYWORD_TO_TAGS.put("décor", List.of("decoração", "casa", "presente-casa", "luxo"));
        KEYWORD_TO_TAGS.put("decor", List.of("decoração", "casa", "presente-casa", "luxo"));
        KEYWORD_TO_TAGS.put("quadro", List.of("decoração", "arte", "casa", "presente-casa"));
        KEYWORD_TO_TAGS.put("planta", List.of("plantas", "natureza", "casa", "bem-estar", "sustentável"));
        KEYWORD_TO_TAGS.put("xícara", List.of("utensílios", "café", "chá", "casa", "presente-casa"));
        KEYWORD_TO_TAGS.put("taça", List.of("utensílios", "vinho", "bebida", "casa", "presente-casa"));
        KEYWORD_TO_TAGS.put("joia", List.of("joia", "acessório", "luxo", "feminino", "romântico", "aniversário"));
        KEYWORD_TO_TAGS.put("pulseira", List.of("pulseira", "joia", "acessório", "feminino", "romântico"));
        KEYWORD_TO_TAGS.put("colar", List.of("colar", "joia", "acessório", "feminino", "luxo", "romântico"));
        KEYWORD_TO_TAGS.put("bolsa", List.of("bolsa", "moda", "feminino", "luxo", "acessório"));
        KEYWORD_TO_TAGS.put("carteira", List.of("carteira", "moda", "masculino", "acessório", "presente-corporativo"));
        KEYWORD_TO_TAGS.put("relógio", List.of("relógio", "acessório", "masculino", "luxo", "presente-corporativo"));
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
        if (tagRepository.count() > 0) {
            log.info("Tags já existem no banco, pulando seed.");
            return;
        }

        log.info("Iniciando seed de tags...");

        Set<String> allTagNames = new LinkedHashSet<>();
        KEYWORD_TO_TAGS.values().forEach(allTagNames::addAll);
        allTagNames.addAll(List.of(
            "aniversário", "natal", "dia-das-maes", "dia-dos-pais", "dia-dos-namorados",
            "casamento", "formatura", "chá-de-bebê", "presente-corporativo",
            "luxo", "premium", "gourmet", "sustentável", "artesanal",
            "masculino", "feminino", "unissex", "infantil",
            "até-50", "até-100", "até-200", "acima-200"
        ));

        Map<String, Tag> tagMap = new HashMap<>();
        for (String name : allTagNames) {
            Tag tag = tagRepository.save(Tag.builder().name(name).build());
            tagMap.put(name, tag);
        }

        for (Map.Entry<String, List<String>> entry : KEYWORD_TO_TAGS.entrySet()) {
            for (String tagName : entry.getValue()) {
                Tag tag = tagMap.get(tagName);
                if (tag != null) {
                    TagKeyword keyword = TagKeyword.builder()
                        .keyword(entry.getKey())
                        .tag(tag)
                        .build();
                    tagKeywordRepository.save(keyword);
                }
            }
        }

        log.info("Seed de tags concluído: {} tags e {} keywords criadas.", 
            tagMap.size(), KEYWORD_TO_TAGS.size());
    }
}
