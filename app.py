from flask import Flask, render_template, request, redirect, url_for, flash
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import hashlib
from apscheduler.schedulers.background import BackgroundScheduler


app = Flask(__name__)

# Set a dummy secret key to avoid session errors
app.secret_key = 'dummy_secret_key'  # You can change this to any random string

scheduler = BackgroundScheduler()
auto_check_enabled = True

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

def check_all_websites():
    url_data = load_data()
    for url, data in url_data.items():
        if data["previous_content"] is not None:  # Only check if the content has been previously recorded
            selector = data.get("selector", None)
            current_content, error_message = get_content(url, selector)
            
            if current_content:
                previous_content = data["previous_content"]
                
                # Check for changes
                if previous_content and current_content != previous_content:
                    # Get a snippet of the changes
                    change_snippet = get_change_snippet(previous_content, current_content)
                    flash(f"Changes detected for {url}! Here's a snippet of the changes: {change_snippet}", "info")
                
                # Update previous content and last checked time
                data["previous_content"] = current_content
                data["last_checked"] = datetime.now().strftime("%Y-%m-%d %H:%M")
            elif error_message:
                flash(f"Error fetching {url}: {error_message}", "error")

    save_data(url_data)
def schedule_auto_check():
    if auto_check_enabled:
        scheduler.add_job(func=check_all_websites, trigger="interval", hours=1, id='check_all_websites')
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
    previous_snippet = previous_content[:50]
    current_snippet = current_content[:50]
    
    # Return a formatted string showing the change
    return f"Previous: '{previous_snippet}' | Current: '{current_snippet}'"
@app.route("/", methods=["GET", "POST"])
def index():
    url_data = load_data()

    # Handle form submission for new URL and optional selector
    # if https is not in the url add it
    
    if request.method == "POST":
        url = request.form.get("url")
        title = request.form.get("title")
        selector = request.form.get("selector")  # Optional selector input

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
                    "title": title,
                    "selector": selector,  # Store selector, can be None
                    "previous_content_hash": None,
                    "previous_content": None,
                    "added_date": current_time,
                    "last_checked": None
                }
            flash("URL added successfully!", "success")
            save_data(url_data)
        else:
            flash("Please enter a URL.", "error")

        return redirect(url_for("index"))

    # Render the HTML page with the URL data
    return render_template("index.html", url_data=url_data)

@app.route("/go_to_website", methods=["GET"])
def go_to_website():
    url = request.args.get("url")
    return redirect(url)

@app.route("/check/<path:url>")
def check_website_changes(url):
    url_data = load_data()
    data = url_data.get(url)
    
    if data:
        selector = data.get("selector")  # Get the selector from the data
        current_content, current_hash, error_message = get_content(url, selector)

        if current_content:
            previous_content = url_data[url].get("previous_content")

            if previous_content and current_content != previous_content:
                change_snippet = get_change_snippet(previous_content, current_content)

                flash(f"Changes detected for {url}! ", "info")
                flash(f"Here's a snippet of the changes: {change_snippet}", "info")


            url_data[url]["previous_content"] = current_content
            url_data[url]["last_checked"] = datetime.now().strftime("%Y-%m-%d %H:%M")
        elif error_message:
            flash(f"Error fetching {url}: {error_message}", "error")
        # if current_hash:
        #     previous_hash = data.get("previous_content_hash")
        #     if previous_hash and current_hash != previous_hash:

        #         flash(f"Changes detected for {url}!", "info")

        #         # Optionally store the current content if changes are detected
        #         data["previous_content"] = current_content
        #     # Update both the content and the hash
        #     data["previous_content_hash"] = current_hash
         #   data["last_checked"] = datetime.now().strftime("%Y-%m-%d %H:%M")
    save_data(url_data)
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

@app.route("/toggle_auto_check")
def toggle_auto_check():
    global auto_check_enabled
    auto_check_enabled = not auto_check_enabled
    status = "enabled" if auto_check_enabled else "disabled"
    flash(f"Automatic checking is now {status}.", "success")
    
    if auto_check_enabled:
        schedule_auto_check()  # Reschedule automatic checks if enabled
    else:
        try:
            scheduler.remove_job('check_all_websites')  # Remove the job if disabled
        except KeyError:
            pass

    return redirect(url_for("index"))
scheduler.start()
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


