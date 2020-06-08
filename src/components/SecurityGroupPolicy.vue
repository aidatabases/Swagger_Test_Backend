<template>
    <div class="row">
        <div class="col-xs-12">
            <div class="snap-table-container fip">
                <div class="snap-table-head clearfix">
                    <h1>Users List</h1>
                </div>
                <div>
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-lg-3 control-label">Policy/ACL Name</label>
                            <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
                                <input class="form-control" placeholder="" type="text">
                            </div>
                        </div>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Scope</th>
                            <th>Read</th>
                            <th>Write</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Compute</th>
                            <td><input type="checkbox"></td>
                            <td><input type="checkbox"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'SecurityGroupPolicy'
}
</script>
