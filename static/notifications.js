document.addEventListener('DOMContentLoaded', function() {
    // Attach event listener to buttons with class 'check-changes-btn'
    let urlData;
   
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
          const baseUrl = url.replace('/get_previous_content?url=', '').split("content/")[1];
          console.log('baseUrl:', baseUrl.split("content/")[1]);
            console.log('baseUrl:', baseUrl);
            console.log('url:', url);
          fetch(`/get_previous_content/${baseUrl}`)
            .then(response => response.json())
            .then(data => {
              const notyf = new Notyf();
              const currentBaseUrl = baseUrl; // Define baseUrl within the inner scope
              if (data) {
                const lastCheckedDate = data.last_checked;
                console.log('lastCheckedDate:', lastCheckedDate);
                notyf.success(`Current content for ${currentBaseUrl}: ${data.previous_content}<br>Last checked: ${lastCheckedDate}`);
              } else {
                console.log('No data found for:', currentBaseUrl);
                notyf.error(`No data found for ${currentBaseUrl}<br>Last checked: N/A`);
              }
            });
        });
      });


   
});
