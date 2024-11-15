document.addEventListener("DOMContentLoaded", function() {
    document.body.addEventListener('click', function(event) {
        if (event.target.closest('.toggle-visibility')) {
            const toggleSpan = event.target.closest('.toggle-visibility');
            const url = toggleSpan.getAttribute('data-url');
            const encodedUrl = encodeURIComponent(url);

            console.log("Visibility toggle clicked for URL:", encodedUrl);

            fetch(`/table/visibility/${encodedUrl}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Updated visibility:', data);
                const icon = toggleSpan.querySelector('i');
                if (data.visibility) {
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                } else {
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
});
