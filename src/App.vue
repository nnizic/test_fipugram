<template>
  <div id="app">
    <nav id="nav" class="navbar navbar-expand-lg navbar-light">
      <a
        class="navbar-brand"
        href=" https://www.flaticon.com/free-icons/owl"
        title="owl icons"
      >
        <img
          src="@/assets/owl.png"
          height="40"
          class="d-inline-block align-top"
          alt="owl"
          loading="lazy"
        />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarToggler"
        aria-controls="navbarToggler"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarToggler">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link" v-if="store.currentUser"
              >Home</router-link
            >
          </li>
          <li class="nav-item" v-if="!store.currentUser">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item">
            <!-- Zbog # ode na Home -->
            <a
              href="#"
              @click.prevent="logout()"
              class="nav-link"
              v-if="store.currentUser"
              >Logout</a
            >
          </li>
          <li class="nav-item">
            <router-link
              to="/register"
              class="nav-link"
              v-if="!store.currentUser"
              >Register</router-link
            >
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <img src=@/assets/search.png width="30">
          <input
            v-model="store.searchTerm"
            class="form-control mr-sm-2"
            type="search"
            placeholder="Pretraga"
            aria-label="Search"
          />
        </form>
      </div>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>
<script>
// može se dodati js nastavak, ne mora
import store from "@/store";
import { firebase } from "@/firebase";
import router from "@/router";

firebase.auth().onAuthStateChanged((user) => {
  const currentRoute = router.currentRoute;
  if (user) {
    console.log("korisnik je: ", user.email);
    store.currentUser = user.email;
    if (!currentRoute.meta.needsUser) {
      router.push({ name: "home" });
    }
  } else {
    store.currentUser = null;
    console.log("No user");
    if (currentRoute.meta.needsUser) {
      router.push({ name: "login" });
    }
  }
});
export default {
  name: "app",
  data() {
    return {
      store: store,
    };
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "login" });
        });
    },
  },
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  background-color: white !important;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
