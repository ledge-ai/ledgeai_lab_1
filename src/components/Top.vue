<template>
  <div style="text-align: center;">
    <p class="blinking"><br><br>
        <font style="font-weight: bold;" color="red">↓↓↓↓↓↓ ここをクリックして、スタート！！！ ↓↓↓↓↓↓</font><br><br>
    </p>
    <router-link to="camera" tag="button">
      <img class="startbutton" src="../assets/start02.png" alt="レッツスタートボタン" />
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'top',
  created: function() {
    const v = document.getElementById('video')
    v.play()
  }
}
</script>

<style scoped>
.saisentan {
  font-size: 100%;
  color: blue;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.startbutton {
  width: 500px;
}

.top-title {
  font-family: 'Ubuntu', sans-serif;
  font-weight: bold;
  color: orange;
  font-size: 110%;
}

.my-name {
  display: block;
  padding-top: 20px;
  font-size: 110%;
  font-style: italic;
  font-weight: bold;
  font-family: '游明朝', YuMincho, 'ヒラギノ明朝 ProN W3', 'Hiragino Mincho ProN', 'HG明朝E', 'ＭＳ Ｐ明朝', 'ＭＳ 明朝',
    serif;
}
.side-link {
  display: block;
  margin: 20px 0;
  text-decoration: underline;
  color: purple;
  font-size: 90%;
}

.frame-row {
  text-align: center;
  height: 100vh;
}
.frame-row::after {
  content: '';
  display: block;
  clear: both;
}
.frame-left {
  float: left;
  width: 20%;
  height: 100%;
  background: #f0f0ff;
  box-sizing: border-box;
  border-right: 4px solid #dddddd;
  box-shadow: 0 0 0 2px #ccc;
  padding-bottom: 50px;
}
.frame-right {
  float: left;
  width: 80%;
}
</style>
