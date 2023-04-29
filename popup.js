const options = {
  enabled: false,
  hideNotJoinable: false,
  hideNotReady: false,
  hidePlaying: false,
  hideQueuing: false,
};

document.addEventListener('DOMContentLoaded', function() {
  const enabledCheckbox = document.getElementById('enabled');
  const subGroup = document.querySelector('.sub-group');

  chrome.storage.sync.get(options, (items) => {
    for (let key in items) {
      document.getElementById(key).checked = items.enabled;
    }
    // Set the visibility of the sub-group based on the initial value of the enabled checkbox
    subGroup.style.display = enabledCheckbox.checked ? 'block' : 'none';
  });

  // Add option change event listeners to each checkbox that immediately persist option changes
  for (const key in options) {
    document.getElementById(key).addEventListener('change', (event) => {
      options[key] = event.target.checked;
      chrome.storage.sync.set({options}, () => {
        // Update status to let user know changes were saved.
        const status = document.getElementById('clan');
      });
    });
  }

  // If enabled state is changed in the application, automatically set/remove checkmark for 'enabled'.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.options?.newValue) {
      changes = changes.options.newValue;
      options.enabled = changes.enabled;
      document.getElementById('enabled').checked = options.enabled;
      // Set the visibility of the sub-group based on the new value of the enabled checkbox
      subGroup.style.display = options.enabled ? 'block' : 'none';
    }
  });

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

  // Set the default category to be selected
  const defaultCategoryIndex = 0; // change this index to select a different default category
  menuItems[defaultCategoryIndex].classList.add('selected');
  categoryContents[defaultCategoryIndex].style.display = 'block';

  // Add an event listener to the enabled checkbox to show/hide the sub-group
  enabledCheckbox.addEventListener('change', () => {
    subGroup.style.display = enabledCheckbox.checked ? 'block' : 'none';
  });
});
