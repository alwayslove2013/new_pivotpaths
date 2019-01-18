<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.item {
  display: block;
  color: #238647;
  background: rgba(255,255,255,.5);
  border-radius: 1.5em;
  /*border: 2px solid #62A55E;*/
  padding-left: 18px;
  padding-right: 4px;
  font-size: 12px;
  background: url("./assets/item5.png") no-repeat left center;
}

.author {
  display: block;
  color: #004787;
  background: rgba(255,255,255,.5);
  border-radius: 1.5em;
  /*border: 2px solid #62A55E;*/
  padding-left: 18px;
  padding-right: 4px;
  font-size: 12px;
  background: url("./assets/author5.png") no-repeat left center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 80px;
}

.tag {
  display: block;
  color: #B2203B;
  background: rgba(255,255,255,.5);
  border-radius: 1.5em;
  /*border: 2px solid #62A55E;*/
  padding-left: 18px;
  padding-right: 4px;
  font-size: 12px;
  background: url("./assets/tag5.png") no-repeat left center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 80px;
}
.author_path {
  fill: none;
  stroke: blue;
  stroke-width: 1px;
}
.tag_path {
  fill: none;
  stroke: red;
  stroke-width: 1px;
}
</style>
