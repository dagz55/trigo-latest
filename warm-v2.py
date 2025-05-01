import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor

import requests


# Discover static page routes in a Node.js project.
def discover_routes_node(project_root):
    static_dirs = ['public', 'static', 'dist', 'build']
    routes = []
    for dirname in static_dirs:
        dir_path = os.path.join(project_root, dirname)
        if not os.path.isdir(dir_path):
            continue
        for root, _, files in os.walk(dir_path):
            for file in files:
                if not file.lower().endswith('.html'):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, dir_path).replace("\\", "/")
                if rel_path.lower().endswith('index.html'):
                    url_path = rel_path[:-len('index.html')]
                    route = '/' + url_path if url_path else '/'
                    if not route.endswith('/'):
                        route += '/'
                else:
                    route = '/' + rel_path
                routes.append(route)
    return sorted(set(routes))

# Discover static page routes in a Next.js Pages Router project.
def discover_routes_pages_router(project_root):
    pages_dir = None
    if os.path.isdir(os.path.join(project_root, "pages")):
        pages_dir = os.path.join(project_root, "pages")
    elif os.path.isdir(os.path.join(project_root, "src", "pages")):
        pages_dir = os.path.join(project_root, "src", "pages")
    if not pages_dir:
        return []

    routes = []
    for root, dirs, files in os.walk(pages_dir):
        # Exclude API routes
        dirs[:] = [d for d in dirs if d.lower() != 'api']
        if os.path.basename(root).lower() == "api": # Double check in case api is at top level of pages
            continue

        for file in files:
            if not file.lower().endswith((".js", ".jsx", ".ts", ".tsx")):
                continue
            # Skip special Next.js files/folders and dynamic routes
            if file.startswith(('_', '[')) or any(part.startswith('[') for part in root.split(os.sep)):
                 continue

            page_name = file.split(".", 1)[0]
            rel_dir = os.path.relpath(root, pages_dir).replace("\\", "/")
            rel_dir = '' if rel_dir == '.' else rel_dir

            # Skip intermediate directories that don't have an index page itself
            # (This check might be overly simplistic depending on setup)

            if page_name == "index":
                route = '/' + rel_dir + ('/' if rel_dir else '')
            else:
                route = '/' + (rel_dir + '/' if rel_dir else '') + page_name
            routes.append(route)

    # Ensure root route '/' exists if 'index' page is at the top level
    if any(f == 'index.js' or f == 'index.jsx' or f == 'index.ts' or f == 'index.tsx' for f in os.listdir(pages_dir)):
         if '/' not in routes:
             routes.append('/')

    return sorted(list(set(routes)))


# Discover page routes in a Next.js App Router project.
def discover_routes_app_router(project_root):
    app_dir = os.path.join(project_root, "app")
    if not os.path.isdir(app_dir):
        return []

    routes = []
    # Start walking from the app directory
    for root, dirs, files in os.walk(app_dir, topdown=True):
        # Filter out special directories (layout groups, private, parallel, intercepted, dynamic)
        # Keep directory names for path calculation before filtering dirs[:]
        path_segments_for_route = []
        full_rel_path = os.path.relpath(root, app_dir).replace("\\", "/")

        is_valid_route_segment = True
        if full_rel_path != '.':
            for segment in full_rel_path.split('/'):
                if segment.startswith(('(', '_', '@', '%')) or segment == 'api': # Skip layout groups, private, parallel, intercepted routes, api
                    is_valid_route_segment = False
                    break # Stop processing this path if any segment is special/api
                elif segment.startswith('['): # Skip dynamic segments for now
                    is_valid_route_segment = False
                    break
                else:
                    path_segments_for_route.append(segment)


        # Modify dirs[:] to prevent walking into unwanted directories
        dirs[:] = [d for d in dirs if not (d.startswith(('(', '_', '@', '[', '%')) or d == 'api')]

        if not is_valid_route_segment:
            continue # Skip this directory if it's part of a special/dynamic path

        # Check if a page file exists in the current directory
        page_file_exists = any(f.startswith('page.') and f.lower().endswith(('.js', '.jsx', '.ts', '.tsx')) for f in files)

        if page_file_exists:
            # Construct the route path from valid segments
            if not path_segments_for_route: # Root directory (app/)
                route = '/'
            else:
                route = '/' + '/'.join(path_segments_for_route)

            routes.append(route)

    return sorted(list(set(routes))) # Use list(set()) to remove duplicates


# Warm up a list of routes concurrently.
def warm_up_routes(base_url, routes, max_workers=10):
    results = []
    base_url = base_url.rstrip("/")

    def fetch_url(route):
        # Ensure route starts with exactly one '/'
        if not route.startswith('/'):
            route = '/' + route
        url = base_url + route
        try:
            start_time = time.time()
            # Allow redirects, common in Next.js (e.g., trailing slash handling)
            response = requests.get(url, timeout=10, allow_redirects=True)
            elapsed = time.time() - start_time
            # Use final URL after redirects if any occurred
            final_url_path = requests.utils.urlparse(response.url).path or '/'
            results.append((final_url_path, response.status_code, response.reason, elapsed))
        except Exception as e:
            results.append((route, None, str(e), None))

    workers = min(max_workers, len(routes))
    with ThreadPoolExecutor(max_workers=workers) as executor:
        # Create a list of futures to ensure all are submitted before waiting
        futures = [executor.submit(fetch_url, route) for route in routes]
        # Wait for all futures to complete (implicitly happens when exiting 'with' block)

    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python warm_pages.py <BASE_URL>")
        print("Example: python warm_pages.py http://localhost:3000")
        sys.exit(1)

    base_url = sys.argv[1]
    project_root = os.path.abspath(".")
    routes = []
    router_type = "Unknown"

    # Auto-detect project structure
    app_dir_path = os.path.join(project_root, "app")
    pages_dir_path = os.path.join(project_root, "pages")
    src_pages_dir_path = os.path.join(project_root, "src", "pages")

    if os.path.isdir(app_dir_path):
        print("Detected Next.js App Router structure. Discovering routes...")
        routes = discover_routes_app_router(project_root)
        router_type = "Next.js App Router"
    elif os.path.isdir(pages_dir_path) or os.path.isdir(src_pages_dir_path):
        print("Detected Next.js Pages Router structure. Discovering routes...")
        routes = discover_routes_pages_router(project_root)
        router_type = "Next.js Pages Router"
    else:
        print("Could not automatically detect Next.js App or Pages Router.")
        print("Attempting to discover static Node.js files...")
        routes = discover_routes_node(project_root)
        router_type = "Node.js Static"


    if not routes:
        # print("No static page routes found in the project to warm up.")
        print(f"No page routes found for the detected structure ({router_type}).")
        sys.exit(0)

    print(f"\n>>> Warming up {len(routes)} pages ({router_type}) on {base_url}...\n")
    start_warmup_time = time.time()
    results = warm_up_routes(base_url, routes)
    end_warmup_time = time.time()

    success_count = 0
    fail_count = 0
    total_request_time = 0.0 # Sum of individual request times

    # Sort results for consistent output
    results.sort(key=lambda x: x[0])

    for route, status, reason, elapsed in results:
        if status is None:
            fail_count += 1
            print(f"[FAIL] {route:<50} -> ERROR: {reason}")
        else:
            status_str = f"{status} {reason}"
            if 200 <= status < 400: # Count redirects (3xx) as success for warming
                success_count += 1
                if elapsed is not None:
                    total_request_time += elapsed
                    print(f"[ OK ] {route:<50} -> {status_str} ({elapsed:.3f}s)")
                else:
                    print(f"[ OK ] {route:<50} -> {status_str}")
            else:
                fail_count += 1
                if elapsed is not None:
                    print(f"[FAIL] {route:<50} -> {status_str} ({elapsed:.3f}s)")
                else:
                     print(f"[FAIL] {route:<50} -> {status_str}")


    print("\n--- Summary Report ---")
    print(f"Detected Structure: {router_type}")
    print(f"Total pages found: {len(routes)}")
    print(f"Successful requests (2xx/3xx): {success_count}")
    print(f"Failed requests (4xx/5xx/Error): {fail_count}")
    print(f"Total warmup duration: {end_warmup_time - start_warmup_time:.2f} seconds")
    if success_count > 0:
        avg_time = total_request_time / success_count
        print(f"Average response time (successful requests): {avg_time:.3f} seconds")
    print("--------------------\n")
