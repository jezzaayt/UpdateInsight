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
    
            // Get the URL and remove the prefix
            const url = button.getAttribute('data-url').replace('/get_previous_content/', '');
            const rawBaseUrl = url.replace('/get_previous_content?url=', '');
            
            // Decode the base URL to fix any over-encoding
            const baseUrl = decodeURIComponent(rawBaseUrl).replace("/get_previous_content/","");
            
            console.log('baseUrl:', baseUrl);
            console.log('url:', url);
    
            fetch(`/get_previous_content/${baseUrl}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Safely check for data availability
                    const notyf = new Notyf();
                    const currentBaseUrl = baseUrl;
                    
                    if (data && Object.keys(data).length > 0) {
                        console.log('data:', data);
                        console.log(Object.keys(data));
                        objN = currentBaseUrl
                        const previousContent = data.previous_content || "No previous content available";
                        const lastCheckedDate = data.last_checked || "N/A";
                        
                        console.log('previousContent:', previousContent);
                        console.log('lastCheckedDate:', lastCheckedDate);
    
                        notyf.success(`Current content for ${currentBaseUrl}: ${previousContent}<br>Last checked: ${lastCheckedDate}`);
                    } else {
                        console.log('data:', data);
                        console.log('No data found for:', currentBaseUrl);
                        const notyf = new Notyf();
                        
                        notyf.error({
                            message: `No data found for: <br>${currentBaseUrl}<br> Check Changes or visit the URL`,
                            duration: 3000,
                            dismissible: true,})
                       

                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    const notyf = new Notyf();
                    notyf.error('An error occurred while fetching data.');
                });
                
        });
    });


   
});
