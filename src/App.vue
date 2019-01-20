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

.item {
  display: block;
  color: #238647;
  border-radius: 1.5em;
  /*border: 2px solid #62A55E;*/
  padding-left: 18px;
  padding-right: 4px;
  font-size: 12px;
  background: rgba(255,255,255,0.5) url("./assets/item5.png") no-repeat left center;
  cursor: pointer;
}

.itemHover {
  border: 2px solid #62A55E;
}

.author {
  display: block;
  color: #004787;
  border-radius: 1.5em;
  /*border: 2px solid #62A55E;*/
  padding-left: 18px;
  padding-right: 4px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.5) url("./assets/author5.png") no-repeat left center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 80px;
  cursor: pointer;
}

.tag {
  display: block;
  color: #B2203B;
  border-radius: 1.5em;
  /*border: 2px solid #62A55E;*/
  padding-left: 18px;
  padding-right: 4px;
  font-size: 12px;
  background: rgba(255,255,255,.5) url("./assets/tag5.png") no-repeat left center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 80px;
  cursor: pointer;
}
.author_path {
  fill: none;
  stroke: #d5e6ec;
  stroke-width: 1px;
}
.tag_path {
  fill: none;
  stroke: #f4e2e5;
  stroke-width: 1px;
}
.core_author {
  color: #004787;
  font-size: 16px;
  background: rgba(255,255,255,.5);
  border-radius: 1.5em;
  border: 2px solid #3488BC;
  /*text-overflow: ellipsis;*/
  /*overflow: hidden;*/
  /*white-space: nowrap;*/
  /*max-width: 150px;*/
  padding: 2px 4px 2px 18px;
  background: url("./assets/author5.png") no-repeat left center;
}

.core_tag {
  color: #B2203B;
  font-size: 16px;
  background: rgba(255,255,255,.5);
  border-radius: 1.5em;
  border: 2px solid #CD5968;
  /*text-overflow: ellipsis;*/
  /*overflow: hidden;*/
  /*white-space: nowrap;*/
  /*max-width: 150px;*/
  padding: 2px 4px 2px 18px;
  background: url("./assets/tag5.png") no-repeat left center;
}
</style>
