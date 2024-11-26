document.addEventListener("DOMContentLoaded", function() {
    var video = document.querySelector("#video");
    video.controls = false;
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
          video.srcObject = stream;
          let stream_settings = stream.getVideoTracks()[0].getSettings();
          let stream_width = stream_settings.width;
          let stream_height = stream_settings.height;
        let stream_fps = stream_settings.frameRate;
        let stream_aspect_ratio = stream_width / stream_height;
        let resolution = stream_width + "x" + stream_height;
        function gcd(a, b) {
            return b == 0 ? a : gcd(b, a % b);
        }

        let divisor = gcd(stream_width, stream_height);
        let aspect_ratio = (stream_width / divisor) + ":" + (stream_height / divisor);

        res_div = document.getElementById("res");
        res_div.innerHTML = resolution;
        fps_div = document.getElementById("fps");
        fps_div.innerHTML = stream_fps;
        aspect_div = document.getElementById("ar");
        aspect_div.innerHTML = aspect_ratio;
        })
        .catch(function (err0r) {
          console.log("Something went wrong!" + err0r);
        });
    }
  });