<template>
  <div class="video-player">
    <div :id = 'playerId'>
    </div>
  </div>
</template>

<script>

export default {
  name: "VideoPlayer",
  props: {
    video: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    return{
      playerId: 'youtube-player' + this.index,
      player: null
    }
  },
  computed: {
    embeddedUrl() {
      const videoId = this.extractVideoId(this.video.url);
      return `https://www.youtube.com/embed/${videoId}`;
    },
  },
  methods: {
    extractVideoId(url) {
      const match = url.match(/(?:\/embed\/|v=|\/\d{2,4}\/|youtu\.be\/|\/v\/|\/e\/|\/u\/\d{1,2}\/|\/embed\/|\/v\/|e\/|u\/\d{1,2}\/|^youtu\.be\/)([^#?\s]+)/);
      return match && match[1].length === 11 ? match[1] : null;
    },
    onPlayerStateChange(event){
      const iframe = document.getElementById(this.playerId);

      switch(event.data){
        case 0:
          console.log("video ended");
          //document.exitFullscreen();
          break;
        case 1:
          console.log("video playing");
          //iframe.requestFullscreen();
          break;
        case 2:
          //console.log("video paused");
      }
    },
    initYouTubePlayer() {
      const videoId = this.extractVideoId(this.video.url);

      this.player = new YT.Player(this.playerId, {
        height: '100%',
        width: '100%',
        videoId,
        events: {
          'onStateChange': this.onPlayerStateChange,
        },
      });
    }
  },
  mounted() {
    if (typeof YT !== 'undefined') {
      this.initYouTubePlayer();
    } else {
      // If YT is not yet defined, set a timer to check for its availability
      const maxRetryAttempts = 5; // Define the maximum number of retry attempts
      let retryCount = 0;

      const checkYouTubeAPI = () => {
        if (typeof YT !== 'undefined') {
          // The YouTube API is ready, initialize the player
          this.initYouTubePlayer();
        } else if (retryCount < maxRetryAttempts) {
          // Retry if the maximum retry attempts have not been reached
          retryCount++;
          setTimeout(checkYouTubeAPI, 1000); // Retry after 1 second (adjust as needed)
        } else {
          // Handle the case where the API failed to load after max attempts
          console.error('YouTube API failed to load after multiple retries');
          // You can display an error message or take appropriate action
        }
      };

      // Start the initial check for the YouTube API
      checkYouTubeAPI();
    }
  }
}
</script>

<style scoped>
.video-player {
  text-align: center;
  padding: 1rem;
  display: block;
}
</style>
