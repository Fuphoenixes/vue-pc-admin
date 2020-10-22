<template>
  <div class="fu-date-range-picker">
    <div>
      <el-date-picker
        v-bind="{
          ...$attrs,
          value: value1,
          type,
          pickerOptions: {
            ...pickerOptions,
            disabledDate: disabledDate1
          },
          placeholder: startPlaceholder
        }"
        v-on="{
          ...$listeners,
          input: picker1Change,
          change: picker1Change
        }"
      />
      <span>至</span>
      <el-date-picker
        v-bind="{
          ...$attrs,
          value: value2,
          type,
          pickerOptions: {
            ...pickerOptions,
            disabledDate: disabledDate2
          },
          placeholder: endPlaceholder
        }"
        v-on="{
          ...$listeners,
          input: picker2Change,
          change: picker2Change
        }"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'fu-date-range-picker',
    props: {
      value: {
        type: Array,
        required: true
      },
      type: {
        type: String,
        default: 'date',
        validator(value) {
          const list = ['year', 'month', 'date', 'dates', 'week', 'datetime']
          const isValid = list.some(item => item === value)
          if (!isValid) throw new Error('props type must be one of "year/month/date/dates/week/datetime" !')
          return isValid
        }
      },
      startPlaceholder: {
        type: String,
        default: '开始时间'
      },
      endPlaceholder: {
        type: String,
        default: '结束时间'
      },
      pickerOptions: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        value1: '',
        value2: ''
      }
    },
    watch: {
      value: {
        handler(val) {
          this.value1 = val[0]
          this.value2 = val[1]
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      picker1Change(val) {
        const value = [val, this.value2]
        this.$emit('input', value)
        this.$emit('change', value)
      },
      picker2Change(val) {
        const value = [this.value1, val]
        this.$emit('input', value)
        this.$emit('change', value)
      },
      disabledDate1(current) {
        const { disabledDate } = this.pickerOptions
        return (disabledDate ? disabledDate() : false) || (this.value2 ? current.getTime() >= new Date(this.value2).getTime() : false)
      },
      disabledDate2(current) {
        const { disabledDate } = this.pickerOptions
        return (disabledDate ? disabledDate() : false) || (this.value1 ? current.getTime() <= new Date(this.value1).getTime() : false)
      },
      focusLeft() {
        this.$refs.picker1.focus()
      },
      focusRight() {
        this.$refs.picker2.focus()
      },
      focus() {
        this.$refs.picker1.focus()
        this.$refs.picker2.focus()
      }
    }
  }
</script>

<style lang="scss" scoped>
.fu-date-range-picker {
  display: inline-block;
  width: 100%;
  vertical-align: bottom;
  & > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > span {
      display: inline-block;
      width: 33px;
      text-align: center;
    }
    & /deep/ .el-date-editor {
      flex: 1;
    }
  }
}
</style>
