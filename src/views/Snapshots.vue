<template>
    <div class="row">
        <div class="col-xs-12">
            <div class="snap-table-container">
                <div class="snap-table-head clearfix">
                    <h1>Snapshots</h1>
                    <a class="btn btn-cloud" href="#">Take Snapshot</a>
                </div>
                <table style="width:100%;" cellspacing="0">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Region</th>
                        <th>Public</th>
                        <th>Format</th>
                        <th>Bootable</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><span class="snap-title"><img src="@/assets/images/icon-snapshot-fill.svg" alt=""> snapshot 1</span></td>
                        <td><span class="snap-size">195.1 MiB</span></td>
                        <td>europe-1</td>
                        <td>
                            <div class="check-status">
                                <input value="1" id="opt1" type="checkbox" checked>
                                <label for="opt1"></label>
                            </div>
                        </td>
                        <td><span class="snap-format">VHD</span></td>
                        <td>
                            <div class="check-status">
                                <input value="2" id="opt2" type="checkbox" checked>
                                <label for="opt2"></label>
                            </div>
                        </td>
                        <td><span class="snap-status btn-cloud">Active</span></td>
                        <td>
                            <div class="btn-group">
                                <a href="#"><img src="@/assets/images/icon-play.svg" alt=""></a>
                                <a href="#"><img src="@/assets/images/icon-camera.svg" alt=""></a>
                                <a href="#"><img src="@/assets/images/icon-close.svg" alt=""></a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td><span class="snap-title"><img src="@/assets/images/icon-snapshot-fill.svg" alt=""> snapshot 2</span></td>
                        <td><span class="snap-size">711.7 MiB</span></td>
                        <td>europe-1</td>
                        <td>
                            <div class="check-status">
                                <input value="3" id="opt3" type="checkbox" checked>
                                <label for="opt3"></label>
                            </div>
                        </td>
                        <td><span class="snap-format">QCOW</span></td>
                        <td>
                            <div class="check-status">
                                <input value="4" id="opt4" type="checkbox">
                                <label for="opt4"></label>
                            </div>
                        </td>
                        <td><span class="snap-status btn-cloud">Active</span></td>
                        <td>
                            <div class="btn-group">
                                <a href="#"><img src="@/assets/images/icon-play.svg" alt=""></a>
                                <a href="#"><img src="@/assets/images/icon-camera.svg" alt=""></a>
                                <a href="#"><img src="@/assets/images/icon-close.svg" alt=""></a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td><span class="snap-title"><img src="@/assets/images/icon-snapshot.svg" alt=""> snapshot 3</span></td>
                        <td><span class="snap-size">223.5 MiB</span></td>
                        <td>europe-1</td>
                        <td>
                            <div class="check-status">
                                <input value="5" id="opt5" type="checkbox">
                                <label for="opt5"></label>
                            </div>
                        </td>
                        <td><span class="snap-format">QCOW</span></td>
                        <td>
                            <div class="check-status">
                                <input value="6" id="opt6" type="checkbox">
                                <label for="opt6"></label>
                            </div>
                        </td>
                        <td><span class="snap-status btn-cloud">Active</span></td>
                        <td>
                            <div class="btn-group">
                                <a href="#"><img src="@/assets/images/icon-play.svg" alt=""></a>
                                <a href="#"><img src="@/assets/images/icon-camera.svg" alt=""></a>
                                <a href="#"><img src="@/assets/images/icon-close.svg" alt=""></a>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Snapshots'
}
</script>
