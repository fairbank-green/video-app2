<template>
  <div class="selected-videos">
    <div class="columns is-multiline">
      <div v-for="(video, index) in selectedVideos" :key="index" class="video-container column is-4">
        <VideoPlayer :video="video" :index="index"/>
      </div>
  </div>
  </div>
</template>

<script>
import VideoPlayer from "@/components/VideoPlayer.vue";

export default {
  name: "SelectedVideos",
  props: {
    selectedVideos: {
      type: Array,
      required: true,
    },
  },
  components: {
    VideoPlayer
  },
  methods: {
    getEmbeddedUrl(video) {
      const videoId = this.extractVideoId(video.url);
      return `https://www.youtube.com/embed/${videoId}`;
    },
    extractVideoId(url) {
      const match = url.match(/(?:\/embed\/|v=|\/\d{2,4}\/|youtu\.be\/|\/v\/|\/e\/|\/u\/\d{1,2}\/|\/embed\/|\/v\/|e\/|u\/\d{1,2}\/|^youtu\.be\/)([^#?\s]+)/);
      return match && match[1].length === 11 ? match[1] : null;
    }
  }
};
</script>

<style scoped>
.selected-videos {
  text-align: center;
  padding: 2rem;
}

.video-container {
  margin: 1rem 0;
}
</style>
