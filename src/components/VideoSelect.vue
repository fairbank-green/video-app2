<template>
  <div class="container">
    <div class="block" @click="toggleSelection">
      <div class="video-select" :class="{ 'selected': isSelected }">
        <p>This video counts as {{this.video.value}}</p>
        <img :src="thumbnailUrl" alt="Video Thumbnail" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VideoSelect",
  props: {
    video: {
      type: Object,
      required: true,
    },
    isSelected: Boolean,
  },
  computed: {
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
    toggleSelection() {
      this.$emit("toggle-selection", this.video); // Emit an event to toggle the selection
    },
  },
};
</script>

<style scoped>
.video-select {
  text-align: center;
  padding: 1rem;
  transition: background-color 0.3s;
  cursor: pointer;
}

.selected {
  background-color: hsl(171, 100%, 41%);
  color: hsl(0, 0%, 100%);
  font-weight: bold;
}

</style>
