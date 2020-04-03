<template>
  <el-tree :data="allData" default-expand-all :render-content="render"></el-tree>
</template>

<script>
export default {
  name: 'MyTree',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    fileDrop: Array,
    directoryDrop: Array,
    delete: Function
  },
  data () {
    return {
      allData: [],
      currentId: '', // 默认当前点击了谁的修改
      currentContent: '' // 当前编辑的内容
    }
  },
  watch: {
    // 需要监控父组件传递的data属性，如果有更新 重新熏染
    data () {
      // 数据更新了就需要重新熏染
      this.transformData()
    }
  },
  methods: {
    isParent (data) {
      return data.type === 'parent'
    },
    remove (id) {
      // 删除页面中的数据
      const list = JSON.parse(JSON.stringify(this.data))
      const newList = list.filter(item => item.id !== id)
      // 告诉父亲同步数据
      this.$emit('update:data', newList)
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    },
    handleRename (data) {
      console.log(data)
      // 重命名
      this.currentContent = data.label
      this.currentId = data.id
    },
    handleRemove (data) {
      console.log(data)
      // 删除文件
      this.$confirm(`此操作将永久删除该文件, ${data.name}是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 不能直接将 数据删除 需要调用用户的删除方法
          // 如果用户传递了delete方法 可以直接调用
          this.delete
            ? this.delete(data.id).then(() => {
              this.remove(data.id)
            })
            : this.remove(data.id)
          // 没有直接删除即可
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleCommand (data, value) {
      // console.log(value)
      if (value === 'rn') {
        this.handleRename(data)
      } else if (value === 'rm') {
        this.handleRemove(data)
      }
    },
    canncel () {
      this.currentId = ''
    },
    ok (data) {
      const list = JSON.parse(JSON.stringify(this.data))
      const newList = list.find(item => item.id === data.id)
      newList.name = this.currentContent
      // 告诉父亲同步数据
      this.currentId = ''
      this.$emit('update:data', newList)
      this.$message({
        type: 'success',
        message: '修改成功'
      })
    },
    handleInput (v) {
      // console.log(v)
      this.currentContent = v
    },
    render (h, { node, data, store }) {
      // console.log(data.type)
      // console.log(node)
      const list = this.isParent(data) ? this.directoryDrop : this.fileDrop
      return (
        <div style={{ width: '100%' }}>
          {this.isParent(data) ? (
            node.expanded ? (
              <i class="el-icon-folder-opened"></i>
            ) : (
              <i class="el-icon-folder"></i>
            )
          ) : (
            <i class="el-icon-document"></i>
          )}
          {data.id === this.currentId ? (
            <el-input value={this.currentContent} on-input={this.handleInput}></el-input>
          ) : (
            data.label
          )}

          {data.id !== this.currentId ? (
            <el-dropdown
              placement="bottom-start"
              on-command={this.handleCommand.bind(this, data)}
            >
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                {list.map(item => (
                  <el-dropdown-item command={item.text}>
                    {item.value}
                  </el-dropdown-item>
                ))}
              </el-dropdown-menu>
            </el-dropdown>
          ) : (
            <span style={{ float: 'right' }}>
              <el-button type="text" on-click={this.ok.bind(this, data)}>确认</el-button>
              <el-button type="text" on-click={this.canncel}>取消</el-button>
            </span>
          )}
        </div>
      )
    },
    transformData () {
      // 需要根据数据进行克隆，克隆后的数据再进行操作
      // console.log(this.data)
      const AllData = JSON.parse(JSON.stringify(this.data))
      // console.log(AllData)
      // 目的就是防止在子组件中操作我们父组件的数据
      const treeMapList = AllData.reduce((memo, current) => {
        // current.label = current.name
        memo[current.id] = current
        return memo
      }, {})
      // console.log(treeMapList)
      // vue里vuex的源码
      const result = AllData.reduce((arr, current) => {
        const parentId = current.parentId
        const parent = treeMapList[parentId]
        if (parent) {
          parent.children
            ? parent.children.push(current)
            : (parent.children = [current])
        } else if (parentId === 0) {
          // 这是根文件夹
          arr.push(current)
        }
        return arr
      }, [])
      // console.log(result)
      this.allData = result
    }
  },
  mounted () {
    this.transformData()
  }
}
</script>

<style lang="less">
.el-tree {
  width: 50%;
  .el-dropdown {
    float: right;
  }
  .el-tree-node__content {
    height: 32px;
  }
  .el-input {
    width: 50%;
  }
}
</style>
