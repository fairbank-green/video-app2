<template>
  <div class="container is-primary">
    <div class="columns video-select" @click="toggleCheckbox">
      <div class="column">
        <input class="checkbox" type="checkbox" :checked="check" @change="handleCheckboxChange"/>
      </div>
      <div class="column">
        <img :src="thumbnailUrl" alt="Video Thumbnail" />
      </div>
      <div class="column">
        <p>{{this.video.value}}</p>
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
  data(){
    return{
      check: this.isSelected
    }
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
    handleCheckboxChange(){
      this.$emit("checkbox-changed", event.target.checked);
    },
    toggleCheckbox() {
      this.check = !this.check;
    },
  },
};
</script>

<style scoped>
.video-select {
  /* text-align: center;
  padding: 1rem; */
  cursor: pointer;
}

/* .video-select img {
  max-width: 100%;
  height: auto;
} */

</style>
