export default {
    trunc: function (value, length, suffix) {
        return value.substring(0, length) + suffix;
    },
    capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
}
