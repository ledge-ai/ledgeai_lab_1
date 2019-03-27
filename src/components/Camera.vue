<template>
  <div v-if="cameraCom" class="cameraCom">
    <!-- お題タイトル -->
    <p v-show="!result" class="odai">{{ this.odai[odainum] }}</p>
    <!-- 撮影ビデオエリア -->
    <div class="cameraErea">
      <video ref="player" autoplay></video>
      <img class="faceFrame leftTarget" src="/static/face-frame.png">
      <img class="faceFrame rightTarget" src="/static/face-frame.png">
    </div>
    <!-- カウントダウン要素 -->
    <p class="countdown">{{ 
      count }}秒前</p>
    <!-- 撮影ボタン -->
    <button v-show="!start" @click="startBtn"><img src="../assets/satsuei.png" /></button>
    <canvas v-show="false" ref="canvas" width="1280" height="720"></canvas>
    <audio id="battle" :src="'/static/battle' + battle_num + '.mp3'" autoplay loop></audio>
    <audio id="video" src="/static/shotcamera.mp3"></audio>
  </div>
</template>

<script>
import axios from 'axios'
import Token from '../info.js' // FaceAPItoken

export default {
  data() {
    return {
      cameraCom: true,
      start: false,
      result: false,
      dataurl: '',
      count: 3,
      odai: [
        'Tinderと実物の乖離が激しかった時の悲しい表情',
        '渾身のギャグをなかったことにされた時の悲しい表情',
        'ペヤングを湯切りしたら中身も全部出た時の悲しい表情', // 悲しみ
        '環境を破壊する全人類に対する怒りの表情',
        '全然勉強してないわ〜ってやつが成績いい時の怒りの表情',
        '名作映画を観たけどそれほどじゃなかった時の怒りの表情', // 怒り
        '10年ぶりにシャバに戻ってきた時の嬉しい表情',
        'ツイッターでアイドルからリプが返ってきた時の嬉しい表情',
        '冷蔵庫開けたらプリンがあったときのちょっぴり嬉しい表情', // happy8
        'テレビから貞子が出てきた時の恐怖の表情',
        'コンビニで強盗に出くわした時の怖い表情',
        'お化けを実際に見ちゃった時の強張った表情', // 恐れ
        '玉手箱を空けて老いた自分の顔を見た時の驚いた表情',
        '自分の年収が低すぎた時の驚いた表情',
        '卵を割ったら2つ出てきた時の驚いた表情', // 驚き
        '親父ギャグを連呼する上司に対する軽蔑の表情',
        '電車でドア脇から意地でも動かない人に対する軽蔑の表情',
        '犬のフンを放置する飼い主に対しての軽蔑の表情', // 軽蔑
        '大好きな人が自分の事も好きだと知った時の最高に嬉しい表情',
        'ガリガリ君の棒にアタリと印字されてた時のちょっぴり嬉しい表情',
        '宝くじ当たっちゃった時の嬉しい表情', // happy
        '嬉しくも悲しくもない時の無表情',
        'レジでお会計をしている時の無表情',
        '無心の時の表情' // 無表情
      ],
      odainum: null,
      Lface: 0,
      Lage: null,
      Rface: 0,
      Rage: null,
      Lrec: null,
      Rrec: null,
      snapshotCanvas: null, // canvasのデータ
      snapshotPlayer: null, // canvasのデータ
      countdownIntervalId: null,
      shotCamera: true,
      battle_num: null
    }
  },
  created: function() {
    this.battle_num = Math.ceil(Math.random() * 5)
    // v.play()
    // コンポーネント作成時の処理
    // カメラを準備する
    window.navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(stream => {
        // success
        this.$refs.player.srcObject = stream
        console.log('Camera ready.')
      })
      .catch(error => {
        // error
        window.alert('Camera connection error! T_T')
        console.error('mediaDevice.getUserMedia() error:', error)
      })
  },
  methods: {
    startBtn: function() {
      const v = document.getElementById('video')
      console.log(v)
      const self = this
      // スタートボタンクリック > お題の出力 + カウントダウン開始
      this.odainum = Math.floor(Math.random() * self.odai.length)
      // this.odainum = 5
      this.start = true

      // カウントダウン実行
      this.countdownIntervalId = setInterval(() => {
        if (--this.count <= 0) {
          clearInterval(this.countdownIntervalId)
        }
      }, 1000)
      // // クリック時の音声
      // Vue.directive('play', function(el, binding) {
      //   if (binding.value) {
      //     el.play()
      //   } else {
      //     el.pause()
      //   }
      // })
      setTimeout(function() {
        v.play()
        // クリックイベントから6秒後に実行
        // キャンバスを準備する
        self.snapshotCanvas = self.$refs.canvas // コンポーネントに渡すために変数に格納する
        self.snapshotPlayer = self.$refs.player
        const snapshotCanvas = self.$refs.canvas
        const context = snapshotCanvas.getContext('2d')
        // ビデオフレームを、Canvasに描写
        context.drawImage(self.$refs.player, 0, 0, snapshotCanvas.width, snapshotCanvas.height)
        self.dataurl = snapshotCanvas.toDataURL('image/png') // base64データ
        // base64データをblobに変換してAPI叩く
        fetch(self.dataurl)
          .then(res => res.blob())
          .then(blobData => {
            axios({
              // faceapiで叩く
              method: 'post',
              url:
                'https://eastasia.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise',
              async: true,
              crossDomain: true,
              headers: {
                'Ocp-Apim-Subscription-Key': Token,
                'Content-Type': 'application/octet-stream'
              },
              processData: false,
              data: blobData
            })
              .then(response => {
                if (response.data.length === 2) {
                  var face1 = response.data[0]['faceRectangle']['left']
                  var face2 = response.data[1]['faceRectangle']['left']
                  if (face1 < face2) {
                    switch (self.odainum) {
                      case 0: // 悲しい顔
                      case 1: // 悲しい顔
                      case 2: // 悲しい顔
                        self.Lage = response.data[0]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Lface = response.data[0]['faceAttributes']['emotion']['sadness']
                        self.Ltop = response.data[0]['faceRectangle']['top']
                        self.Lleft = response.data[0]['faceRectangle']['left']
                        self.Rage = response.data[1]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Rface = response.data[1]['faceAttributes']['emotion']['sadness']
                        self.Rtop = response.data[1]['faceRectangle']['top']
                        self.Rleft = response.data[1]['faceRectangle']['left']
                        break
                      case 3: // 怒り
                      case 4: // 怒り
                      case 5: // 怒り
                        self.Lage = response.data[0]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Lface = response.data[0]['faceAttributes']['emotion']['anger']
                        self.Ltop = response.data[0]['faceRectangle']['top']
                        self.Lleft = response.data[0]['faceRectangle']['left']
                        self.Rage = response.data[1]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Rface = response.data[1]['faceAttributes']['emotion']['anger']
                        self.Rtop = response.data[1]['faceRectangle']['top']
                        self.Rleft = response.data[1]['faceRectangle']['left']
                        break
                      case 6: // happiness
                      case 7: // happiness
                      case 8: // happiness
                        self.Lage = response.data[0]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Lface = response.data[0]['faceAttributes']['emotion']['happiness']
                        self.Ltop = response.data[0]['faceRectangle']['top']
                        self.Lleft = response.data[0]['faceRectangle']['left']
                        self.Rage = response.data[1]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Rface = response.data[1]['faceAttributes']['emotion']['happiness']
                        self.Rtop = response.data[1]['faceRectangle']['top']
                        self.Rleft = response.data[1]['faceRectangle']['left']
                        break
                      case 9: // ビビリ
                      case 10: // ビビリ
                      case 11: // ビビリ
                        self.Lage = response.data[0]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Lface = response.data[0]['faceAttributes']['emotion']['fear']
                        self.Ltop = response.data[0]['faceRectangle']['top']
                        self.Lleft = response.data[0]['faceRectangle']['left']
                        self.Rage = response.data[1]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Rface = response.data[1]['faceAttributes']['emotion']['fear']
                        self.Rtop = response.data[1]['faceRectangle']['top']
                        self.Rleft = response.data[1]['faceRectangle']['left']
                        break
                      case 12: // 驚愕
                      case 13: // 驚愕
                      case 14: // 驚愕
                        self.Lage = response.data[0]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Lface = response.data[0]['faceAttributes']['emotion']['surprise']
                        self.Ltop = response.data[0]['faceRectangle']['top']
                        self.Lleft = response.data[0]['faceRectangle']['left']
                        self.Rage = response.data[1]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Rface = response.data[1]['faceAttributes']['emotion']['surprise']
                        self.Rtop = response.data[1]['faceRectangle']['top']
                        self.Rleft = response.data[1]['faceRectangle']['left']
                        break
                      case 15: // 軽蔑
                      case 16: // 軽蔑
                      case 17: // 軽蔑
                        self.Lage = response.data[0]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Lface = response.data[0]['faceAttributes']['emotion']['contempt']
                        self.Ltop = response.data[0]['faceRectangle']['top']
                        self.Lleft = response.data[0]['faceRectangle']['left']
                        self.Rage = response.data[1]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Rface = response.data[1]['faceAttributes']['emotion']['contempt']
                        self.Rtop = response.data[1]['faceRectangle']['top']
                        self.Rleft = response.data[1]['faceRectangle']['left']
                        break
                      case 18: // happy
                      case 19: // happy
                      case 20: // happy
                        self.Lage = response.data[0]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Lface = response.data[0]['faceAttributes']['emotion']['happiness']
                        self.Ltop = response.data[0]['faceRectangle']['top']
                        self.Lleft = response.data[0]['faceRectangle']['left']
                        self.Rage = response.data[1]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Rface = response.data[1]['faceAttributes']['emotion']['happiness']
                        self.Rtop = response.data[1]['faceRectangle']['top']
                        self.Rleft = response.data[1]['faceRectangle']['left']
                        break
                      case 21: // ニュートラル
                      case 22: // ニュートラル
                      case 23: // ニュートラル
                        self.Lage = response.data[0]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Lface = response.data[0]['faceAttributes']['emotion']['neutral']
                        self.Ltop = response.data[0]['faceRectangle']['top']
                        self.Lleft = response.data[0]['faceRectangle']['left']
                        self.Rage = response.data[1]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Rface = response.data[1]['faceAttributes']['emotion']['nuetral']
                        self.Rtop = response.data[1]['faceRectangle']['top']
                        self.Rleft = response.data[1]['faceRectangle']['left']
                        break
                    }
                    localStorage.setItem('Lface', self.Lface)
                    localStorage.setItem('Rface', self.Rface)
                    localStorage.setItem('Rtop', self.Rtop)
                    localStorage.setItem('Rleft', self.Rleft)
                    localStorage.setItem('Ltop', self.Ltop)
                    localStorage.setItem('Lleft', self.Lleft)
                    localStorage.setItem('DataUrl', self.dataurl)
                  } else {
                    switch (self.odainum) {
                      case 0: // 悲しい顔
                      case 1: // 悲しい顔
                      case 2: // 悲しい顔
                        self.Lage = response.data[0]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Lface = response.data[0]['faceAttributes']['emotion']['sadness']
                        self.Ltop = response.data[0]['faceRectangle']['top']
                        self.Lleft = response.data[0]['faceRectangle']['left']
                        self.Rage = response.data[1]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Rface = response.data[1]['faceAttributes']['emotion']['sadness']
                        self.Rtop = response.data[1]['faceRectangle']['top']
                        self.Rleft = response.data[1]['faceRectangle']['left']
                        break
                      case 3: // 悲しい顔
                      case 4: // 悲しい顔
                      case 5: // 悲しい顔
                        self.Lage = response.data[0]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Lface = response.data[0]['faceAttributes']['emotion']['anger']
                        self.Ltop = response.data[0]['faceRectangle']['top']
                        self.Lleft = response.data[0]['faceRectangle']['left']
                        self.Rage = response.data[1]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Rface = response.data[1]['faceAttributes']['emotion']['anger']
                        self.Rtop = response.data[1]['faceRectangle']['top']
                        self.Rleft = response.data[1]['faceRectangle']['left']
                        break
                      case 6: // 嫌悪
                      case 7: // 嫌悪
                      case 8: // 嫌悪
                        self.Lage = response.data[0]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Lface = response.data[0]['faceAttributes']['emotion']['happiness']
                        self.Ltop = response.data[0]['faceRectangle']['top']
                        self.Lleft = response.data[0]['faceRectangle']['left']
                        self.Rage = response.data[1]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Rface = response.data[1]['faceAttributes']['emotion']['happiness']
                        self.Rtop = response.data[1]['faceRectangle']['top']
                        self.Rleft = response.data[1]['faceRectangle']['left']
                        break
                      case 9: // ビビリ
                      case 10: // ビビリ
                      case 11: // ビビリ
                        self.Lage = response.data[0]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Lface = response.data[0]['faceAttributes']['emotion']['fear']
                        self.Ltop = response.data[0]['faceRectangle']['top']
                        self.Lleft = response.data[0]['faceRectangle']['left']
                        self.Rage = response.data[1]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Rface = response.data[1]['faceAttributes']['emotion']['fear']
                        self.Rtop = response.data[1]['faceRectangle']['top']
                        self.Rleft = response.data[1]['faceRectangle']['left']
                        break
                      case 12: // 驚愕
                      case 13: // 驚愕
                      case 14: // 驚愕
                        self.Lage = response.data[0]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Lface = response.data[0]['faceAttributes']['emotion']['surprise']
                        self.Ltop = response.data[0]['faceRectangle']['top']
                        self.Lleft = response.data[0]['faceRectangle']['left']
                        self.Rage = response.data[1]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Rface = response.data[1]['faceAttributes']['emotion']['surprise']
                        self.Rtop = response.data[1]['faceRectangle']['top']
                        self.Rleft = response.data[1]['faceRectangle']['left']
                        break
                      case 15: // 軽蔑
                      case 16: // 軽蔑
                      case 17: // 軽蔑
                        self.Lage = response.data[0]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Lface = response.data[0]['faceAttributes']['emotion']['contempt']
                        self.Ltop = response.data[0]['faceRectangle']['top']
                        self.Lleft = response.data[0]['faceRectangle']['left']
                        self.Rage = response.data[1]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Rface = response.data[1]['faceAttributes']['emotion']['contempt']
                        self.Rtop = response.data[1]['faceRectangle']['top']
                        self.Rleft = response.data[1]['faceRectangle']['left']
                        break
                      case 18: // happy
                      case 19: // happy
                      case 20: // happy
                        self.Lage = response.data[0]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Lface = response.data[0]['faceAttributes']['emotion']['happiness']
                        self.Ltop = response.data[0]['faceRectangle']['top']
                        self.Lleft = response.data[0]['faceRectangle']['left']
                        self.Rage = response.data[1]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Rface = response.data[1]['faceAttributes']['emotion']['happiness']
                        self.Rtop = response.data[1]['faceRectangle']['top']
                        self.Rleft = response.data[1]['faceRectangle']['left']
                        break
                      case 21: // ニュートラル
                      case 22: // ニュートラル
                      case 23: // ニュートラル
                        self.Lage = response.data[0]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Lface = response.data[0]['faceAttributes']['emotion']['neutral']
                        self.Ltop = response.data[0]['faceRectangle']['top']
                        self.Lleft = response.data[0]['faceRectangle']['left']
                        self.Rage = response.data[1]['faceAttributes']['age'] // 年齢を変数に格納
                        self.Rface = response.data[1]['faceAttributes']['emotion']['nuetral']
                        self.Rtop = response.data[1]['faceRectangle']['top']
                        self.Rleft = response.data[1]['faceRectangle']['left']
                        break
                    }
                    localStorage.setItem('Rtop', self.Rtop)
                    localStorage.setItem('Rleft', self.Rleft)
                    localStorage.setItem('Ltop', self.Ltop)
                    localStorage.setItem('Lleft', self.Lleft)
                    localStorage.setItem('Lface', self.Lface)
                    localStorage.setItem('Rface', self.Rface)
                    localStorage.setItem('DataUrl', self.dataurl)
                  }
                } else {
                  localStorage.setItem('Lage', response.data[0]['faceAttributes']['age'])
                  localStorage.setItem('Lface', response.data[0]['faceAttributes']['emotion']['neutral'])
                  localStorage.setItem('Rage', self.Rage)
                  localStorage.setItem('Rface', self.Rface)
                  localStorage.setItem('DataUrl', self.dataurl)
                }
              })
              .catch(e => {
                console.error(e)
              })
          })
        self.result = true
        // // ここでpauseしないと、コンポーネント戻ると再生されてしまう
        // Vue.directive('play', function(el, binding) {
        //   if (binding.value) {
        //     el.pause()
        //   } else {
        //     // el.pause()
        //     console.log('false')
        //   }
        // })
        self.$router.push({ name: 'result' })
      }, self.count * 1000)
    }
  },
  beforeDestroy() {
    clearInterval(this.countdownIntervalId)
  }
}
</script>

<style scoped>
.cameraCom {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cameraCom button {
  position: absolute;
  bottom: 7%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9;
}
.cameraCom video {
  width: 1280px;
  height: 920px;
  transform: rotateY(180deg);
}
.cameraCom .faceFrame {
  position: absolute;
  top: 10%;
  height: 70%;
  opacity: 0.5;
  z-index: 9;
}
.cameraCom .leftTarget {
  left: 10%;
}
.cameraCom .rightTarget {
  right: 10%;
}

.result {
  color: yellowgreen;
  font-size: 30px;
}

.odai {
  font-size: 5em;
  color: #f442b6;
  position: absolute;
  width: 100%;
  top: 7%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 9;
}

.countdown {
  color: red;
  font-size: 5em;
  position: absolute;
  bottom: 7%;
  right: 6%;
}

.cameraErea {
  position: relative;
}
</style>
