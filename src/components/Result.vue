<template>
  <div v-if="DataUrl != null" class="resultface">
    <!-- 実画像 -->
    <img :src="DataUrl" class="faceImage">
    <!-- フレーム画像 -->
    <img :src="ImgaeList[Num]" class="frameImage">
    <!-- 評価値(左) -->
    <div v-if="this.Lface >= 0 && this.Ltop !== 100 && this.Lleft !== 300" :style="{ top: Ltop + 'px', left: Lleft + 'px'}" class="position">
      <p class="result">感情結果：{{ this.Lface }}点</p>
    </div>
    <div v-else-if="this.Lface >= NaN" :style="{ top: Ltop + 'px', left: Lleft + 'px'}" class="position">
      <p class="result">感情結果：{{ this.one }}点</p>
    </div>
    <div v-else :style="{ top: Rtop + 'px', left: Rleft + 550 + 'px'}" class="position">
      <p class="result">感情結果：{{ this.one }}点</p>
    </div>
    <!-- 評価値(右) -->
    <div v-if="this.Rface >= 0" :style="{ top: Rtop + 'px', left: Rleft + 'px'}" class="position">
      <p class="result">感情結果：{{ this.Rface }}点</p>
    </div>
    <div v-else-if="this.Rface >= NaN" :style="{ top: Rtop + 'px', left: Rleft + 'px'}" class="position">
      <p class="result">感情結果：{{ this.one }}点</p>
    </div>
    <div v-else :style="{ top: Rtop + 'px', left: Rleft + 'px'}" class="position">
      <p class="result">感情結果：{{ this.Rface }}点</p>
    </div>
    <router-link to="/camera">
    <button class="reloadButton" type="button">
      <font size="2">ここを押すと</font><font size="5" color="#333399">もう一度チャレンジ</font><font size="2">できるよ！</font>
    </button>
    </router-link>
    <audio v-if="on" id="kansei" :src="'/static/kansei' + kansei_num + '.mp3'" autoplay></audio>
  </div>
  <!-- 結果の画像が出力される間に表示 -->
  <p v-else :class="{ aiAnalysis: aiAnalysisAct, hasError: hasErrorAct }">{{ this.decision }}</p>
</template>

<script>
import frame1 from '../assets/frame_03_ol.gif'
import frame2 from '../assets/frame.png'
import frame3 from '../assets/frame_02_.png'

export default {
  data() {
    return {
      intervalId: null,
      Lage: null,
      Lface: null,
      Ltop: null,
      Lleft: null,
      Rage: null,
      Rface: null,
      Rtop: null,
      Rleft: null,
      DataUrl: null,
      one: 0,
      Num: null,
      ImgaeList: [],
      kansei_num: null,
      countNum: 0,
      decision: 'AIが画像を解析中...',
      aiAnalysisAct: true,
      hasErrorAct: false
    }
  },
  created: function() {
    this.kansei_num = Math.ceil(Math.random() * 7)
    this.intervalId = setInterval(() => {
      if (localStorage.getItem('DataUrl') != null) {
        this.Rface = Math.round(Number(localStorage.getItem('Lface')) * 100)
        this.Lface = Math.round(Number(localStorage.getItem('Rface')) * 100)
        this.Rtop = Number(localStorage.getItem('Rtop')) + 100
        this.Rleft = Number(localStorage.getItem('Rleft')) + 300
        this.Ltop = Number(localStorage.getItem('Ltop')) + 100
        this.Lleft = Number(localStorage.getItem('Lleft')) + 300
        var booNum = Math.floor(Math.random() * 2)
        console.log('boolean' + booNum)
        if (Boolean == 0) {
          this.one = this.Rface + Math.floor(Math.random() * 24)
          console.log(this.one)
        } else {
          this.one = this.Rface - Math.floor(Math.random() * 24)
          console.log(this.one)
        }
        this.DataUrl = localStorage.getItem('DataUrl')
        // 歓声画像出力と同じタイミングで再生する
        if (this.one) {
          this.on = true
        }
        clearInterval(this.intervalId)
        localStorage.clear()
      } else if (this.countNum == 5) {
        this.aiAnalysisAct = false
        this.hasErrorAct = true
        this.decision = '2人の顔がおもしろすぎて、異常値が検出されたよ！'
      } else if (this.countNum == 10) {
        this.$router.push({ path: 'camera' })
      }
      this.countNum++
    }, 1000)
    this.Num = Math.floor(Math.random() * 3)
    this.ImgaeList.push(frame1)
    this.ImgaeList.push(frame2)
    this.ImgaeList.push(frame3)
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
  }
}
</script>

<style scoped>
.resultface {
  position: relative;
}
.resultface img {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 30px auto;
  width: 1480px;
  height: 920px;
}
.resultface .faceImage {
  transform: rotateY(180deg);
}
.resultface .frameImage {
  z-index: 9;
}

.position {
  position: absolute;
  z-index: 20;
}

.result {
  color: white;
  font-size: 60px;
}

.reloadButton {
  position: absolute;
  top: 750px;
  left: 40%;
  z-index: 100;
}

.aiAnalysis {
  font-size: 45px;
  font-weight: bold;
  color: #003fff;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  margin: auto;
  width: 500px;
  height: 64px;
}

.hasError {
  font-size: 45px;
  font-weight: bold;
  color: red;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  margin: auto;
  width: 800px;
  height: 64px;
}
</style>
