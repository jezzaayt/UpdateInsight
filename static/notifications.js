document.addEventListener('DOMContentLoaded', function() {
    // Attach event listener to buttons with class 'check-changes-btn'

    const notyf = new Notyf({
  duration: 2500});
    
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
                
                notyf.error("Error checking website changes.");
            });
            console.log(notyf.options.width)
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
            console.log('rawBaseUrl:', rawBaseUrl);
            const rURL = rawBaseUrl.replace("amp;","")
            console.log('rURL:', rURL);
            fetch(`/get_previous_content/${rURL}`)
                

                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Safely check for data availability
                    console.log('data:', data);
                    const currentBaseUrl = baseUrl;
                    console.log('currentBaseUrl:', currentBaseUrl);
                    
                    if (data && Object.keys(data).length > 0) {
                        console.log('data:', data);
                        console.log(Object.keys(data));
                        objN = currentBaseUrl
                        const previousContent = data.previous_content || "No previous content available";
                        const lastCheckedDate = data.last_checked || "N/A";
                        const title = data.title || "N/A";
                        notyf.success(`Current content for ${rURL} <br>Title: ${title}<br> ${previousContent}<br>Last checked:${lastCheckedDate}`);

                    } else {
                        
                        
                        
                        notyf.error({
                            message: `No data found for: <br>${rURL}<br> Check Changes or visit the URL`,
                            })
                       

                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    console.log('url:', url);
                    console.log("Error:", error);
                    notyf.error('An error occurred while fetching data.');
                });
                
                
        });
    });


   
});

function toggleInfo() {
    vex.dialog.alert({
        unsafeMessage: `   <i id="theme-icon-info" class="fa fa-info-circle"></i>&ensp; &emsp;Information:
              <br>URL is the website link
              <br>Title is the title you want it to be called on the page.
              <br> Group is the group you want it to be called on the page, this is case sensitive, so tech and Tech would be two different groupings.
              <br> Group Order is persistance on local storage. You can move the group up or down, this is to keep the order of your groups.
              <br> CSS Selector is optional, if you want to grab a specific part of the website to update. This will grab the first element of this name`,
        callback: function (value) {
            if (value) {
                console.log('User clicked OK');
            } else {
                console.log('User clicked Cancel');
            }
        }
    });
  }