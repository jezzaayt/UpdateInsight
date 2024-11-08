document.addEventListener('DOMContentLoaded', function() {
    // Attach event listener to buttons with class 'check-changes-btn'
    let urlData;
    fetch('/get_previous_content')
  .then(response => response.json())
  .then(data => {
    urlData = data;
    console.log('urlData:', urlData);
  });
    document.querySelectorAll('.check-changes-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the form from submitting and page refresh
            
            // Get the URL from the button's data attribute
            const url = button.getAttribute('data-url');
            
            // Create an AJAX request using Fetch API
            fetch(url, {
                method: 'GET', // Use GET method
                headers: {
                    'X-Requested-With': 'XMLHttpRequest', // Indicate it's an AJAX request
                },
            })
            .then(response => response.json()) // Expecting JSON response from the backend
            .then(data => {
                const notyf = new Notyf();
                if (data.status === 'success') {
                    // Display success notification if changes are detected
                    notyf.success(data.message);
                } else {
                    // Display error notification if no changes or an issue occurred
                    notyf.error(data.message);
                }
            })
            .catch(error => {
                // Handle any errors in the request
                const notyf = new Notyf();
                notyf.error("Error checking website changes.");
            });
        });
    });
    document.querySelectorAll('.show-content-btn').forEach(button => {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          const url = button.getAttribute('data-url');
          console.log('url:', url);
          console.log('urlData:', urlData);
          const baseUrl = url.split('?')[1].replace("url=", ""); // extract the base URL
          const notyf = new Notyf();
          if (urlData && urlData[baseUrl]) {
            const lastCheckedDate = urlData[baseUrl].last_checked;
            console.log('lastCheckedDate:', lastCheckedDate);
            notyf.success(`Current content for ${baseUrl}: ${urlData[baseUrl].previous_content}<br>Last checked: ${lastCheckedDate}`);
            } else {
            notyf.error(`No data found for ${baseUrl}<br>Last checked: N/A`);
            }
        });
      });
});
