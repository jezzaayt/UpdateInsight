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

  function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    if (body.classList.contains('dark-mode')) {
      body.classList.remove('dark-mode');
      themeIcon.classList.remove('fas fa-moon');
      themeIcon.classList.add('fas fa-sun');
    } else {
      body.classList.add('dark-mode');
      themeIcon.classList.remove('fas fa-sun');
      themeIcon.classList.add('fas fa-moon');
    }
  }