from flask import Flask
from flask_jwt_extended import JWTManager
from .extensions import db, migrate, cors
from .api import api_bp
from .config import Config


def create_app(config=Config):
    app = Flask(__name__)
    app.config.from_object(config)
    jwt = JWTManager(app)
    
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(
        app, 
        supports_credentials=True, 
        origins=["http://localhost"]
    )
    
    app.register_blueprint(api_bp, url_prefix="/api")
    
    from . import db_models
    
    return app