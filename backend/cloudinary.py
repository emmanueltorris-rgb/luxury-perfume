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

    result = cloudinary.uploader.upload(
        file
    )

    return result["secure_url"]