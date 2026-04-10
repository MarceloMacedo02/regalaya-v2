package br.com.regalaya.product.service;

import br.com.regalaya.product.domain.model.Product;
import br.com.regalaya.product.repository.ProductRepository;
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
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class TagDataInitializer implements ApplicationRunner {

    private final TagRepository tagRepository;
    private final TagKeywordRepository tagKeywordRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        try {
            log.info("Iniciando TagDataInitializer...");

            List<TagKeyword> keywords = tagKeywordRepository.findAll();
            Map<String, Set<Tag>> keywordToTags = new HashMap<>();
            
            for (TagKeyword kw : keywords) {
                keywordToTags
                    .computeIfAbsent(kw.getKeyword().toLowerCase(), k -> new HashSet<>())
                    .add(kw.getTag());
            }

            Map<String, Tag> priceTags = new HashMap<>();
            priceTags.put("até-50", tagRepository.findByName("até-50").orElse(null));
            priceTags.put("até-100", tagRepository.findByName("até-100").orElse(null));
            priceTags.put("até-200", tagRepository.findByName("até-200").orElse(null));
            priceTags.put("acima-200", tagRepository.findByName("acima-200").orElse(null));

            List<Product> products = productRepository.findAll();
            int updated = 0;
            
            for (Product product : products) {
                Set<Tag> productTags = new HashSet<>();
                String searchText = (
                    product.getName() + " " +
                    (product.getDescription() != null ? product.getDescription() : "") + " " +
                    (product.getShortDescription() != null ? product.getShortDescription() : "")
                ).toLowerCase();

                if (product.getPrice() != null) {
                    double price = product.getPrice().doubleValue();
                    if (price <= 50 && priceTags.get("até-50") != null) 
                        productTags.add(priceTags.get("até-50"));
                    else if (price <= 100 && priceTags.get("até-100") != null) 
                        productTags.add(priceTags.get("até-100"));
                    else if (price <= 200 && priceTags.get("até-200") != null) 
                        productTags.add(priceTags.get("até-200"));
                    else if (priceTags.get("acima-200") != null) 
                        productTags.add(priceTags.get("acima-200"));
                }

                for (Map.Entry<String, Set<Tag>> entry : keywordToTags.entrySet()) {
                    if (searchText.contains(entry.getKey())) {
                        productTags.addAll(entry.getValue());
                    }
                }

                product.setTagsSet(productTags);
                productRepository.save(product);
                updated++;
            }
            
            log.info("TagDataInitializer concluído: {} produtos atualizados com tags.", updated);
        } catch (Exception e) {
            log.error("Erro ao inicializar tags: {}", e.getMessage(), e);
        }
    }
}
