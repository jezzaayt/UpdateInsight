from flask import Flask, render_template, request, redirect, url_for, flash
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

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
def get_content(url, selector):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        target_content = soup.select_one(selector)
        content = target_content.get_text(strip=True) if target_content else None
        return content, None  # Return content and None for error
    except requests.RequestException as e:
        return None, str(e)  # Return None for content and the error message

@app.route("/", methods=["GET", "POST"])
def index():
    url_data = load_data()

    # Handle form submission for new URL and selector
    if request.method == "POST":
        url = request.form.get("url")
        selector = request.form.get("selector")
        if url and selector:
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M")
            url_data[url] = {
                "selector": selector,
                "previous_content": None,
                "added_date": current_time,
                "last_checked": None
            }
            save_data(url_data)
            flash("URL added successfully!", "success")
        else:
            flash("Please enter both URL and selector.", "error")
        return redirect(url_for("index"))

    # Render the HTML page with the URL data
    return render_template("index.html", url_data=url_data)

@app.route("/check/<path:url>")
def check_website_changes(url):
    url_data = load_data()
    data = url_data.get(url)
    if data:
        selector = data["selector"]
        current_content, error_message = get_content(url, selector)
        
        if current_content:
            previous_content = data["previous_content"]
            if previous_content and current_content != previous_content:
                flash(f"Changes detected for {url}!", "info")
            data["previous_content"] = current_content
            data["last_checked"] = datetime.now().strftime("%Y-%m-%d %H:%M")
            save_data(url_data)
        elif error_message:
            flash(f"Error fetching {url}: {error_message}", "error")

    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)
