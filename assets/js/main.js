/**
 * WordPress Kerala Photo Festival Entries
 * Ver: 1.0
 * Author: Ajith
 * URL: https://ajithrn.com
 * JS
 */
// JavaScript code

const galleryContainer = document.querySelector('.gallery');
const tagId = 5852; // tag-id (WPKeralaPhotos) 
let pageNumber = 1;

// photo counter
const photosCounter = document.getElementById('photo-counter');
let photoCount = 0;

function fetchPhotos() {
  const apiUrl = `https://wordpress.org/photos/wp-json/wp/v2/photos/?photo-tags=${tagId}&page=${pageNumber}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((photos) => {
      photos.forEach((photo) => {
        // Create a new gallery item for each photo
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        // Create an image element and set its source to the photo thumbnail URL
        const img = document.createElement('img');
        img.src = photo['photo-thumbnail-url'];

        // Append the image to the gallery item
        galleryItem.appendChild(img);

        // create div for photo description
        const itemDescription = document.createElement('div');
        itemDescription.className = 'item-description';

        // Append the item description to the gallery item
        galleryItem.appendChild(itemDescription);

        // Create a caption element and set its text to the photo caption
        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.innerHTML = photo['content']['rendered'];

        // Append the caption to the gallery item
        itemDescription.appendChild(caption);

        // Create a download button element
        const downloadButton = document.createElement('a');
        downloadButton.className = 'view-button';
        downloadButton.textContent = 'View in Photo Directory';
        downloadButton.target = '_blank';
        downloadButton.href = photo.link;

        // Append the download button to the gallery item
        itemDescription.appendChild(downloadButton);

        // Append the gallery item to the gallery container
        galleryContainer.appendChild(galleryItem);

        // Increment the photoCount variable each time a photo is successfully loaded
        photoCount++;

        // Update the counter text
        photosCounter.textContent = photoCount;

      });

      // Increment the pageNumber for the next fetch
      pageNumber++;
    });
}

// Function to detect if user has scrolled to the bottom of the page
function scrolledToBottom() {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const documentHeight =
    document.documentElement.scrollHeight || document.body.scrollHeight;

  return scrollTop + windowHeight >= documentHeight;
}

// Event listener for scroll event
window.addEventListener('scroll', () => {
  if (scrolledToBottom()) {
    fetchPhotos();
  }
});

// Initial fetch
fetchPhotos();
