<template>
  <div class="table-header-options clearfix">
    <div class="col-md-6">
      <form class="form-inline visible-instance-setting">
        <div class="form-group">
          <label>Show</label>
          <select v-model="listCount" class="form-control" @change="listCountChangeHandler">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>entries</span>
        </div>
      </form>
    </div>
    <div class="col-md-6 text-right">
      <!--<div class="form-group has-feedback search-box pull-right">
      <span class="form-control-feedback">
          <i class="fa fa-search"></i>
      </span>
      <input type="text" class="form-control" placeholder="Search Virtual Machines">
    </div>-->
      <!--<div class="search-box pull-right">
        <div class="input-group">
          <input v-model.trim="searchQuery" type="text" class="form-control" placeholder="Search">
          <span class="input-group-addon" @click.stop="searchHandler">
            <i class="fa fa-search"></i>
          </span>
          <span class="input-group-addon" @click.stop="clearSearchHandler">
            <i class="fa fa-times"></i>
          </span>
        </div>
      </div>-->

    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBox',
  data () {
    return {
      searchQuery: null,
      listCount: 10
    }
  },
  computed: {
    isSearchQueryEntered () {
      return !!this.searchQuery
    }
  },
  methods: {
    searchHandler () {
      if (this.isSearchQueryEntered) {
        this.$emit('search-query-triggered', this.searchQuery)
      }
    },
    clearSearchHandler () {
      if (this.isSearchQueryEntered) {
        this.searchQuery = ''
        this.$emit('clear-search-triggered', this.searchQuery)
      }
    },
    listCountChangeHandler () {
      this.$emit('list-count-changed', this.listCount)
    }
  }
}
</script>

<style scoped>
  .table-header-options {
    margin: 10px 20px;
  }
  .search-box {
    max-width: 250px;
    display: inline-flex;
  }

  .search-box .input-group-addon {
    cursor: pointer;
  }
  /*
  .search-box .form-control-feedback {
    left: 0;
    color: #cccccc;
  }
  .search-box .form-control {
    padding-left: 34px;
    height: 34px;
  }
*/
  .visible-instance-setting { display: inline-block; }
  .visible-instance-setting label{
    display: inline-block !important;
  }
  .visible-instance-setting .form-control {
    height: calc(1.5em + .5rem + 12px);
    margin-right: 6px;
    margin-left: 6px;
  }
</style>
