from flask import Blueprint, render_template, jsonify
import json

table_blueprint = Blueprint('table', __name__)


@table_blueprint.route('/data', methods=['GET'])
def get_all_data(return_response=True):
    try:
        with open('url_data.json', 'r') as file:
            data = json.load(file)
        if return_response:
            return jsonify(data)  # Return Flask Response for API calls
        return data  # Return raw data for internal use
    except (FileNotFoundError, json.JSONDecodeError):
        error = {"error": "Data not found or invalid format"}
        if return_response:
            return jsonify(error), 404
        return error  # Return error as raw data


@table_blueprint.route('/visibility/<path:url>', methods=['PUT'])
def set_visibility(url):
    print(f"Received PUT request to toggle visibility for URL: {url}")  # Add this line
    try:
        # Log the received URL
        print(f"Received PUT request to toggle visibility for URL: {url}")

        # Load the data from the file
        with open('url_data.json', 'r') as file:
            data = json.load(file)

        # Find the item and toggle the visibility
        for item in data.values():
            if item['url'] == url:
                item['visibility'] = not item['visibility']
                print(f"Visibility for {url} toggled: {item['visibility']}")
                break
        else:
            return jsonify({"error": "URL not found"}), 404

        # Save the updated data back to the file
        with open('url_data.json', 'w') as file:
            json.dump(data, file, indent=4)

        return jsonify({"visibility": item['visibility']})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@table_blueprint.route('/')
def table():
    data = get_all_data(return_response=False)  # Get raw data
    if isinstance(data, dict) and "error" in data:
        data = []  # Handle errors gracefully
    return render_template('table.html', data = data.values())


