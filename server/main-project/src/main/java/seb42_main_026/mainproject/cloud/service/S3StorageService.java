package seb42_main_026.mainproject.cloud.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import seb42_main_026.mainproject.exception.StorageException;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class S3StorageService implements StorageService {

    private final AmazonS3Client amazonS3Client;

    //test 후에 .yml 환경변수 설정하여 숨기기 - todo
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Override
    public void store(MultipartFile file, String encodedFileName){
        try {
//            String fileName = file.getOriginalFilename();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

//            amazonS3Client.putObject(bucket, fileName, file.getInputStream(), metadata);
            //PutObjectRequest 이용하여 파일 생성 안하고 업로드
            amazonS3Client.putObject(new PutObjectRequest(bucket, encodedFileName, file.getInputStream(), metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
        } catch (IOException e) {
            throw new StorageException("Failed to store file.", e);
        }
    }

    //URL 생성 메서드 (파일명 한글일때, 깨짐 방지)
    public String getFileUrl(String encodedFileName){
        return URLDecoder.decode(amazonS3Client.getUrl(bucket,encodedFileName).toString(),StandardCharsets.UTF_8);
    }

    //파일명을 "UUID(랜덤값)-{fileName}" 으로 바꿔주는 메서드
    public String encodeFileName(MultipartFile mediaFile){
        String fileName = mediaFile.getOriginalFilename();
        String uuid = UUID.randomUUID().toString();

        return uuid + "-" + fileName;
    }

    //두가지 기능 합친거
//    public String fileUrl(MultipartFile file){
//        String fileName = encodeFileName(file);
//
//        try {
//            ObjectMetadata metadata = new ObjectMetadata();
//            metadata.setContentType(file.getContentType());
//            metadata.setContentLength(file.getSize());
//
//            amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, file.getInputStream(), metadata)
//                    .withCannedAcl(CannedAccessControlList.PublicRead));
//        } catch (IOException e) {
//            throw new StorageException("Failed to store file.", e);
//        }
//
//        String url = URLDecoder.decode(amazonS3Client.getUrl(bucket,fileName).toString(),StandardCharsets.UTF_8);
//
//        return url;
//    }
//
//
}
