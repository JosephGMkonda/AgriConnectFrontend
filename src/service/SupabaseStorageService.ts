import supabase from "../lib/supabase";

export interface UploadResult {
  url: string;
  thumbnailUrl?: string;
  fileSize: number;
  duration?: number; 
}

export class SupabaseStorageService {
  private static async compressImage(file: File, maxWidth: number = 1200): Promise<Blob> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => resolve(blob!),
            file.type,
            0.8 
          );
        };
      };
      reader.readAsDataURL(file);
    });
  }

  private static async generateThumbnail(videoFile: File): Promise<Blob> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoFile);
      
      video.onloadedmetadata = () => {
        video.currentTime = 1; 
        
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 320;
          canvas.height = 180;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.7);
        };
      };
    });
  }

  static async uploadMedia(file: File, userId: string, bucket: string = 'post-images'): Promise<UploadResult> {
    try {
      let processedFile: Blob;
      let thumbnailBlob: Blob | null = null;
      let duration: number | undefined;

      
      if (file.type.startsWith('image/')) {
        processedFile = await this.compressImage(file);
      } else if (file.type.startsWith('video/')) {
        processedFile = file;
        thumbnailBlob = await this.generateThumbnail(file);
        
        
        duration = await new Promise<number>((resolve) => {
          const video = document.createElement('video');
          video.src = URL.createObjectURL(file);
          video.onloadedmetadata = () => {
            resolve(video.duration);
            URL.revokeObjectURL(video.src);
          };
        });
      } else {
        processedFile = file;
      }

    
      const fileExt = file.name.split('.').pop() || file.type.split('/').pop() || 'file';
      const timestamp = Date.now();
      const fileName = `${userId}/${timestamp}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, processedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

    
      let thumbnailUrl: string | undefined;
      if (thumbnailBlob) {
        const thumbPath = `thumbnails/${fileName}`;
        const { error: thumbError } = await supabase.storage
          .from(bucket)
          .upload(thumbPath, thumbnailBlob, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'image/jpeg'
          });

        if (!thumbError) {
          const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(thumbPath);
          thumbnailUrl = publicUrl;
        }
      }

    
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        thumbnailUrl,
        fileSize: processedFile.size,
        duration
      };

    } catch (error: any) {
      console.error('Media upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  static async uploadMultipleMedia(files: File[], userId: string): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => this.uploadMedia(file, userId));
    return Promise.all(uploadPromises);
  }
}