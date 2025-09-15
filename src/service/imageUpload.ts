import supabase from  '../lib/supabase'


export interface uploadOptions{
    bucket?: string;
    folder?: string;
    maxSizeMB?: number;
    allowedAndTypes?: string[];
}

export class ImageUploadService{
    private static defaultOptions: uploadOptions = {
        bucket: 'user-avatars',
        folder: 'avatars',
        maxSizeMB: 10,
        allowedAndTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    }


    static async uploadImage(file: File, userId: string, options?: uploadOptions): Promise<string> {
        const config = { ...this.defaultOptions, ...options};

        this.validateFile(file, config);

        try {
            const fileExt = file.name.split('.').pop();
            const timestamp = new Date().getTime();
            const fileName = `${config.folder}/image-${userId}-${timestamp}.${fileExt}`;
            const filePath = `${fileName}`;

            const {data, error: uploadError} = await supabase.storage
                .from(config.bucket!)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true,
                    contentType: file.type,
                })

                if(uploadError){
                    throw new Error(`Upload failed: ${uploadError.message}`);
                }

                const {data: {publicUrl}} = supabase.storage
                    .from(config.bucket!)
                    .getPublicUrl(filePath);
                return publicUrl;



        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error(error.message || 'Image upload failed');

        }
    }

    static async uploadAvatar(file: File, userId: string, ): Promise<string> {
        return this.uploadImage(file, userId, {
            bucket: 'user-avatars',
            folder: 'avatars',
            maxSizeMB: 5,
            allowedAndTypes: ['image/jpeg', 'image/png', 'image/webp'],
        })
    }

    static async uploadPostImage(file: File, userId: string, postId: string): Promise<string> {
        return this.uploadImage(file, userId, {
            bucket: 'post-images',
            folder: `posts/${postId}`,
            maxSizeMB: 10,
            allowedAndTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        })
    }

    static async deleteImage(imageUrl: string, bucket?: string): Promise<void> {
        try {

            if( !imageUrl)  return;
            const filePath = this.extractFilePath(imageUrl);

            if(!filePath){
                throw new Error('Invalid image URL');
            }

            const targetBucket = bucket || this.defaultOptions.bucket!;
            const {error} = await supabase.storage
                .from(targetBucket)
                .remove([filePath]);

            if(error){
                console.warn('Failed to delete image', error.message)
            }
            
        } catch (error: any) {
            console.error('Image deletion error', error)
            
        }
    }

    private static extractFilePathFromUrl(url: string): string | null {
        try {
            const urlObj = new URL(url)
            const pathParts = urlObj.pathname.split('/');
            const bucketIndex = pathParts.indexOf('object') + 2;

            if(bucketIndex < pathParts.length){
                return pathParts.slice(bucketIndex).join('/')

            }

            return null

        } catch (error) {
            return null
        }
    }

    private static validateFile(file: File, options: uploadOptions ): void {
        if(!options.allowedAndTypes?.includes(file.type)){
            throw new Error (
                `Invalid file type: AllowedTypes: ${options.allowedAndTypes?.join(', ')}`
            )
        }

        const maxSizeBytes = (options.maxSizeMB || 5) * 1024 * 1024;
        if(file.size > maxSizeBytes){
            throw new Error(`File too large. Maxmum size: ${options.maxSizeMB}MB`)
        }
    }

    static async compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8) : Promise<File>{
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file)


            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;


                    if(width > maxWidth){
                        height = (height * maxWidth) / width
                        width = maxWidth
                    }

                    canvas.width = width;
                    canvas.height = height;


                    const ctx = canvas.getContext('2d');
                    if(!ctx){
                        reject(new Error('Could not create canvas context'))
                        return
                    }

                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        if(!blob){
                            reject(new Error('Canvas to Blob conversion failed'))
                            return;
                        }

                        const compressFile = new File(
                            [blob],
                            file.name,
                            {type: file.type, lastModified: Date.now()}
                        );

                        resolve(compressFile)
                    },
                    file.type,
                    quality
                );




                }
                img.onerror = () => {
                    reject(new Error('Failed to load Image'))
                }
            }

            reader.onerror = () => {
                reject (new Error('Failed to read a file'))
            }
        })
    }

    static async listUserImages(userId: string, bucket?: string): Promise<string[]> {
        try {
            const targetBucket = bucket || this.defaultOptions.bucket!;
            const folderPath = `${userId}/avatars`;

            const {data, error} = await supabase.storage
                .from(targetBucket)
                .list(folderPath)

            if(error){
                const imageUrls = data
                .filter(item => !item.name?.endsWith('/'))
                .map(item => {
                    const {data: {publicUrl}} = supabase.storage
                        .from(targetBucket)
                        .getPublicUrl(`${folderPath}/${item.name}`);
                    return publicUrl;
                })

                return imageUrls;

            }
        } catch (error) {

            console.error('Error listing images:', error);
            return [];
            
        }


}
    
}