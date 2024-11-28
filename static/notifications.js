document.addEventListener('DOMContentLoaded', function() {
    // Attach event listener to buttons with class 'check-changes-btn'

    const notyf = new Notyf({
  duration: 2000,
  dismissible: true});
    
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
                    const buttons = document.querySelectorAll('.notyf__dismiss-btn');
                    buttons.forEach(button => button.click());
                    notyf.success(data.message);


                    


                } else {
                    // Display error notification if no changes or an issue occurred
                    notyf.error(data.message);
                }
            })
            .catch(error => {
                // Handle any errors in the request
                const buttons = document.querySelectorAll('.notyf__dismiss-btn');
                buttons.forEach(button => button.click());
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
            // console.log('baseUrl:', baseUrl);
            // console.log('url:', url);
            // console.log('rawBaseUrl:', rawBaseUrl);
            const rURL = rawBaseUrl.replace("amp;","")
            // console.log('rURL:', rURL);
            fetch(`/get_previous_content/${rURL}`)
                

                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Safely check for data availability
                    // console.log('data:', data);
                    const currentBaseUrl = baseUrl;
                    // console.log('currentBaseUrl:', currentBaseUrl);
                    
                    if (data && Object.keys(data).length > 0) {
                        // console.log('data:', data);
                        // console.log(Object.keys(data));
                        objN = currentBaseUrl
                        const previousContent = data.previous_content || data.original_content || "No previous content available";
                        const lastCheckedDate = data.last_checked || "N/A";
                        const addedDate = data.added_date || "N/A";
                        const title = data.title || "N/A";
                        const keyword = data.keywords || "";
                        const keywordFound = keyword.some(keyword => previousContent.toLowerCase().includes(keyword.toLowerCase()));
                        const buttons = document.querySelectorAll('.notyf__dismiss-btn');
                        buttons.forEach(button => button.click());
                        if (lastCheckedDate === "N/A") {
                            notyf.success(`Current content for ${rURL} <br>Title: ${title}<br> ${previousContent}<br>Added Date: ${addedDate}${keywordFound ? `<br>Keyword ${keyword} found` : ""}`);
                            
                        } else {
                            notyf.success(`Current content for ${rURL} <br>Title: ${title}<br> ${previousContent}<br>Last checked: ${lastCheckedDate}${keywordFound ? `<br>Keyword ${keyword} found` : ""}`);
                        }
                    } else {
                        
                        
                        const buttons = document.querySelectorAll('.notyf__dismiss-btn');
                        buttons.forEach(button => button.click());
                        notyf.error({
                            message: `No data found for: <br>${rURL}<br> Check Changes or visit the URL`,
                            })
                       

                    }
                })
                .catch(error => {
                    // console.error('Fetch error:', error);
                    // console.log('url:', url);
                    // console.log("Error:", error);
                    const buttons = document.querySelectorAll('.notyf__dismiss-btn');
                    buttons.forEach(button => button.click());
                    notyf.error(`An error occurred while fetching data: ${error}`);
                    
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
              <br> CSS Selector is optional, if you want to grab a specific part of the website to update. This will grab the first element of this name
              <br> If the URL is not in the list, it will be added to the list. If you want to remove a URL, you can click the X next to it.
              <br> If there is a ? in the URL, when showning the content or checking for changes, it will conduct a simple wildcard match. So if mulitple of similar it may not be the best option`
              ,
        callback: function (value) {
            if (value) {
                 console.log('User clicked OK');
            } else {
                 console.log('User clicked Cancel');
            }
        }
    });
  }

  

function removeToggle(event) {
const item = event.target.dataset.item;
console.log(item);
if (item) {
    vex.dialog.confirm  ({
  
    unsafeMessage: `   <i id="theme-icon-warning" class="fa fa-exclamation-circle"></i>&ensp; &emsp;Confirmation:
<br>Are you sure you wish to delete this item?
<br>This action cannot be undone.`,
buttons: [
    // Customizing the Confirm button
    {
      text: 'Discard Item', // Custom text
      type: 'button',
      className: 'vex-dialog-button-primary',
      click: function () {
        console.log('Confirmed!');
        // call back to python to remove
        fetch(`/remove/${encodeURIComponent(item)}`, {
          method: 'POST'
        })
          .then(response => {
            console.log('Response received:', response);
            window.location.reload();
            return response.json();
          })
          .then(data => {
            console.log('Data received:', data);
            window.location.reload();
          })
          .catch(error => {
            console.error('Error occurred:', error);
          });
        vex.close(this);
      }
    },
    // Customizing the Cancel button
    {
      text: 'Dismiss', // Custom text
      type: 'button',
      className: 'vex-dialog-button-secondary',
      click: function () {
        console.log('Cancelled!');
        vex.close(this);
      }
    }
  ],
  callback: function (value) {
    if (value) {
      console.log('Confirmed!');
    } else {
      console.log('Cancelled!');
    }
  }
});
} else {
    console.error('Item is not defined');
}
}