import psycopg
import sys

url = "postgresql://user:eq7Q7QbrtXy9COUUhAuvJ2EBvVCvluBe@dpg-d59h22pr0fns73fq5v4g-a.virginia-postgres.render.com/jornalismo_bd"
try:
    print(f"Connecting to {url.split('@')[1]}...")
    conn = psycopg.connect(url)
    print("Connection Successful!")
    conn.close()
except Exception as e:
    print(f"Connection Failed: {e}")
    sys.exit(1)
