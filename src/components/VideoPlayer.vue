<template>
  <div class="wrapper" @click="handleVideoClick" :class="{ progress: inProgress }">
    <div class="video-player" :id = 'containerId'>
      <div class = "play"></div>
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
      player: null,
      fullscreen: false,
      inProgress: false
    }
  },
  computed: {
    embeddedUrl() {
      const videoId = this.extractVideoId(this.video.url);
      return `https://www.youtube.com/embed/${videoId}`;
    },
    thumbnailUrl() {
      const videoId = this.extractVideoId(this.video.url);
      return `https://img.youtube.com/vi/${videoId}/0.jpg`;
    },
  },
  methods: {
    extractVideoId(url) {
      const match = url.match(/(?:\/embed\/|v=|\/\d{2,4}\/|youtu\.be\/|\/v\/|\/e\/|\/u\/\d{1,2}\/|\/embed\/|\/v\/|e\/|u\/\d{1,2}\/|^youtu\.be\/)([^#?\s]+)/);
      return match && match[1].length === 11 ? match[1] : null;
    },
    onPlayerReady(event){

      //Set paused video background as thumbnail image
      const container = document.getElementById(this.playerId).parentNode;
      container.style.backgroundImage = "url(" + this.thumbnailUrl+ ")";

    },
    onPlayerStateChange(event){
      const container = document.getElementById(this.playerId).parentNode;
      const player = document.getElementById(this.playerId);
      const playIcon = document.getElementById(this.playerId).parentNode.querySelector(".play");

      switch(event.data){
        case 0://ended
          this.hideElement(player);
          this.hideElement(playIcon);

          //Put video to minimized screen
          document.exitFullscreen();
          this.fullscreen=false;
          this.inProgress=false;
          this.video.watched=true;
          break;
        case 1://play
          setTimeout(() => {
            this.showElement(player);
            this.hideElement(playIcon);
            }, 300)
          //Put video to full handleScreenChange
          container.requestFullscreen();
          this.fullscreen=true;
          this.inProgress=true;
          console.log("played")
          break;
        case 2://paused
          this.hideElement(player);
          this.showElement(playIcon);

          //Put video to minimized screen
          document.exitFullscreen();
          this.fullscreen=false
          break;
        case 5://cued
          setTimeout(() => {
            this.showElement(player);
            this.hideElement(playIcon);
            }, 300)

          //Put video to full handleScreenChange
          container.requestFullscreen();
          this.fullscreen=true;
          break;
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
      const player = document.getElementById(this.playerId);

      if (this.player && this.player.getPlayerState() === YT.PlayerState.PLAYING) {
        // If the video is playing, pause it when the container is clicked
        this.player.pauseVideo();

      } else if(this.player && this.player.getPlayerState() === YT.PlayerState.PAUSED){
        // If the video is paused, play it when the container is clicked
        this.player.playVideo();

      }else if(this.player && this.player.getPlayerState() === YT.PlayerState.CUED){
        // If the video is cued, play it when the container is clicked
        this.player.playVideo();
      }
    },
    hideElement(element){
      element.style.width = "0%"
      element.style.height = "0%"
    },
    showElement(element){
      element.style.width = "100%"
      element.style.height = "100%"
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
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 16/9;
    pointer-events: none;
    position: relative;
  }

  .play {
    background-image: url("../../public/youtube.png");
    position: absolute;
    background-repeat: no-repeat;
    background-size: 40% auto;
    background-position: center;
    width: 100%;
    height: 100%;
  }

  .video-player iframe {
     width: 300%;
     height: 100%;
     margin-left: -100%;
     positive: relative
  }

  .wrapper {
     overflow: hidden;
     width: 100%;
     height: 100%;
     position: relative;
     padding: 1rem;
  }

  .wrapper.progress{
    background-color: hsl(171, 100%, 41%);
    border-radius: 0;
  }

</style>
