document.addEventListener('DOMContentLoaded', () => {
    const accordionGroups = document.querySelectorAll('.accordion-group');
  
   
    accordionGroups.forEach(group => {
        const accordionButton = group.querySelector('.accordion-button');
        const accordionBody = group.querySelector('.accordion-body');
        const groupId = group.getAttribute('data-group'); // Use 'data-group' as unique ID for each group
    
        // Check localStorage for the saved state of each group
        const savedState = localStorage.getItem(groupId);
        if (savedState === 'true') {
          accordionBody.classList.add('show');
          accordionButton.setAttribute('aria-expanded', 'true');
        } else {
          accordionBody.classList.remove('show');
          accordionButton.setAttribute('aria-expanded', 'false');
        }
    
        // Toggle visibility and save state to localStorage on button click
        accordionButton.addEventListener('click', () => {
          if (accordionBody.classList.contains('show')) {
            accordionBody.classList.remove('show');
            accordionButton.setAttribute('aria-expanded', 'false');
            // Save the collapsed state to localStorage
            localStorage.setItem(groupId, 'false');
          } else {
            accordionBody.classList.add('show');
            accordionButton.setAttribute('aria-expanded', 'true');
            // Save the expanded state to localStorage
            localStorage.setItem(groupId, 'true');
          }
      });
    });
  });

  function applyTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = localStorage.getItem('theme');
  
    if (body && themeIcon) {
      if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.classList.remove('fas', 'fa-sun');
        themeIcon.classList.add('fas', 'fa-moon');
      } else {
        body.classList.remove('dark-mode');
        themeIcon.classList.remove('fas', 'fa-moon');
        themeIcon.classList.add('fas', 'fa-sun');
      }
    }
  }
  
  function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = localStorage.getItem('theme');
  
    if (currentTheme === 'light') {
      localStorage.setItem('theme', 'dark');
      console.log('Theme saved as dark');

      
      applyTheme();
    } else {
      localStorage.setItem('theme', 'light');
      console.log('Theme saved as light');
      applyTheme();
    }
  }
  
  // Call applyTheme when the page loads
  applyTheme();
  
  window.addEventListener('DOMContentLoaded', applyTheme);


  function toggleInfo() {
    vex.dialog.alert({
        unsafeMessage: `Information For the page.
              <br>URL is the website link
              <br>Title is the title you want it to be called on the page.
              <br> Group is the group you want it to be called on the page, this is case sensitive, so tech and Tech would be two different groupings.
              <br> Group Order is persistance on local storage. You can move the group up or down, this is to keep the order of your groups.`,
        callback: function (value) {
            if (value) {
                console.log('User clicked OK');
            } else {
                console.log('User clicked Cancel');
            }
        }
    });
  }

  function moveGroup(event, direction) {
    const groupDiv = event.target.closest('.accordion-group'); // Find the clicked group
    const parentDiv = document.querySelector('.accordion-container'); // Find the parent container
  
    if (direction === 'up' && groupDiv.previousElementSibling) {
      parentDiv.insertBefore(groupDiv, groupDiv.previousElementSibling); // Move the group up
    } else if (direction === 'down' && groupDiv.nextElementSibling) {
      parentDiv.insertBefore(groupDiv.nextElementSibling, groupDiv); // Move the group down
    }
  
    // Save the new order in localStorage
    saveOrderToLocalStorage();
  }
  
  function saveOrderToLocalStorage() {
    const groups = document.querySelectorAll('.accordion-group');
    
    // Log to see the elements you're selecting
    console.log(groups);
  
    // Check what data-group values you're collecting
    const groupOrder = Array.from(groups).map(group => group.getAttribute('data-group'));
    
    // Log the extracted groupOrder to check what you're getting
    console.log(groupOrder);
  
    // Store the data in localStorage
    localStorage.setItem('groupOrder', JSON.stringify(groupOrder));
  
    // Log to verify it's stored correctly
    console.log('Data saved to localStorage:', JSON.parse(localStorage.getItem('groupOrder')))
    console.log(document.querySelectorAll('.accordion-group')); // Should show the actual DOM elements

  }
  function restoreOrderFromLocalStorage() {
    const savedOrder = JSON.parse(localStorage.getItem('groupOrder')); // Retrieve saved order
    if (savedOrder) {
      const parentDiv = document.querySelector('.accordion-container'); // Get the parent container
  
      savedOrder.forEach(groupName => {
        const groupDiv = document.querySelector(`.accordion-group[data-group="${groupName}"]`); // Find each group by its data-group attribute
        if (groupDiv) {
          parentDiv.appendChild(groupDiv); // Reorder the groups in the container
        }
      });
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    restoreOrderFromLocalStorage(); // Restore the order when the page loads
  });
  