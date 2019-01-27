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
  padding: 2px 4px 2px 18px;
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
  /*border-radius: 1.5em;*/
  /*border: 2px solid #62A55E;*/
  padding: 2px 4px 2px 18px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.5) url("./assets/author5.png") no-repeat left center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 80px;
  cursor: pointer;
  z-index: 50;
}

.author_hover {
  border-radius: 1.5em;
  border: 2px solid #3488BC;
  z-index: 52;
}

.author_hover_compare {
  padding-right: 18px;
  background-image: url("./assets/author5.png"), url("./assets/arrow_author2.png");
  background-repeat: no-repeat, no-repeat;
  background-position: left center, right center;
  z-index: 53;
}

.author_hover_compare_add {
  padding-right: 18px;
  background-image: url("./assets/author5.png"), url("./assets/arrow_author.png");
  background-repeat: no-repeat, no-repeat;
  background-position: left center, right center;
  z-index: 54;
}

.tag {
  display: block;
  color: #B2203B;
  /*border-radius: 1.5em;*/
  /*border: 2px solid #62A55E;*/
  padding: 2px 4px 2px 18px;
  font-size: 12px;
  background: rgba(255,255,255,.5) url("./assets/tag5.png") no-repeat left center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 80px;
  cursor: pointer;
  z-index: 50;
}

.tag_hover {
  border-radius: 1.5em;
  border: 2px solid #CD5968;
  z-index: 52;
}

.tag_hover_compare {
  padding-right: 18px;
  background-image: url("./assets/tag5.png"), url("./assets/arrow_tag2.png");
  background-repeat: no-repeat, no-repeat;
  background-position: left center, right center;
  z-index: 53;
}

.tag_hover_compare_add {
  padding-right: 18px;
  background-image: url("./assets/tag5.png"), url("./assets/arrow_tag.png");
  background-repeat: no-repeat, no-repeat;
  background-position: left center, right center;
  z-index: 54;
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

.core {
  background: url("./assets/delete.png") right no-repeat;
}

.core_author {
  color: #fff;
  font-size: 16px;
  border-radius: 1.5em;
  border: 2px solid #3488BC;
  display: block;
  line-height: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 150px;
  padding: 2px 18px 2px 18px;
  background-color: #3488BC;
  background-image: url("./assets/author6.png"), url("./assets/delete2.png");
  background-repeat: no-repeat, no-repeat;
  background-position: left center, right center;
}

.core_author_delect {
  cursor: pointer;
  color: #fff;
  font-size: 16px;
  border-radius: 1.5em;
  border: 2px solid #3488BC;
  display: block;
  line-height: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 150px;
  padding: 2px 18px 2px 18px;
  background-color: #3488BC;
  background-image: url("./assets/author6.png"), url("./assets/delete.png");
  background-repeat: no-repeat, no-repeat;
  background-position: left center, right center;
}

.core_tag {
  color: #fff;
  font-size: 16px;
  border-radius: 1.5em;
  border: 2px solid #CD5968;
  display: block;
  line-height: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 150px;
  padding: 2px 18px 2px 18px;
  /*background: #CD5968 url("./assets/tag5.png") no-repeat left center;*/
  background-color: #CD5968;
  background-image: url("./assets/tag6.png"), url("./assets/delete2.png");
  background-repeat: no-repeat, no-repeat;
  background-position: left center, right center;
}

.core_tag_delect {
  cursor: pointer;
  color: #fff;
  font-size: 16px;
  border-radius: 1.5em;
  border: 2px solid #CD5968;
  display: block;
  line-height: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 150px;
  padding: 2px 18px 2px 18px;
  /*background: #CD5968 url("./assets/tag5.png") no-repeat left center;*/
  background-color: #CD5968;
  background-image: url("./assets/tag6.png"), url("./assets/delete.png");
  background-repeat: no-repeat, no-repeat;
  background-position: left center, right center;
}

.core_item {
  color: #fff;
  font-size: 16px;
  border-radius: 1.5em;
  border: 2px solid #62A55E;
  display: block;
  line-height: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 150px;
  padding: 2px 18px 2px 18px;
  /*background: #62A55E url("./assets/item5.png") no-repeat left center;*/
  background-color: #62A55E;
  background-image: url("./assets/item6.png"), url("./assets/delete2.png");
  background-repeat: no-repeat, no-repeat;
  background-position: left center, right center;
}

.core_item_delect {
  cursor: pointer;
  color: #fff;
  font-size: 16px;
  border-radius: 1.5em;
  border: 2px solid #62A55E;
  display: block;
  line-height: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 150px;
  padding: 2px 18px 2px 18px;
  /*background: #62A55E url("./assets/item5.png") no-repeat left center;*/
  background-color: #62A55E;
  background-image: url("./assets/item6.png"), url("./assets/delete.png");
  background-repeat: no-repeat, no-repeat;
  background-position: left center, right center;
}
</style>
