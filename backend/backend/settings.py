from pathlib import Path
from datetime import timedelta
import environ
import os

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'accounts',
    'authentication',
    'dictionaries',
    'google_auth',
    'translators',
    'flashcards',
    'corsheaders'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'authorization',
    'content-type',
    'x-requested-with',
    'accept',
    'origin',
    'access-control-request-method',
    'access-control-request-headers',
]

BASIC_SENDER_EMAIL = "mails.sender.api@gmail.com"
BASIC_SENDER_PASSWORD = "hjtq pbgx mpec iuir"
# WSGI_APPLICATION = 'google_login.wsgi.application'

ROOT_URLCONF = 'backend.urls'
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# SIMPLE_JWT = {
#     'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
#     'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
#     'ROTATE_REFRESH_TOKENS': False,
#     'BLACKLIST_AFTER_ROTATION': True,
#     'AUTH_COOKIE': 'refresh_token',  # Cookie name. Enables cookies if value is set.
#     'AUTH_COOKIE_DOMAIN': None,     # A string like "example.com", or None for standard domain cookie.
#     'AUTH_COOKIE_SECURE': False,    # Whether the auth cookies should be secure (https:// only).
#     'AUTH_COOKIE_HTTP_ONLY' : True, # Http only cookie flag.It's not fetch by javascript.
#     'AUTH_COOKIE_PATH': '/',        # The path of the auth cookie.
#     'AUTH_COOKIE_SAMESITE': 'Lax',  # Whether to set the flag restricting cookie leaks on cross-site requests.
# }

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [],
}

# WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_USER_MODEL = "accounts.User"

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_VERIFICATION = 'optional'
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': f'{env("GOOGLE_CLIENT_ID")}',
            'secret': f'{env("GOOGLE_CLIENT_SECRET")}',
            'key': ''
        },
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'offline',
        },
        # 'FETCH_USERINFO' : True
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

SIDE_ID = 1


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

GOOGLE_CLIENT_ID = env('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = env('GOOGLE_CLIENT_SECRET')

DEEPL_AUTH_KEY = env('DEEPL_AUTH_KEY')