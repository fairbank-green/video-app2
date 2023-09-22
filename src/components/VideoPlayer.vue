<template>
  <div class="video-player">
    <iframe
      :id="playerId"
      :src="embeddedUrl"
      frameborder="0"
      allowfullscreen
    >
    </iframe>
  </div>
</template>

<script>

export default{
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
      playerId: 'youtube-player' + this.index
    }
  },
  mounted() {
    this.initYouTubePlayer();
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
    initYouTubePlayer() {
      new window.YT.Player(this.playerId, {
        videoId: this.extractVideoId(this.video.url), // Replace with your YouTube video ID
        playerVars: {
          rel: 0, // Disable related videos
          autoplay: 1, // Autoplay video
          fs: 1
        },
        events: {
          onReady: this.onPlayerReady,
        },
      });
    },
    onPlayerReady(event) {
      // Play the video when it's ready
      event.target.playVideo();
    },
  },
}
</script>

<style scoped>
.video-player {
  text-align: center;
  padding: 1rem;
}
</style>
