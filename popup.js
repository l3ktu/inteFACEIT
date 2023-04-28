document.addEventListener('DOMContentLoaded', function() {
    // Add an event listener to the menu items to update the selected class
    const menuItems = document.querySelectorAll('.menu a');
    menuItems.forEach((item) => {
      item.addEventListener('click', (event) => {
        // Remove the selected class from all menu items
        menuItems.forEach((item) => {
          item.classList.remove('selected');
        });
        // Add the selected class to the clicked menu item
        event.target.classList.add('selected');
      });
    });
  });
  