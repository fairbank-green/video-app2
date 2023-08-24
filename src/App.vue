<template>
  <div class="app has-background-danger-light has-text-danger">
    <div class = "top has-background-danger-light">
      <div class="columns">
        <div class="column is-4 is-flex is-align-items-center is-justify-content-center">
          <p v-if="!showSelectedVideos">You have selected {{ selectedVideosDuration }} of your 8 videos</p>
        </div>
        <div class="column is-4 is-flex is-align-items-center is-justify-content-center">
          <h1 class="title has-text-danger is-size-1">Maya's Songs</h1>
        </div>
        <div class="column is-4 is-flex is-align-items-center is-justify-content-center" v-if="!showSelectedVideos">
          <button class = "button is-danger" v-if="playPossible" @click="playSelectedVideos">Play</button>
        </div>
      </div>
    </div>

    <div class="video-selection columns is-multiline" v-if="!showSelectedVideos">
        <VideoSelect
          v-for="(video, index) in videos"
          :key="index"
          :video="video"
          :isSelected="selectedVideos.includes(video)"
          @toggle-selection="toggleVideoSelection"
          class="column is-4"
        />
    </div>
      <SelectedVideos v-if="showSelectedVideos" :selectedVideos="selectedVideos" />
  </div>
</template>


<script>
import axios from "axios";
import SelectedVideos from "@/components/SelectedVideos.vue";
import VideoSelect from "@/components/VideoSelect.vue";

export default {
  name: "App",
  data() {
    return {
      videos: [],
      selectedVideos: [],
      totalDurationLimit: 8, // total video value of 8
      showSelectedVideos: false,
    };
  },
  components:{
    SelectedVideos,
    VideoSelect
  },
  computed:{
    playPossible(){
      return this.selectedVideosDuration <= this.totalDurationLimit
    },
    selectedVideosDuration() {
      return this.selectedVideos.reduce((total, video) => total + parseFloat(video.value), 0);
    }
  },
  methods: {
    async fetchVideoUrls() {
      try {
        const response = await axios.get(
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vRp17gc4isgUx4lS9joSFBbE-82O1JetltGyzHGr4ge93bUzEHIavTzNfvzMdx3qPGOgGxM6Munei--/pub?output=csv"
        );
        let data = response.data.split("\r\n");
        let titles = data.shift().split(",").map(item => item.toLowerCase());
        this.videos = data.map(item => {
          let activity_data = item.split(",");
          let object = {};
          activity_data.forEach((item, i) => {
              object[titles[i]] = item.replaceAll(';','\n');
          });
          return object;
        });
      } catch (error) {
        console.error("Error fetching video URLs", error);
      }
    },
    getEmbeddedUrl(video) {
      const videoId = this.extractVideoId(video.url);
      return `https://www.youtube.com/embed/${videoId}`;
    },
    extractVideoId(url) {
      const match = url.match(/(?:\/embed\/|v=|\/\d{2,4}\/|youtu\.be\/|\/v\/|\/e\/|\/u\/\d{1,2}\/|\/embed\/|\/v\/|e\/|u\/\d{1,2}\/|^youtu\.be\/)([^#?\s]+)/);
      return match && match[1].length === 11 ? match[1] : null;
    },
    playSelectedVideos() {
      // Check if the total duration of selected videos is within the limit
      console.log("In playSelectedVideos");
      if (this.selectedVideosDuration > this.totalDurationLimit) {
        alert("Total duration exceeds 40 minutes. Please select fewer videos.");
        return;
      }

      // After you've verified the selectedVideos, you can show the SelectedVideos component
      this.showSelectedVideos = true;
      // Implement video playback logic similar to the previous example
      // You can create a new view or component to display the selected videos
    },

    getVideoDuration(video) {
      const durationArray = video.duration.split(":");
      return parseInt(durationArray[0])*60 + parseInt(durationArray[1]);
    },
    toggleVideoSelection(video) {
          const index = this.selectedVideos.indexOf(video);
          if (index !== -1) {
            this.selectedVideos.splice(index, 1);
          } else {
            this.selectedVideos.push(video);
          }
      },
  },
  mounted() {
    this.fetchVideoUrls();
  },
};
</script>

<style>
.app {
  text-align: center;
  padding: 2rem;
  font-family: 'Quicksand', sans-serif;
  font-weight: bold;
}

.top {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

.video-container {
  margin: 1rem 0;
}

.title {
  font-family: 'Amatic SC', cursive;
}

.button {
  font-family: 'Quicksand', sans-serif;
  font-weight: bold;
}
</style>
