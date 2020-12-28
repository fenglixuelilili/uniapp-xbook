<template>
  <view>
    <commentpage
      :key="index"
      :data="item"
      v-for="(item, index) in books"
      v-show="i == index"
    ></commentpage>
  </view>
</template>
<script>
import commentpage from './commentpage.vue'
// eslint-disable-next-line no-unused-vars
export default {
  props: ['i', 'booklist'],
  components: {
    commentpage
  },
  data() {
    return {
      books: [],
      timer: null
    }
  },
  methods: {
    end() {
      // 停止乐音
      this.$xw.playAudio('')
    }
  },
  watch: {
    booklist(value) {
      let booklists = value
      booklists.forEach(item => {
        this.books.push({
          url: item.image_url,
          audio: item.voice_url,
          interactive_elements: item.interactive_elements
        })
      })
    }
  }
}
</script>
