<template>
  <div class="row">
    <div class="col-1"></div>
    <div class="col-8">
      <form @submit.prevent="postNewImage" class="form-inline mb-5">
        <div class="form-group">
          <label for="imageUrl">Image URL</label>
          <input
            v-model="newImageUrl"
            type="text"
            class="form-control ml-2"
            placeholder="Enter the image URL"
            id="imageUrl"
          />
        </div>
        <div class="form-group">
          <label for="imageDescription">Description</label>
          <input
            v-model="newImageDescription"
            type="text"
            class="form-control ml-2"
            placeholder="Enter the image description"
            id="imageDescription"
          />
        </div>
        <button type="submit" class="btn btn-primary ml-2">Post image</button>
      </form>
      <!-- može InstagamCard ili instagram-card -->
      <instagram-card
        v-for="card in filteredCards"
        :key="card.url"
        :info="card"
      />
    </div>
    <div class="col-3">
      <p v-for="card in filteredCards" :key="card.url">
        Link slike: {{ card.url }}
      </p>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import InstagramCard from "@/components/InstagramCard.vue";
import store from "@/store";
import { db } from "@/firebase";

let cards = [
  {
    url: "https://picsum.photos/id/1/400/400",
    description: "laptop",
    time: "maloprije",
  },
  {
    url: "https://picsum.photos/id/2/400/400",
    description: "laptop #2",
    time: "nešto ranije",
  },
  {
    url: "https://picsum.photos/id/3/400/400",
    description: "laptop #3",
    time: "prije koji sat",
  },
  {
    url: "https://picsum.photos/id/4/400/400",
    description: "laptop #4",
    time: "jučer",
  },
];
export default {
  name: "HomeView",
  data: function () {
    return {
      cards: cards,
      store: store,
      newImageUrl: "",
      newImageDescription: "",
    };
  },
  methods: {
    postNewImage() {
      const imageUrl = this.newImageUrl;
      const imageDescription = this.newImageDescription;

      db.collection("posts")
        .add({
          url: imageUrl,
          desc: imageDescription,
          email: store.currentUser,
          posted_at: Date.now(),
        })
        .then((doc) => {
          alert("Spremljeno:", doc);
          // pražnjenje polja
          this.newImageUrl = "";
          this.newImageDescription = "";
        })
        .catch((e) => {
          console.error("Greška: ", e);
        });
    },
  },
  computed: {
    filteredCards() {
      let termin = this.store.searchTerm;
      let newCards = [];
      for (let card of this.cards) {
        if (card.description.includes(termin)) {
          newCards.push(card);
        }
      }
      return newCards;
    },
  },

  components: {
    InstagramCard,
  },
};
</script>
