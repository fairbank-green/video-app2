<template>
  <div class="wrapper" @click="handleVideoClick">
    <div class="video-player hytPlayerWrap">
      <div :id = 'playerId'>
      </div>
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
    onPlayerReady(event){
      event.target.playVideo();
      const iframe = document.getElementById(this.playerId);
      iframe.requestFullscreen();
      this.fullscreen = false;
    },
    onPlayerStateChange(event){
      const iframe = document.getElementById(this.playerId);
      // const playerWrap = document.getElementById(this.playerId).parentNode;

      switch(event.data){
        case 0:
          //playerWrap.classList.add("ended");
          break;
        case 1:
          //playerWrap.classList.remove("ended");playerWrap.classList.remove("paused");
          break;
        case 2:
          //playerWrap.classList.add("paused");
      }
    },
    initYouTubePlayer() {
      const videoId = this.extractVideoId(this.video.url);

      this.player = new YT.Player(this.playerId, {
        height: '100%',
        width: '100%',
        videoId,
        playerVars:{
          rel: 0,
          //enablejsapi: 1,
          // origin:
          iv_load_policy: 3,
          controls: 0
        },
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange,
        },
      });
    },
    handleVideoClick() {
      const iframe = document.getElementById(this.playerId);
      const player = document.getElementById(this.playerId).parentNode;
      const playerWrap = document.getElementById(this.playerId).parentNode.parentNode;

      if (this.player && this.player.getPlayerState() === YT.PlayerState.PLAYING) {
        // If the video is playing, pause it when the container is clicked
        this.player.pauseVideo();
        player.style.zIndex = "-1";
        playerWrap.style.backgroundColor= "black";
      } else if(this.player && this.player.getPlayerState() === YT.PlayerState.PAUSED){
        // If the video is paused, play it when the container is clicked
        this.player.playVideo();
        player.style.zIndex = "1";
        playerWrap.style.backgroundColor= "transparent";
      }
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
    padding: 0rem;
    display: block;
  }

   .video-player  {
    overflow: hidden;
    width: 100%;
    aspect-ratio: 16/9;
    pointer-events: none;
  }

  .video-player iframe {
     width: 300%;
     height: 100%;
     margin-left: -100%;
     positive: relative
  }

  .wrapper {
     overflow: hidden;
     max-width: 100%;
     position: relative
  }
</style>
