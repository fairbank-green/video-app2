<template>
  <div class="video-player">
    <iframe :src="embeddedUrl" frameborder="0" allowfullscreen></iframe>
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
  },
};
</script>

<style scoped>
.video-player {
  text-align: center;
  padding: 1rem;
}
</style>
