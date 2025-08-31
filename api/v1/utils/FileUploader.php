<?php
require_once __DIR__ . '/../utils/Response.php';

class FileUploader {
    public static function uploadProfileImage($file, $userId) {
        $allowedTypes = ['image/jpeg', 'image/png'];
        $maxSize = 5 * 1024 * 1024; // 5MB
        $uploadDir = __DIR__ . '/../uploads/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        if ($file['error'] !== UPLOAD_ERR_OK) {
            Response::error('File upload failed', 400);
        }

        if (!in_array($file['type'], $allowedTypes)) {
            Response::error('Invalid file type. Only JPEG/PNG allowed', 400);
        }

        if ($file['size'] > $maxSize) {
            Response::error('File size exceeds 5MB limit', 400);
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = $userId . '_' . uniqid() . '.' . $ext;
        $destination = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            return '/uploads/' . $filename;
        } else {
            Response::error('Failed to save file', 500);
        }
    }

    public static function uploadResource($file, $resourceId) {
        $allowedTypes = ['application/pdf', 'video/mp4', 'text/plain', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
        $maxSize = 50 * 1024 * 1024; // 50MB for resources
        $uploadDir = __DIR__ . '/../uploads/resources/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        if ($file['error'] !== UPLOAD_ERR_OK) {
            Response::error('File upload failed', 400);
        }

        if (!in_array($file['type'], $allowedTypes)) {
            Response::error('Invalid file type. Only PDF, MP4, TXT, PPTX allowed', 400);
        }

        if ($file['size'] > $maxSize) {
            Response::error('File size exceeds 50MB limit', 400);
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = $resourceId . '_' . uniqid() . '.' . $ext;
        $destination = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            return '/uploads/resources/' . $filename;
        } else {
            Response::error('Failed to save file', 500);
        }
    }
}
?>