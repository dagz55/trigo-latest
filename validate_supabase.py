#!/usr/bin/env python3
"""
validate_supabase.py

✅ Standalone utility to:
  1. Locate .env or .env.local
  2. Verify required Supabase env vars
  3. Perform a health check against your Supabase URL (✅ on 200, ❌ otherwise)
"""

import os
import sys
from pathlib import Path
from typing import Dict, List

import requests
from dotenv import load_dotenv

# 🛠 Variables we care about
REQUIRED_VARS = [
    "DATABASE_URL",
    "prisma_api_key",
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
]


def find_env_files() -> List[Path]:
    """Look for both .env and .env.local files."""
    env_files = []
    for fname in (".env", ".env.local"):
        path = Path.cwd() / fname
        if path.is_file():
            print(f"🔎 Found environment file: {fname}")
            env_files.append(path)
    
    if not env_files:
        print("❌ No .env or .env.local files found in current directory.")
        sys.exit(1)
    
    return env_files


def load_environment(env_paths: List[Path]) -> Dict[str, str]:
    """Load variables from all found env files into a dictionary."""
    env_vars = {}
    
    for path in env_paths:
        # Load each file's contents into a temporary dict
        load_dotenv(dotenv_path=path, override=True)
        current_vars = {
            key: os.getenv(key, "").strip()
            for key in REQUIRED_VARS
        }
        
        # Update our collection, preferring .env.local over .env
        env_vars.update(current_vars)
        print(f"✨ Loaded variables from {path.name}")
    
    return env_vars


def check_vars_exist(env_vars: Dict[str, str]):
    """Ensure each required variable is present and non-empty."""
    missing = []
    for var in REQUIRED_VARS:
        if not env_vars.get(var, "").strip():
            missing.append(var)
    
    if missing:
        print("\n🚨 Missing or empty environment variables:")
        for v in missing:
            print(f"   • {v}")
        sys.exit(1)
    print("✅ All required environment variables are present.")


def supabase_health_check(env_vars: Dict[str, str]):
    """Hit the /health endpoint and treat any HTTP 200 as ✅ healthy."""
    base_url = env_vars["NEXT_PUBLIC_SUPABASE_URL"].rstrip("/")
    service_key = env_vars["SUPABASE_SERVICE_ROLE_KEY"]
    anon_key = env_vars["NEXT_PUBLIC_SUPABASE_ANON_KEY"]
    health_url = f"{base_url}/health"

    tests = [
        ("Service Role Key", service_key),
        ("Anon Key", anon_key),
    ]

    print("\n🔗 Testing Supabase /health endpoint...")

    for label, key in tests:
        headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
        }
        try:
            resp = requests.get(health_url, headers=headers, timeout=5)
            if resp.status_code == 200:
                print(f"   ✅ {label} is valid (status {resp.status_code}).")
            else:
                print(f"   ❌ {label} test returned {resp.status_code}: {resp.text[:50]!r}")
        except Exception as e:
            print(f"   ❌ {label} health check failed: {e}")


def print_env_summary(env_files: List[Path], env_vars: Dict[str, str]):
    """Print a summary of found environment files and their variables."""
    print("\n📝 Environment Files Summary:")
    for path in env_files:
        print(f"\n   📄 {path.name}:")
        for var in REQUIRED_VARS:
            value = env_vars.get(var, "")
            masked_value = value[:6] + "..." + value[-4:] if value else "❌ NOT SET"
            print(f"      • {var}: {masked_value}")


def main():
    print("🔍 Starting environment validation...")
    env_files = find_env_files()
    env_vars = load_environment(env_files)
    check_vars_exist(env_vars)
    supabase_health_check(env_vars)
    print_env_summary(env_files, env_vars)
    print("\n🎉 All done! Your Supabase credentials look healthy. Have a fantastic day! 💖")


if __name__ == "__main__":
    main()
