package br.com.regalaya.shared.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * Service interface for file storage operations (S3)
 */
public interface StorageService {
    
    /**
     * Upload a file to S3
     * @param file the file to upload
     * @param folder the folder path within the bucket (e.g., "products", "categories")
     * @param filename the target filename (or null to generate one)
     * @return Map with "url" and "key" of the uploaded file
     */
    Map<String, String> uploadFile(MultipartFile file, String folder, String filename);
    
    /**
     * Delete a file from S3
     * @param key the S3 object key
     */
    void deleteFile(String key);
    
    /**
     * Get the public URL for a file
     * @param key the S3 object key
     * @return the public URL
     */
    String getFileUrl(String key);
}