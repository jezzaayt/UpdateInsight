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