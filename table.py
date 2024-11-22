import json
import csv
import io 
import functions
from flask import Blueprint, render_template, jsonify, request, send_file, Response
from openpyxl import Workbook

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
    try:
        # Load the data from the file
        with open('url_data.json', 'r') as file:
            data = json.load(file)

        # Find the item and toggle the visibility
        for item in data.values():
            if item['url'] == url:
                item['visibility'] = not item['visibility']
                break
        else:
            return jsonify({"error": "URL not found"}), 404
        # Save the updated data back to the file
        with open('url_data.json', 'w') as file:
            json.dump(data, file, indent=4)

        return jsonify({"visibility": item['visibility']})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@table_blueprint.route('/download_data', methods=['POST'])
def download_data():
    url_data = functions.load_data()

     # Get the data to be downloaded
    data = []  # Replace with your actual data
    grouped_url_data = {}
    for url, data in url_data.items():
        group = data.get('group')
        if group not in grouped_url_data:
            grouped_url_data[group] = []
        grouped_url_data[group].append((url, data))
    print(data)
 

    # Get the file format from the request
    file_format = request.form.get('file_format')
    print("File format:", file_format)
    if file_format == 'csv':
        # Create a CSV file
        
        csv_file = io.StringIO()
        csv_writer = csv.writer(csv_file)
        csv_writer.writerow(['Group', 'URL', 'Title', 'Selector', 'Added Date', 'Last Checked', "Content"]) 
        for group, items in grouped_url_data.items():
            for item in items:
                csv_writer.writerow([
                            group, 
                            item[0], 
                            item[1]['title'], 
                            item[1]['selector'], 
                            item[1]['added_date'], 
                            item[1]['last_checked'],
                            item[1]['previous_content']
                        ])        
        csv_file.seek(0)
        return Response(csv_file, mimetype='text/csv', headers={'Content-Disposition': 'attachment;filename=data.csv'})
    elif file_format == 'xlsx':
            # Create an XLSX file
            wb = Workbook()
            ws = wb.active
            ws.title = 'Data'
            ws.append(['Group', 'URL', 'Title', 'Selector', 'Added Date', 'Last Checked', "Content"])  # Header row
            for group, items in grouped_url_data.items():
                for item in items:
                    ws.append([
                        group, 
                        item[0], 
                        item[1]['title'], 
                        item[1]['selector'], 
                        item[1]['added_date'], 
                        item[1]['last_checked'],
                        item[1]['previous_content']
                    ])
            xlsx_file = io.BytesIO()
            wb.save(xlsx_file)
            xlsx_file.seek(0)
            return Response(xlsx_file, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers={'Content-Disposition': 'attachment;filename=data.xlsx'})
    else:
        return 'Invalid file format', 400
@table_blueprint.route('/')
def table():
    data = get_all_data(return_response=False)  # Get raw data
    if isinstance(data, dict) and "error" in data:
        data = []  # Handle errors gracefully
    return render_template('table.html', data = data.values())



