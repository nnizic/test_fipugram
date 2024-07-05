<template>
  <div class="row">
    <div class="col-1"></div>
    <div class="col-8">
      <form @submit.prevent="postNewImage" class="form mb-5">
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
    postNewImage() {
      this.imageReference.generateBlob((blobdata) => {
        console.log(blobdata);

        let imageName =
          "posts/" + store.currentUser + "/" + Date.now() + ".png";

        storage
          .ref(imageName)
          .put(blobdata)
          .then((result) => {
            // uspješno
            result.ref.getDownloadURL().then((url) => {
              console.log("Link je:", url);

              const imageDescription = this.newImageDescription;
              this.getPosts();
              db.collection("posts")
                .add({
                  url: url,
                  desc: imageDescription,
                  email: store.currentUser,
                  posted_at: Date.now(),
                })
                .then((doc) => {
                  alert("Spremljeno:", doc);
                  // pražnjenje polja
                  this.imageReference.remove();
                  this.newImageDescription = "";
                })
                .catch((e) => {
                  console.error("Greška: ", e);
                });
            });
          })
          .catch((e) => {
            console.error(e);
          });
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
