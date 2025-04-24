#!/usr/bin/env python3

import subprocess
import json
import logging
from pathlib import Path
from typing import Dict, List

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class UpdateChecker:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent

    def get_outdated_packages(self) -> Dict[str, Dict]:
        """Check for outdated packages using npm outdated."""
        try:
            result = subprocess.run(
                ['npm', 'outdated', '--json'],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            return json.loads(result.stdout) if result.stdout else {}
        except (subprocess.CalledProcessError, json.JSONDecodeError):
            return {}

    def check_security_vulnerabilities(self) -> List[Dict]:
        """Run npm audit to check for security vulnerabilities."""
        try:
            result = subprocess.run(
                ['npm', 'audit', '--json'],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            return json.loads(result.stdout).get('vulnerabilities', {})
        except (subprocess.CalledProcessError, json.JSONDecodeError):
            return {}

    def run_check(self):
        """Run all checks and display results."""
        logging.info("Checking for outdated packages...")
        outdated = self.get_outdated_packages()
        if outdated:
            logging.warning("\nOutdated packages found:")
            for pkg, info in outdated.items():
                logging.warning(
                    f"  - {pkg}: {info.get('current', 'unknown')} → {info.get('latest', 'unknown')}"
                )
        else:
            logging.info("All packages are up to date!")

        logging.info("\nChecking for security vulnerabilities...")
        vulnerabilities = self.check_security_vulnerabilities()
        if vulnerabilities:
            logging.warning("\nSecurity vulnerabilities found:")
            for pkg, info in vulnerabilities.items():
                logging.warning(
                    f"  - {pkg}: {info.get('severity', 'unknown')} severity"
                )
            logging.info("\nRun 'npm audit fix' to attempt automatic fixes")
        else:
            logging.info("No security vulnerabilities found!")

if __name__ == "__main__":
    checker = UpdateChecker()
    checker.run_check()