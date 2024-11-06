
# UpdateInsight

This Flask application allows users to monitor specified websites for changes. When a change is detected, users are notified via `Notyf` notifications, and the last checked time is dynamically updated without reloading the page. This setup uses AJAX to make seamless requests to the server and display the notifications.

## Features

- **Website Monitoring**: Check for content changes on specified websites.
- **Real-Time Notifications**: Display changes using `Notyf` notifications in a user-friendly way.
- **AJAX Updates**: Avoid page reloads when checking for updates, improving the user experience.


## Prerequisites

- **Python 3.8+**
- **Flask**: `pip install flask`
- **Notyf.js**: Installed as a static resource in your project.

## Project Structure

```
project-directory/
├── static/
│   ├─
│   │  styles.css          # Custom styles for the app
│   ├   script.js # For button handling 
│   │  notifications.js    # JavaScript for Notyf and AJAX handling
├── templates/
│   ├── index.html              # Main HTML template
├── app.py                      # Main Flask application file
└── README.md                   # Project documentation
```

## Usage

1. **Adding a Website**:
   - On the main page, add a website URL and a selector (optional) to monitor specific elements on the page.

2. **Checking for Changes**:
   - Click on the "Check for Changes" button next to a website entry. This sends an AJAX request to the Flask backend to check for any updates on the website.
   - If changes are detected, a notification will appear, and the "Last Checked" time will be updated dynamically.




## Future Enhancements

- **Dynamic Content Update**: Automatic updates at regular intervals, eliminating the need to manually click a button every few hours.
- **Flexible Grouping and Item Organization**: Easily reorder both groups and their contained items to suit your preferences.