/**
 * WordPress Kerala Photo Festival Entries
 * Ver: 1.0
 * Author: Ajith
 * URL: https://ajithrn.com
 * JS
 */
// JavaScript code

const galleryContainer = document.querySelector('.gallery'); //gallery container
const tagId = 5852; // tag-id (WPKeralaPhotos) 
let pageNumber = 1;
let totalPages = 0; // get total page number
let loading = false;  // flag to prevent multiple fetch requests

const totalPhotos = document.getElementById('total-photos'); // total photo count
const loadingElement = document.getElementById('loading');  //loading spinner element

function fetchPhotos() {

  loadingElement.style.display = 'block'; // enable loader

  const apiUrl = `https://wordpress.org/photos/wp-json/wp/v2/photos/?photo-tags=${tagId}&page=${pageNumber}&per_page=99`;

  fetch(apiUrl)
    .then(response => {
      // get total number of photos and display.
      totalPhotos.textContent = response.headers.get('X-WP-Total');

      // Get the total number of pages from the response headers
      const totalPagesHeader = response.headers.get('X-WP-TotalPages');
      totalPages = parseInt(totalPagesHeader);
      return response.json();
    }) 
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

      });

      // Check if there are more pages
      if (pageNumber < totalPages) {        
        // Increment the page number and fetch the next page
        pageNumber++;
        loading = false; // set loading to false to allow next fetch request
      } else {
        loadingElement.style.display = 'none'; // hide loader
      }
    });
}

// Function to detect if user has scrolled to the bottom of the page
function scrolledToBottom() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

  // Check if the user has scrolled to the bottom
  if (scrollTop + windowHeight >= documentHeight && !loading) {
    loading = true; // prevent multiple fetch requests
    fetchPhotos();
  }
}

window.addEventListener('scroll', scrolledToBottom);

// Initial fetch
fetchPhotos();
