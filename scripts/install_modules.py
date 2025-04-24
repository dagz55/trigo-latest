#!/usr/bin/env python3

import subprocess
import sys
import json
import os
import time
from typing import Dict, List, Tuple
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('installation.log')
    ]
)

class ModuleInstaller:
    def __init__(self):
        self.package_manager = self._detect_package_manager()
        self.project_root = Path(__file__).parent.parent
        self.required_modules = {
            "core": {
                "next": "^14.2.28",
                "react": "^18",
                "react-dom": "^18",
                "typescript": "^5"
            },
            "ui": {
                "tailwindcss": "^3.4.17",
                "@radix-ui/react-accordion": "^1.2.2",
                "@radix-ui/react-alert-dialog": "^1.1.4",
                "@radix-ui/react-avatar": "^1.1.2",
                "@radix-ui/react-dialog": "^1.1.4",
                "@radix-ui/react-dropdown-menu": "^2.1.4",
                "@radix-ui/react-label": "^2.1.1",
                "@radix-ui/react-separator": "^1.1.1",
                "@radix-ui/react-slot": "^1.1.1",
                "@radix-ui/react-toast": "^1.2.4",
                "class-variance-authority": "^0.7.1",
                "clsx": "^2.1.1",
                "tailwind-merge": "^2.5.5",
                "tailwindcss-animate": "^1.0.7",
                "lucide-react": "^0.454.0"
            },
            "auth": {
                "@supabase/ssr": "^0.6.1"
            },
            "form": {
                "react-hook-form": "^7.54.1",
                "@hookform/resolvers": "^3.9.1",
                "zod": "^3.24.1"
            },
            "utilities": {
                "next-themes": "latest",
                "sonner": "^1.7.1",
                "date-fns": "4.1.0",
                "recharts": "2.15.0"
            },
            "dev": {
                "@types/node": "^22",
                "@types/react": "^18",
                "@types/react-dom": "^18",
                "postcss": "^8",
                "autoprefixer": "^10.4.20"
            }
        }

    def _detect_package_manager(self) -> str:
        """Detect which package manager is available."""
        package_managers = ['pnpm', 'yarn', 'npm']
        
        for pm in package_managers:
            try:
                subprocess.run([pm, '--version'], capture_output=True, check=True)
                logging.info(f"Using package manager: {pm}")
                return pm
            except (subprocess.CalledProcessError, FileNotFoundError):
                continue
        
        logging.error("No supported package manager found!")
        sys.exit(1)

    def _run_command(self, command: List[str]) -> Tuple[bool, str]:
        """Run a command and return success status and output."""
        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                check=True
            )
            return True, result.stdout
        except subprocess.CalledProcessError as e:
            return False, e.stderr

    def check_node_version(self) -> bool:
        """Check if Node.js version meets requirements."""
        success, output = self._run_command(['node', '--version'])
        if not success:
            logging.error("Node.js is not installed!")
            return False
        
        version = output.strip().lstrip('v').split('.')
        if int(version[0]) < 16:
            logging.error("Node.js version must be 16 or higher!")
            return False
        return True

    def install_module(self, module: str, version: str, is_dev: bool = False) -> bool:
        """Install a single module with error handling and retry logic."""
        max_retries = 3
        install_command = {
            'npm': ['npm', 'install'],
            'yarn': ['yarn', 'add'],
            'pnpm': ['pnpm', 'add']
        }

        command = install_command[self.package_manager].copy()
        if is_dev:
            command.append('-D' if self.package_manager != 'npm' else '--save-dev')
        command.append(f"{module}@{version}")

        for attempt in range(max_retries):
            logging.info(f"Installing {module}@{version} (Attempt {attempt + 1}/{max_retries})")
            success, output = self._run_command(command)
            
            if success:
                logging.info(f"Successfully installed {module}")
                return True
            
            logging.warning(f"Failed to install {module}: {output}")
            time.sleep(2)  # Wait before retry

        logging.error(f"Failed to install {module} after {max_retries} attempts")
        return False

    def setup_environment(self):
        """Setup necessary environment files."""
        # Create .env.local if it doesn't exist
        env_file = self.project_root / '.env.local'
        if not env_file.exists():
            env_content = """NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"""
            env_file.write_text(env_content)
            logging.info("Created .env.local template")

        # Initialize Tailwind CSS
        success, _ = self._run_command(['npx', 'tailwindcss', 'init', '-p'])
        if success:
            logging.info("Initialized Tailwind CSS configuration")

    def verify_installation(self) -> bool:
        """Verify that all modules are correctly installed."""
        package_json_path = self.project_root / 'package.json'
        if not package_json_path.exists():
            logging.error("package.json not found!")
            return False

        with open(package_json_path) as f:
            package_data = json.load(f)

        all_modules = {
            **package_data.get('dependencies', {}),
            **package_data.get('devDependencies', {})
        }

        missing_modules = []
        for category in self.required_modules.values():
            for module, version in category.items():
                if module not in all_modules:
                    missing_modules.append((module, version))

        if missing_modules:
            logging.warning("Missing modules detected:")
            for module, version in missing_modules:
                logging.warning(f"  - {module}@{version}")
            return False
        
        return True

    def run_installation(self):
        """Run the complete installation process."""
        if not self.check_node_version():
            return

        logging.info("Starting installation process...")
        
        # Install all modules
        for category, modules in self.required_modules.items():
            logging.info(f"\nInstalling {category} modules...")
            is_dev = category == "dev"
            for module, version in modules.items():
                self.install_module(module, version, is_dev)

        # Setup environment
        self.setup_environment()

        # Verify installation
        if self.verify_installation():
            logging.info("\nAll modules installed successfully!")
        else:
            logging.warning("\nSome modules may be missing. Please check the logs.")

        # Run initial build
        logging.info("\nRunning initial build...")
        success, output = self._run_command([self.package_manager, 'run', 'build'])
        if success:
            logging.info("Initial build completed successfully!")
        else:
            logging.error(f"Build failed: {output}")

if __name__ == "__main__":
    installer = ModuleInstaller()
    installer.run_installation()