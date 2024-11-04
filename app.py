from flask import Flask, render_template, request, redirect, url_for, flash
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import hashlib

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

@app.route("/", methods=["GET", "POST"])
def index():
    url_data = load_data()

    # Handle form submission for new URL and optional selector
    if request.method == "POST":
        url = request.form.get("url")
        selector = request.form.get("selector")  # Optional selector input
        if url:
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M")
            url_data[url] = {
                "selector": selector,  # Store selector, can be None
                "previous_content_hash": None,
                "previous_content": None,
                "added_date": current_time,
                "last_checked": None
            }
            save_data(url_data)
            flash("URL added successfully!", "success")
        else:
            flash("Please enter a URL.", "error")
        return redirect(url_for("index"))

    # Render the HTML page with the URL data
    return render_template("index.html", url_data=url_data)
@app.route("/check/<path:url>")
def check_website_changes(url):
    url_data = load_data()
    data = url_data.get(url)
    
    if data:
        selector = data.get("selector")  # Get the selector from the data
        current_content, current_hash, error_message = get_content(url, selector)

        if current_hash:
            previous_hash = data.get("previous_content_hash")
            if previous_hash and current_hash != previous_hash:
                flash(f"Changes detected for {url}!", "info")
                # Optionally store the current content if changes are detected
                data["previous_content"] = current_content
            # Update both the content and the hash
            data["previous_content_hash"] = current_hash
            data["last_checked"] = datetime.now().strftime("%Y-%m-%d %H:%M")
            save_data(url_data)
        elif error_message:
            flash(f"Error fetching {url}: {error_message}", "error")

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


