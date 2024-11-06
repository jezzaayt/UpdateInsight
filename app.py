from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import requests
from flask_cors import CORS

from bs4 import BeautifulSoup
import json
from datetime import datetime
import hashlib
from apscheduler.schedulers.background import BackgroundScheduler


app = Flask(__name__)

# Set a dummy secret key to avoid session errors
app.secret_key = 'dummy_secret_key'  # You can change this to any random string

# Load or initialize URL tracking data
def load_data():
    try:
        with open("url_data.json", "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

# Save URL tracking data
def save_data(url_data):
    with open("url_data.json", "w") as file:
        json.dump(url_data, file)
# Check website content for changes
def get_content(url, selector=None):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        if selector:
            target_content = soup.select_one(selector)
            content_text = target_content.get_text(strip=True) if target_content else ""
        else:
            content_text = soup.get_text(strip=True)  # Get the entire text if no selector

        content_hash = hashlib.sha256(content_text.encode()).hexdigest()  # Compute the hash
        return content_text, content_hash, None  # Return content and hash
    except requests.RequestException as e:
        return None, None, str(e)

@app.route('/edit_title', methods=['POST'])
def edit_title():
    url = request.form.get('url')
    new_title = request.form.get('new_title')
    url_data = load_data()
    if url in url_data:
        url_data[url]['title'] = new_title
        save_data(url_data)
        flash('Title updated successfully!', 'success')
    else:
        flash('Error updating title', 'error')
    return redirect(url_for('index'))

def get_change_snippet(previous_content, current_content):
    # Extract a simple snippet showing the first 50 characters of each for comparison
    previous_snippet = previous_content[:80]
    current_snippet = current_content[:80]
    
    # Return a formatted string showing the change
    return f"Previous: '{previous_snippet}' | Current: '{current_snippet}'"
@app.route("/", methods=["GET", "POST"])
def index():
    url_data = load_data()

    # Handle form submission for new URL and optional selector
    # if https is not in the url add it
    grouped_url_data = {}
    
    for url, data in url_data.items():
        group = data.get('group')
        if group not in grouped_url_data:
            grouped_url_data[group] = []
        grouped_url_data[group].append((url, data))

    if request.method == "POST":
        url = request.form.get("url")
        title = request.form.get("title")
        selector = request.form.get("selector")  # Optional selector input
        group = request.form.get("group")
        # Always add https:// prefix to the URL
        if not url.startswith("https://"):
            url = "https://" + url

        if url:
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M")
            if url in url_data:
                url_data[url]["title"] = title
                url_data[url]["selector"] = selector
            else:
                url_data[url] = {
                    "url": url,
                    "title": title,
                    "selector": selector,  # Store selector, can be None
                    "previous_content_hash": None,
                    "previous_content": None,
                    "added_date": current_time,
                    "last_checked": None,
                    "group": group  # Add group to the URL data
                }
            flash(f"URL added successfully! Title: {title}", "success")
            save_data(url_data)
        else:
            flash("Please enter a URL.", "error")

        return redirect(url_for("index"))

    # Render the HTML page with the URL data
    return render_template("index.html", grouped_url_data=grouped_url_data)

@app.route("/go_to_website", methods=["GET"])
def go_to_website():
    url = request.args.get("url")
    return redirect(url)

@app.route('/check-changes', methods=['POST'])
def check_changes():
    # Handle the request here
    return jsonify({'message': 'Changes detected'})

@app.route("/check/<path:url>")
def check_website_changes(url):
    url_data = load_data()
    data = url_data.get(url)
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'

    if not data:
        if is_ajax:
            return jsonify({"status": "error", "message": f"Website {url} not found in the database."})
        return redirect(url_for("index"))

    # Use a default selector if none is provided
    selector = data.get("selector")
    if not selector:
        # Handle the case where no selector is available
        selector = None  # Or set a default value if needed
    
    # Fetch the content
    current_content, current_hash, error_message = get_content(url, selector)

    if current_content:
        previous_content = url_data[url].get("previous_content")
        if previous_content and current_content != previous_content:
            change_snippet = get_change_snippet(previous_content, current_content)
            if is_ajax:
                # Update last checked time here if changes are detected
                url_data[url]["last_checked"] = datetime.now().strftime("%Y-%m-%d %H:%M")
                save_data(url_data)  # Save updated data
                return jsonify({
                    "status": "success",
                    "message": f"Changes detected for {url}! Here's a snippet of the changes: {change_snippet}"
                })
        else:
            if is_ajax:
                # If no changes detected, update last checked time
                url_data[url]["last_checked"] = datetime.now().strftime("%Y-%m-%d %H:%M")
                save_data(url_data)  # Save updated data
                return jsonify({"status": "success", "message": "No changes detected."})
    
    elif error_message:
        if is_ajax:
            return jsonify({"status": "error", "message": f"Error fetching {url}: {error_message}"})
        else:
            return redirect(url_for("index"))

    # If no changes, ensure last checked time is updated
    url_data[url]["previous_content"] = current_content
    url_data[url]["last_checked"] = datetime.now().strftime("%Y-%m-%d %H:%M")
    save_data(url_data)

    if not is_ajax:
        return redirect(url_for("index"))

@app.route("/remove/<path:url>", methods=["POST"])
def remove_url(url):
    url_data = load_data()
    if url in url_data:
        del url_data[url]  # Remove the URL from the data
        save_data(url_data)  # Save the updated data
        flash(f"Removed {url} successfully!", "success")
    else:
        flash(f"{url} not found!", "error")
    return redirect(url_for("index"))

if __name__ == "__main__":

    app.run(host="0.0.0.0", port=5000, debug=True)
    


