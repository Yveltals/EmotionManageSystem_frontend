<template>
<div class="notfoud-container">
    <div class="img-404">
    </div>
    <p class="notfound-p">您访问的页面不存在</p>
</div>
</template>

<script>
export default {
	name: 'NotFound'
}
</script>

<style scoped>
a {
  text-decoration: none
}
.notfoud-container{
    background-color: #f5f6f8;
	height: 100%;
}
.notfoud-container .img-404 {
    height: 300px;
    background: url(../../assets/404page.png) no-repeat;
    background-position: center center;
    background-size: 200px auto;
}
.notfoud-container .notfound-p {
    line-height: 70px;
    font-size: 35px;
    padding-bottom: 15px;
    text-align: center;
    color: #c1c4c9
}
</style>
  