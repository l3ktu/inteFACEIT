const options = {
  enabled: false,
  hideNotJoinable: false,
  hideNotReady: false,
  hidePlaying: false,
  hideQueuing: false,
};

const checkForUpdatesBtn = document.getElementById('check-for-updates');

// Add an event listener to the check for updates button
checkForUpdatesBtn.addEventListener('click', () => {
  // Call your update function here to check for updates
  checkForUpdates();
});

function checkForUpdates() {
  const manifestUrl = chrome.extension.getURL('/manifest.json');
  fetch(manifestUrl)
    .then(response => response.json())
    .then(data => {
      const version = data.version;
      const updateUrl = "https://raw.githubusercontent.com/l3ktu/inteFACEIT/main/update.xml?t=" + Date.now();
      // Add a cache-busting parameter to the update URL

      const xhr = new XMLHttpRequest();
      xhr.open('GET', updateUrl);
      xhr.onload = function() {
        if (xhr.readyState === xhr.DONE) {
          if (xhr.status === 200) {
            const updateXml = xhr.responseText;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(updateXml, "text/xml");
            const latestVersion = xmlDoc.getElementsByTagName('update')[0].getAttribute('version');
            const changelogElement = xmlDoc.getElementsByTagName('changelog')[0];
            const changelog = changelogElement ? changelogElement.textContent : 'No changelog available.';
            if (latestVersion !== version) {
              const updateMessage = `Ai versiunea ${version}, a aparut versiunea ${latestVersion} is available. Click OK to update.\n\nChangelog:\n${changelog}`;
              const userResponse = confirm(updateMessage);
              if (userResponse) {
                chrome.runtime.reload();
              }
            } else {
              alert('You are using the latest version of the extension.');
            }
          } else {
            alert('Unable to check for updates. Please try again later.');
          }
        }
      };
      xhr.send(null);
    })
    .catch(error => console.log(error));
}



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
    const inputElement = document.getElementById(key);
    if (inputElement.type === 'checkbox') {
      inputElement.addEventListener('change', (event) => {
        options[key] = event.target.checked;
        chrome.storage.sync.set({options}, () => {
          // Update status to let user know changes were saved.
          const status = document.getElementById('clan');
        });
      });
    } else if (inputElement.type === 'switch') {
      inputElement.addEventListener('input', (event) => {
        options[key] = parseInt(event.target.value);
        chrome.storage.sync.set({options}, () => {
          // Update status to let user know changes were saved.
          const status = document.getElementById('clan');
        });
      });
    }
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
