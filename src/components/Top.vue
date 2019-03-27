<template>
  <div class="frame-row" style="font-size: 45px;">
    <!-- 管理人プロフィール -->
    <div class="frame-left">
      <font class="my-name">管理人プロフィール</font>
      <img src="../assets/kawamura.jpg" width="80%" alt="管理人の写真"><br><br><br>名前：河村健司<br>生年月日：1994年11月13日<br>血液型：O型<br>
      <p class="side-link">●キリ番BBS●</p>
      <p class="side-link">●雑談BBS●</p>
      <p class="side-link">●管理人日記●</p>
    </div>
    <!-- メインページ -->
    <div class="frame-right">
      <p style="font-weight: bold; margin-top: 40px;">
        <font style="font-size: 130%;">技術開発室×レッジのホームページへようこそ<br>あなたは
          <a href="http://www.rays-counter.com/">
            <img src="http://www.rays-counter.com/d406_f8_022/5ae1ba0388d65/" height="80" alt="アクセスカウンター" border="0">
          </a>人目のお客様です。
        </font>
      </p>
      <div class="title">
        <p class="top-title">顔認識AIを使った<span class="saisentan">超最先端</span> Face Competition Game</p>
      </div>
      <div style="background: #000; color: #FFF; padding: 5px 0;">
        <marquee scrollamount="20">
          <font color="pink">【最新ニュース！】</font>２０１８年５月７日<font color="yellow">技術開発室に、まさ（堀 将記）さんが参加しました</font>♪ <font color="red" class="blinking">New</font>
          <font color="yellow">レッジに、むろ（室川 武範）さんが参加しました</font>♪ <font color="red" class="blinking">New</font>
        </marquee>
      </div>

      <p class="blinking"><br><br>
        <font style="font-weight: bold;" color="red">↓↓↓↓↓↓ ここをクリックして、スタート！！！ ↓↓↓↓↓↓</font><br><br>
      </p>
      <router-link to="camera" tag="button">
        <img class="startbutton" src="../assets/start02.png" alt="レッツスタートボタン" />
      </router-link>

      <p style="font-size: 100%; font-weight: bold; margin-top: 40px;"><br>
        <font color="red">レッジと技術開発室のメンバーによる、AI表情測定ゲーム！！！</font><br><br>★ルール★<br>
        <font color="purple" class="blinking">ルールは簡単！</font><br>
        <font color="green">お題に合わせた表情を作って、写真を取るだけ！！<br>AIが点数をだして、高い方が勝利するトーナメント戦！！！</font>
      </p>
    </div>
    <audio id="audio" src="/static/hinotori.mp3" autoplay loop></audio>
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
