document.addEventListener('DOMContentLoaded', () => {
    const accordionGroups = document.querySelectorAll('.accordion-group');
  
    accordionGroups.forEach(group => {
      const accordionButton = group.querySelector('.accordion-button');
      console.log(accordionButton); // Check if the accordionButton element is being selected correctly
  
      const accordionBody = group.querySelector('.accordion-body');
      console.log(accordionBody); // Check if the accordionBody element is being selected correctly
  
      accordionButton.addEventListener('click', () => {
        console.log('Button clicked');
  
        if (accordionBody.classList.contains('show')) {
          console.log('Removing show class');
          accordionBody.classList.remove('show');
          accordionButton.setAttribute('aria-expanded', 'false');
        } else {
          console.log('Adding show class');
          accordionBody.classList.add('show');
          accordionButton.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });