import { useState } from "react";
import { ImageUploadService } from "../service/imageUpload";
import { clearError } from "./AuthSlice";

export const useImageUpload = () => {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (file: File, userId: string, p0: { bucket: string; folder: string; maxSizeMB: number; }): Promise<string | null> => {
        setUploading(true);
        setError(null);

        try {
            const imageUrl = await ImageUploadService.uploadAvatar(file, userId);
            return imageUrl;

        } catch (error: any) {
            setError(error.message || 'Image upload failed');
            return null;

        } finally {
            setUploading(false);
        }
    }

    const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
        return uploadImage(file, userId, {
            bucket : 'user-avatars',
            folder: 'avatars',
            maxSizeMB: 5,
            
        });
        
    }

    const deleteImage = async (imageUrl: string, userId: string): Promise<boolean> => {
        try {
            await ImageUploadService.deleteAvatar(imageUrl, userId);
            return true;
        } catch (error: any) {
            setError(error.message || 'Image deletion failed');
            return false;
        }
    }

    return {
        uploading,
        error,
        uploadImage,
        uploadAvatar,
        deleteImage,
        clearError: () => setError(null),
    }
}