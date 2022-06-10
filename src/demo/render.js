// render 函数示例
function getChildrenTextContent (children) {
  return children
    .map(node => {
      return typeof node.children === 'string'
        ? node.children
        : Array.isArray(node.children)
        ? getChildrenTextContent(node.children)
        : ''
    })
    .join('')
}

app.component('anchored-heading', {
  render () {
    const headingId = getChildrenTextContent(this.$slots.default())
      .toLowerCase()
      .replace(/\W+/g, '-')
      .replace(/(^-|-$)/g, '')
    

    return h(
      'h' + this.level,
      null,
      [
        h(
          'a',
          {
            name: headingId,
            href: '#' + headingId
          },
          this.$slots.default()
        )
      ]
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})

console.log(resolveComponent('anchored-heading'))
