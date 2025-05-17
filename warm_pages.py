import os
import time
import requests
from concurrent.futures import ThreadPoolExecutor

# Helper function to discover static page routes in a Node.js project.
def discover_routes_node(project_root):
    static_dirs = ['public', 'static', 'dist', 'build']  # common directories for static files
    routes = []
    for dirname in static_dirs:
        dir_path = os.path.join(project_root, dirname)
        if not os.path.isdir(dir_path):
            continue  # skip if this common static folder doesn't exist
        # Walk through the directory to find .html files
        for root, _, files in os.walk(dir_path):
            for file in files:
                if not file.lower().endswith('.html'):
                    continue  # only consider HTML pages
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, dir_path)  # path relative to the static dir
                rel_path = rel_path.replace("\\", "/")  # normalize Windows paths to forward slashes
                # Determine route based on file name and location
                if rel_path.lower().endswith('index.html'):
                    # If the file is index.html, use the directory as the route
                    url_path = rel_path[: -len('index.html')]  # strip "index.html"
                    if url_path == "":  
                        route = "/"  # index.html at root -> home page
                    else:
                        # Ensure it leads to a route ending with "/" (e.g., "docs/index.html" -> "/docs/")
                        route = "/" + url_path
                        if not route.endswith("/"):
                            route += "/"
                else:
                    # For non-index files, use the file path directly
                    route = "/" + rel_path  # e.g., "about.html" -> "/about.html"
                routes.append(route)
    # Remove duplicates and sort the routes list
    routes = sorted(set(routes))
    return routes

# Helper function to discover static page routes in a Next.js project.
def discover_routes_next(project_root):
    # Next.js pages directory could be at "<root>/pages" or "<root>/src/pages"
    if os.path.isdir(os.path.join(project_root, "pages")):
        pages_dir = os.path.join(project_root, "pages")
    elif os.path.isdir(os.path.join(project_root, "src", "pages")):
        pages_dir = os.path.join(project_root, "src", "pages")
    else:
        return []  # no pages directory found
    routes = []
    for root, dirs, files in os.walk(pages_dir):
        # Skip the pages/api directory entirely (API routes) [oai_citation:13‡geeksforgeeks.org](https://www.geeksforgeeks.org/next-js-routing/#:~:text=API%20Routes)
        if os.path.basename(root).lower() == "api":
            continue
        for file in files:
            # Only consider files that could be pages (JS/TS files)
            if not (file.endswith(".js") or file.endswith(".jsx") or file.endswith(".ts") or file.endswith(".tsx")):
                continue
            if file.startswith("_"):
                # Skip Next.js special files like _app.js, _document.js, etc.
                continue
            if file.startswith("["):
                # Skip dynamic route files like [id].js [oai_citation:14‡geeksforgeeks.org](https://www.geeksforgeeks.org/next-js-routing/#:~:text=Dynamic%20Routes)
                continue
            page_name = file.split(".", 1)[0]  # filename without extension
            rel_dir = os.path.relpath(root, pages_dir)
            rel_dir = rel_dir.replace("\\", "/")
            if rel_dir == ".":
                rel_dir = ""  # if at root, treat as empty path prefix
            # Construct route:
            if page_name == "index":
                # index.js -> route is the folder's path (or root if in pages/ root)
                if rel_dir == "":
                    route = "/"  # pages/index.js at root -> "/"
                else:
                    route = "/" + rel_dir + "/"  # e.g., pages/blog/index.js -> "/blog/"
            else:
                # Non-index page
                if rel_dir == "":
                    route = "/" + page_name  # e.g., pages/about.js -> "/about"
                else:
                    route = "/" + rel_dir + "/" + page_name  # e.g., pages/blog/post.js -> "/blog/post"
            routes.append(route)
    # Remove duplicates and sort routes
    routes = sorted(set(routes))
    return routes

# Function to warm up a list of routes by sending HTTP GET requests concurrently
def warm_up_routes(base_url, routes, max_workers=10):
    results = []  # to store tuples of (route, status_code, reason, time)
    # Ensure base_url ends without a trailing slash
    base_url = base_url.rstrip("/")
    # Define the worker function for each thread
    def fetch_url(route):
        url = base_url + route
        try:
            start_time = time.time()
            response = requests.get(url, timeout=10)
            elapsed = time.time() - start_time
            # Record status and reason
            results.append((route, response.status_code, response.reason, elapsed))
        except Exception as e:
            # If any error occurs (timeout, connection error, etc.), record it
            results.append((route, None, str(e), None))
    # Use ThreadPoolExecutor to send requests concurrently
    workers = min(max_workers, len(routes))
    with ThreadPoolExecutor(max_workers=workers) as executor:
        for route in routes:
            executor.submit(fetch_url, route)
    # At this point, all requests have been attempted.
    return results

# Main script logic
if __name__ == "__main__":
    # 1. Menu interface for user to choose the app type
    print("Choose application type to warm up:")
    print("1. Node.js (static files)")
    print("2. Next.js (pages directory)")
    choice = input("Enter 1 or 2: ").strip()
    if choice not in ["1", "2"]:
        print("Invalid choice. Exiting.")
        exit(1)
    project_root = os.path.abspath(".")  # current directory as project root
    if choice == "1":
        routes = discover_routes_node(project_root)
    else:
        routes = discover_routes_next(project_root)
    if not routes:
        print("No static page routes found in the project to warm up.")
        exit(0)
    # Prompt for base URL of the running app (default to localhost)
    base_url = input("Enter the base URL of the running app [default: http://localhost:3000]: ").strip()
    if base_url == "":
        base_url = "http://localhost:3000"
    print(f"\n>>> Warming up {len(routes)} static pages on {base_url}...\n")
    # 2-4. Concurrently warm up all discovered routes
    results = warm_up_routes(base_url, routes, max_workers=10)
    # 5. Log results for each route
    success_count = 0
    fail_count = 0
    total_time = 0.0
    for route, status, reason, elapsed in results:
        if status is None:
            # Request failed (exception)
            fail_count += 1
            print(f"{route} -> ERROR: {reason}")
        else:
            # Log status code and time
            if 200 <= status < 300:
                success_count += 1
            else:
                fail_count += 1
            if elapsed is not None:
                total_time += elapsed
                print(f"{route} -> {status} {reason} ({elapsed:.2f}s)")
            else:
                print(f"{route} -> {status} {reason}")
    # Summary report
    print("\nSummary Report:")
    print(f"Total static pages attempted: {len(routes)}")
    print(f"Successful responses: {success_count}")
    print(f"Failed responses: {fail_count}")
    if success_count > 0:
        avg_time = total_time / success_count
        print(f"Average response time (successful pages): {avg_time:.2f} seconds")
