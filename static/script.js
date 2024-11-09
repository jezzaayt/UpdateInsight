document.addEventListener('DOMContentLoaded', () => {
    const accordionGroups = document.querySelectorAll('.accordion-group');
  
   
    accordionGroups.forEach(group => {
      const accordionButton = group.querySelector('.accordion-button');
  
      const accordionBody = group.querySelector('.accordion-body');
  
      accordionButton.addEventListener('click', () => {
  
        if (accordionBody.classList.contains('show')) {
          accordionBody.classList.remove('show');
          accordionButton.setAttribute('aria-expanded', 'false');
        } else {
          accordionBody.classList.add('show');
          accordionButton.setAttribute('aria-expanded', 'true');
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
              <br> Group is the group you want it to be called on the page, this is case sensitive, so tech and Tech would be two different groupings. `,
        callback: function (value) {
            if (value) {
                console.log('User clicked OK');
            } else {
                console.log('User clicked Cancel');
            }
        }
    });
  }
