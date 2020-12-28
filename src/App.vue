<script>
import onLaunch from './utlis/onLaunch.js'
export default {
  onLaunch: function() {
    for (let fn in onLaunch) {
      onLaunch[fn](this)
    }
  },
  onShow: function() {},
  onHide: function() {}
}
</script>

<style>
/*每个页面公共css */
view {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
image {
  will-change: transform;
}
</style>
