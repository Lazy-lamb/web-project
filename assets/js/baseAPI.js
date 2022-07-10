//每次调用$.get()或$.post()会先调用ajaxPrefilter()这个函数,这个函数可以拿到Ajax提供的配置对象
$.ajaxPrefilter(function(option) {
    option.url = "http://www.liulongbin.top:3007" + option.url
    console.log(option.url);

})