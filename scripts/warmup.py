import time

import requests

# --- Configuration ---
BASE_URL = "http://localhost:3000"  # Your Next.js dev server URL
PATHS_TO_WARM = [
    "/",
    "/dashboard",
    "/auth",
    # Add any other important pages here
]
REQUEST_TIMEOUT = 10  # Seconds to wait for a response
RETRY_DELAY = 2       # Seconds to wait before retrying after an error
MAX_RETRIES = 3       # Maximum number of retries per URL

# --- Script Logic ---
def warm_url(url):
    """Sends a GET request to the specified URL with retries."""
    print(f"Warming up: {url} ... ", end="")
    for attempt in range(MAX_RETRIES):
        try:
            response = requests.get(url, timeout=REQUEST_TIMEOUT)
            response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
            print(f"Success ({response.status_code})")
            return True # Success
        except requests.exceptions.RequestException as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < MAX_RETRIES - 1:
                print(f"Retrying in {RETRY_DELAY} seconds...")
                time.sleep(RETRY_DELAY)
            else:
                print(f"Failed to warm up {url} after {MAX_RETRIES} attempts.")
                return False # Failure after retries
    return False # Should not be reached, but added for completeness

def main():
    """Main function to iterate through paths and warm them up."""
    print(f"Starting warmup for {BASE_URL}...")
    success_count = 0
    fail_count = 0

    for path in PATHS_TO_WARM:
        full_url = BASE_URL.rstrip('/') + '/' + path.lstrip('/')
        if warm_url(full_url):
            success_count += 1
        else:
            fail_count += 1
        time.sleep(0.5) # Small delay between requests

    print("\nWarmup complete.")
    print(f"Successfully warmed: {success_count}")
    print(f"Failed to warm:    {fail_count}")

if __name__ == "__main__":
    main()
