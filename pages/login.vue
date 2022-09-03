<template>
  <div class="container row">
    <div class="col-7">
        <div class="d-flex flex-column align-content-center">
            <div class="fs-64">{{ $t('tag_line_1') }}</div>
            <div class="fs-64">{{ $t('tag_line_2') }}</div>
            <TagImage />
        </div>
    </div>
    <div class="col-5">
      <LogInForm />
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>