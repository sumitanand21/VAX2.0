#custom settings for production here

ALLOWED_HOSTS = ["*"]
DEBUG = False
STATIC_ROOT = os.path.join(os.path.dirname(BASE_DIR), 'static')

