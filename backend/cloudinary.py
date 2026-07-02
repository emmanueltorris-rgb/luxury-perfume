import cloudinary
import cloudinary.uploader

from backend.config import get_settings


settings = get_settings()


cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)


def upload_image(file):

    result = cloudinary.uploader.upload(file)

    return {
        "url":result["secure_url"],
        "public_id":result["public_id"]
    }

def delete_image(public_id: str):
    cloudinary.uploader.destroy(public_id)