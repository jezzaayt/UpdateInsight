
# Insight Updates

This Flask application allows users to monitor specified websites for changes. When a change is detected, users are notified via `Notyf` notifications, and the last checked time is dynamically updated without reloading the page. This setup uses AJAX to make seamless requests to the server and display the notifications.

## Features

- **Website Monitoring**: Monitor specified websites for content changes, with user-friendly notifications powered by [`Notyf`](https://github.com/caroso1222/notyf).
- **Modals and Prompts**: Leverage [`Vex`](https://github.com/HubSpot/vex/) for intuitive modals and confirmation prompts, enhancing user interaction.
- **AJAX Updates**: Check for updates seamlessly without page reloads, ensuring a smoother user experience.
- **Persistance Local Storage**: Save user preferences, such as group order or toggle visibility, locally on the user's machine.
- **Flexible Grouping and Item Organization**: Reorganize groups and items effortlessly to match user preferences.
- **Downloadability File Export**: Add the ability to export item data from JSON to CSV or XLSX files for external use.
- **Keyword Detection**: Configure keywords to monitor and receive alerts whenever these keywords are detected in newly added text.

## Prerequisites

- **Python 3.8+**
- **Flask**: `pip install flask`
- **Requests**: `pip install requests`
- **BeautifulSoup4**: `pip install beautifulsoup4`
- **Openpyxl**: `pip install openpyxl`

## Project Structure

```
project-directory/
├── static/
│   ├─  styles.css            # Custom styles for the app
│   ├─  script.js             # For button handling 
│   ├─  notifications.js      # JavaScript for Notyf and AJAX handling
├── templates/
│   ├── index.html              # Main HTML template
│   ├── table.html              # Main table template
├── app.py                      # Main Flask application file
├── table.py                    # Table Flask file
└── README.md                   # Project documentation
```

## Usage

1. **Adding a Website**:
   - On the main page, add a website URL and a selector (optional) to monitor specific elements on the page.

2. **Checking for Changes**:
   - Click on the "Check for Changes" button next to a website entry. This sends an AJAX request to the Flask backend to check for any updates on the website.
   - If changes are detected, a notification will appear, and the "Last Checked" time will be updated dynamically.
3. **Show Content**:
    - Allows a Notyf to show the previous saved content of the page

## Themes
Switching themes on the top right icon button. 

- **Bright Theme**
   - Bright, with yellow more of a light mode but with yellow background over white.

- **Dark Theme**
   - A usual dark mode/theme with black theme. 


## Future Enhancements

- **Version History**: Storage of all changes including the date and text each.

