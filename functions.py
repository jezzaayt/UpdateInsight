import json


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
