<template>
  <div class="row">
    <div class="col-1"></div>
    <div class="col-8">
      <img
        v-if="loading"
        :src="require('@/assets/loading.gif')"
        style="width: 400px"
      />
      <form v-if="!loading" @submit.prevent="postNewImage" class="form mb-5">
        <div class="form-group">
          <croppa
            :width="400"
            :height="400"
            placeholder="Učitaj sliku..."
            v-model="imageReference"
          ></croppa>
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
        :key="card.id"
        :info="card"
      />
    </div>
    <div class="col-3">
      <p v-for="card in filteredCards" :key="card.id">
        Opis slike: {{ card.description }}
      </p>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import InstagramCard from "@/components/InstagramCard.vue";
import store from "@/store";
import { db, storage } from "@/firebase";

export default {
  name: "HomeView",
  data: function () {
    return {
      loading: false,
      cards: [],
      store: store,
      newImageUrl: "",
      newImageDescription: "",
      imageReference: null,
    };
  },
  mounted() {
    // dohvat iz firebase, prikazuje na ekran
    this.getPosts();
  },
  methods: {
    getPosts() {
      db.collection("posts")
        .orderBy("posted_at", "desc")
        .limit(10)
        .get()
        .then((query) => {
          // pražnjenje postova, da se ne bi duplao prikaz
          this.cards = [];
          query.forEach((doc) => {
            const data = doc.data();
            this.cards.push({
              id: doc.id,
              time: data.posted_at,
              description: data.desc,
              url: data.url,
            });
          });
        });
    },
    getImage() {
      // Promise based
      return new Promise((resolveFn) => {
        this.imageReference.generateBlob((data) => {
          resolveFn(data);
        });
      });
    },
    async postNewImage() {
      try {
        this.loading = true;
        let blobdata = await this.getImage();

        let imageName =
          "posts/" + store.currentUser + "/" + Date.now() + ".png";

        let result = await storage.ref(imageName).put(blobdata);
        let url = await result.ref.getDownloadURL();
        console.log("Link je:", url);

        const imageDescription = this.newImageDescription;
        let doc = await db.collection("posts").add({
          url: url,
          desc: imageDescription,
          email: store.currentUser,
          posted_at: Date.now(),
        });
        alert("Spremljeno:", doc);
        this.getPosts();
      } catch (e) {
        console.error("Greška: ", e);
      }
      this.loading = false;
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
