/**
 * WordPress Kerala Photo Festival Entries
 * Ver: 1.0
 * Author: Ajith
 * URL: https://ajithrn.com
 * JS
 */
// JavaScript code

// tag-id (WPKeralaPhotos) 
const tagId = 5852; 
// Initialize the page number for api
let pageNumber = 1; 
// get total page number
let totalPages = 0; 
// Variable to store photo count
let photosCount = 0;
// Variable to store user count
let userCount = 0;
// Object to store the photos
const photos = [];
// Object to store the photo count for each author
const userPhotoCounts = {}; 
//loading spinner element
const loadingElement = document.getElementById('loading'); 

/**
 * Function to fetch photos
 * @param {*} pageNumber 
 */
function fetchPhotos(pageNumber) {
  loadingElement.style.display = 'block';
  fetch(`https://wordpress.org/photos/wp-json/wp/v2/photos/?photo-tags=${tagId}&page=${pageNumber}&per_page=99`)
    .then((response) => {
      // Get the total number of pages from the response headers
      const totalPagesHeader = response.headers.get('X-WP-TotalPages');
      totalPages = parseInt(totalPagesHeader);

      return response.json();
    })
    .then((data) => {

      // Update the photo and user count
      photosCount += data.length;
      const uniqueUserIds = new Set(data.map((photo) => photo.author));
      usersCount = uniqueUserIds.size;

      // Add photos to the array
      photos.push(...data);

      // Check if there are more pages
      if (pageNumber < totalPages) {
        // Increment the page number and fetch the next page
        pageNumber++;
        fetchPhotos(pageNumber);
      } else {
        // All photos have been fetched
        processResults();
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

/**
 * Fetch user information from the user api url
 * @param {*} authorUrl 
 * @returns 
 */
function fetchAuthorName(authorUrl) {
  return fetch(authorUrl)
    .then((response) => response.json())
    .then((authorData) => {
      return authorData;
    })
    .catch((error) => {
      console.error('Error fetching author data:', error);
      return 'Unknown Author';
    });
}

/**
 * Process and display the result.
 */
async function processResults() {
  // Create an object to store the photo count and user API URL for each author
  const userPhotoCounts = {};
  for (const photo of photos) {
    const userId = photo.author;
    const userAPI = photo._links.author[0].href;
    if (!userPhotoCounts[userId]) {
      userPhotoCounts[userId] = {
        count: 0,
        api: userAPI,
      };
    }
    userPhotoCounts[userId].count++;
  }

  // Convert the userPhotoCounts object into an array of users and their photo counts
  const users = Object.keys(userPhotoCounts).map((userId) => ({
    id: userId,
    count: userPhotoCounts[userId].count,
    api: userPhotoCounts[userId].api,
  }));

  // Sort the users array by photo count in descending order
  users.sort((a, b) => b.count - a.count);

  // hide loader
  loadingElement.style.display = 'none';
  
  const lbIntro = `
    <h3>
      We have total <span class="total-photos">${Object.keys(photos).length}</span> approved photo submissions and <span class="total-users">${Object.keys(users).length}</span> unique contributors.
    </h3>
  `;
  document.querySelector('.section-heading').innerHTML += lbIntro;

  let rank = 1;

  for (const user of users) {
    const authorData = await fetchAuthorName(user.api);

    const userRowHTML = `
      <div class="user">
        <div class="user-info">
          <img src="${authorData.avatar_urls[96]}" alt="${authorData.name}">
          <div class="meta">
            <h4>${authorData.name}</h4>
            <div class="profile"><a href="${authorData.link}" target="_blank">@${authorData.slug}</a></div>
            <div class="count">Photo Count: <span>${user.count}</span></div>
          </div>    
        </div>
        <div class="user-rank">${rank}</div>
      </div>
    `;
    document.querySelector('.users').innerHTML += userRowHTML;

    rank++;
  }
}

// Start fetching photos with the initial page number of 1
fetchPhotos(pageNumber);
