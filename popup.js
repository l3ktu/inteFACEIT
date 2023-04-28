const options = {
  enabled: true,
  hideNotJoinable: true,
  hideNotReady: true,
  hidePlaying: true,
  hideQueuing: true,
  outputDebuggingMessages: false,
};

document.addEventListener('DOMContentLoaded', function() {
  // Add an event listener to the menu items to update the selected class and show the corresponding content
  const menuItems = document.querySelectorAll('.menu a');
  const categoryContents = document.querySelectorAll('.category-content');
  menuItems.forEach((item, index) => {
    item.addEventListener('click', (event) => {
      // Remove the selected class from all menu items
      menuItems.forEach((item) => {
        item.classList.remove('selected');
      });
      // Add the selected class to the clicked menu item
      event.target.classList.add('selected');
      // Hide all category contents
      categoryContents.forEach((content) => {
        content.style.display = 'none';
      });
      // Show the corresponding category content
      categoryContents[index].style.display = 'block';
    });
  });
  for (const key in options) {
    document.getElementById(key).addEventListener('change', (event) => {
       options[key] = event.target.checked;
       chrome.storage.sync.set({options}, () => {
          // Update status to let user know changes were saved.
          const status = document.getElementById('status');
          status.textContent = 'Changes saved.';
          setTimeout(() => {
             status.textContent = '';
          }, 750);
       });
    });
 }

   // if enabled state is changes in the application, automatically set/remove checkmark for 'enabled'.
   chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.options?.newValue) {
       changes = changes.options.newValue;
       options.enabled = changes.enabled;
       document.getElementById('enabled').checked = options.enabled;
    }
 })
});