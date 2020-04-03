<template>
  <div id="app">
    <my-tree
    :delete="deleteFn"
    :data.sync="data"
    :fileDrop="fileDrop"
    :directoryDrop="directoryDrop"
    v-if="data.length"
    ></my-tree>
  </div>
</template>

<script>
import { getTreeList } from './api/request'
export default {
  data () {
    return {
      data: [],
      fileDrop: [
        { text: 'rm', value: '删除文件' }
      ],
      directoryDrop: [
        { text: 'rn', value: '修改名字' },
        { text: 'rm', value: '删除文件夹' }
      ],
      parentId: 'parentId',
      menuItems: []
    }
  },
  async mounted () {
    const departments = await getTreeList('/departments')
    const employees = await getTreeList('/employees')
    // console.log(departments, employees)
    // 1扁平的数据如何变成 多层数据 递归数据

    // departments.data.forEach(p => p.type === 'parent')
    departments.data.forEach(item => {
      // console.log(item)
      item.type = 'parent'
    })
    console.log(departments.data)
    this.data = [...departments.data, ...employees.data]
    // console.log(AllData)
  },
  methods: {
    deleteFn (id) {
      // 这个方法必须返回一个Promise
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 3000)
      })
    }
  }
}
</script>

<style lang="less">
</style>
