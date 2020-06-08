<template>
  <bootstrap-modal ref="vmResizeModal" :need-header="true" :need-footer="true" :size="'medium'">
    <div slot="title">
      <h4 class="modal-title">Resize Modal</h4>
    </div>
    <div slot="body">
      <div class="form-group">
        <label class="control-label">Choose Flavor:</label>
        <select type="text" class="form-control">
          <option value="">Select</option>
          <option v-for="flavour in flavours" :key="flavour.id" :value="flavour.id">{{ flavour.name }}</option>
        </select>
      </div>
      <div>
        <table>
          <thead>
            <th></th>
            <th>Existing</th>
            <th>Requested</th>
          </thead>
          <tbody>
            <tr>
              <td>VCPu</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div slot="footer">
      <button type="submit" class="btn btn-primary" @click.prevent="">Assign</button>
      <button type="button" class="btn btn-default" @click="hideModal">Close</button>
    </div>
  </bootstrap-modal>
</template>

<script>
export default {
  name: 'VirtualMachineListRowVmResize'
}
</script>

<style scoped>

</style>
