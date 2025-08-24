import { supabase } from '../supabase';

class ImageUploadService {
  constructor() {
    this.bucketName = 'Devfolio-images';
    this.maxFileSize = 2 * 1024 * 1024; // 2MB
    this.allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  }

  // Validate file before upload
  validateFile(file) {
    const errors = [];

    if (!file) {
      errors.push('No file selected');
      return { isValid: false, errors };
    }

    if (file.size > this.maxFileSize) {
      errors.push(`File size must be less than ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    if (!this.allowedTypes.includes(file.type)) {
      errors.push('Only JPEG, PNG, and WebP files are allowed');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Resize image using canvas
  async resizeImage(file, maxWidth, maxHeight, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(resolve, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // Generate unique file path
  generateFilePath(userId, imageType, fileExtension) {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    return `${userId}/${imageType}/${timestamp}_${randomId}.${fileExtension}`;
  }

  // Upload profile picture (800x800)
  async uploadProfilePicture(file, userId) {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Resize to 800x800
      const resizedBlob = await this.resizeImage(file, 800, 800, 0.9);
      const resizedFile = new File([resizedBlob], file.name, { type: file.type });

      // Generate file path
      const fileExtension = file.name.split('.').pop();
      const filePath = this.generateFilePath(userId, 'profile', fileExtension);

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, resizedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: publicUrl,
        path: filePath
      };

    } catch (error) {
      console.error('Profile picture upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload project image (1200x630)
  async uploadProjectImage(file, userId) {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Resize to 1200x630
      const resizedBlob = await this.resizeImage(file, 1200, 630, 0.85);
      const resizedFile = new File([resizedBlob], file.name, { type: file.type });

      // Generate file path
      const fileExtension = file.name.split('.').pop();
      const filePath = this.generateFilePath(userId, 'projects', fileExtension);

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, resizedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: publicUrl,
        path: filePath
      };

    } catch (error) {
      console.error('Project image upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete image from storage
  async deleteImage(filePath) {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Image deletion error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get image URL from path
  getImageUrl(filePath) {
    if (!filePath) return null;
    
    const { data: { publicUrl } } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  }
}

export default new ImageUploadService();
