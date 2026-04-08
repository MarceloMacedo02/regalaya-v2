package br.com.regalaya.shared.service.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.com.regalaya.shared.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3StorageService implements StorageService {

    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket:regalaya-images}")
    private String bucketName;

    @Value("${cloud.aws.endpoint.uri:http://localhost:4566}")
    private String endpointUri;

    @Override
    public Map<String, String> uploadFile(MultipartFile file, String folder, String filename) {
        try {
            // Generate filename if not provided
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            
            String finalFilename = (filename != null && !filename.isEmpty()) 
                ? filename 
                : UUID.randomUUID() + extension;
            
            // Create S3 key (path within bucket)
            String key = String.format("%s/%s/%s", folder, LocalDate.now(), finalFilename);
            
            // Upload to S3
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();
            
            s3Client.putObject(putRequest, RequestBody.fromBytes(file.getBytes()));
            
            // Return URL and key
            String url = getFileUrl(key);
            
            log.info("File uploaded successfully: {}", key);
            
            return Map.of("url", url, "key", key);
            
        } catch (IOException e) {
            log.error("Failed to upload file to S3", e);
            throw new RuntimeException("Failed to upload file: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteFile(String key) {
        try {
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            
            s3Client.deleteObject(deleteRequest);
            log.info("File deleted successfully: {}", key);
            
        } catch (Exception e) {
            log.error("Failed to delete file from S3: {}", key, e);
            throw new RuntimeException("Failed to delete file: " + e.getMessage(), e);
        }
    }

    @Override
    public String getFileUrl(String key) {
        // For LocalStack, use the endpoint URL
        // For production (AWS S3), the URL would be auto-generated
        if (endpointUri.contains("localhost") || endpointUri.contains("4566")) {
            return String.format("%s/%s/%s", endpointUri, bucketName, key);
        }
        // For real AWS S3, use the standard URL format
        return String.format("https://%s.s3.amazonaws.com/%s", bucketName, key);
    }
}