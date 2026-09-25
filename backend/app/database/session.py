import os
from urllib.parse import urlparse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

db_url = settings.DATABASE_URL

# Ensure MySQL database exists before engine binds, or gracefully fallback to SQLite if MySQL is offline
if "mysql" in db_url:
    try:
        import pymysql
        clean_url = db_url.replace("mysql+pymysql://", "http://").replace("mysql://", "http://")
        parsed = urlparse(clean_url)
        db_name = parsed.path.lstrip("/")
        
        # Test connection with short timeout
        conn = pymysql.connect(
            host=parsed.hostname or "127.0.0.1",
            port=parsed.port or 3306,
            user=parsed.username or "root",
            password=parsed.password or "",
            connect_timeout=2
        )
        if db_name:
            with conn.cursor() as cursor:
                cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        conn.close()
        print(f"[INFO] Successfully connected to MySQL at {parsed.hostname or '127.0.0.1'}:{parsed.port or 3306}")
    except Exception as e:
        print(f"[NOTICE] MySQL connection failed ({e}). Gracefully falling back to local SQLite database.")
        db_url = "sqlite:///./truthlens.db"

# Configure engine args based on database dialect (SQLite vs MySQL/Postgres)
engine_kwargs = {}
if db_url.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
    # On Vercel Serverless environment, use /tmp directory for writable SQLite file
    if os.getenv("VERCEL"):
        import shutil
        tmp_db = "/tmp/truthlens.db"
        src_db = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "truthlens.db"))
        if os.path.exists(src_db) and not os.path.exists(tmp_db):
            try:
                shutil.copyfile(src_db, tmp_db)
            except Exception:
                pass
        db_url = f"sqlite:///{tmp_db}"
else:
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 3600

engine = create_engine(
    db_url,
    echo=False,
    **engine_kwargs
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
