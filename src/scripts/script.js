const apiKey = 'AIzaSyCgM61bk3I77FpwDsbEMZFGAMAoXB2PuXE'; // Replace with your actual API key
const channelId = 'UCJEaSsk4nWNNeXyFNv5G3Lg'; // Replace with your channel ID
const maxResults = 10; // Number of videos to fetch

const mainVideo = document.getElementById('main-video');
const videoList = document.getElementById('video-list');

async function fetchLatestVideos() {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=${maxResults}&type=video`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const videos = data.items;
            const latestVideoId = videos[0].id.videoId; // Get the ID of the most recent video

            // Set the initial video in the main player
            mainVideo.src = `https://www.youtube.com/embed/${latestVideoId}`;

            // Create the video list
            videos.forEach(video => {
                const videoId = video.id.videoId;
                const title = video.snippet.title;
                const thumbnailUrl = video.snippet.thumbnails.medium.url;

                const listItem = document.createElement('li');
                listItem.setAttribute('data-video-id', videoId);
                listItem.innerHTML = `
                    <img src="${thumbnailUrl}" alt="${title}">
                    <span>${title}</span>
                `;
                listItem.addEventListener('click', () => {
                    mainVideo.src = `https://www.youtube.com/embed/${videoId}`;
                });
                videoList.appendChild(listItem);
            });
        } else {
            console.error('No videos found.');
        }
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
}

fetchLatestVideos();
