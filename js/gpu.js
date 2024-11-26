function getGPUInfo() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        return 'WebGL not supported';
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) {
        return 'WEBGL_debug_renderer_info not supported';
    }

    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    const filteredRenderer = renderer.match(/Intel\(R\) Iris\(R\) Xe Graphics/);
    const mts = gl.getParameter(gl.MAX_TEXTURE_SIZE)
    return filteredRenderer ? filteredRenderer[0] : 'Unknown GPU';
}

function getResolutionInfo() {
    return `${screen.width} x ${screen.height}`;
}

function getFPS(callback) {
    requestAnimationFrame(function (start) {
        requestAnimationFrame(function (end) {
            const fps = 1000 / (end - start);
            callback(Math.round(fps));
        });
    });
}



document.addEventListener("DOMContentLoaded", function() {
    const gpuInfoElement = document.getElementById('gpu-name');
    gpuInfoElement.innerHTML = getGPUInfo();
    document.getElementById('res').innerHTML = getResolutionInfo();
    document.getElementById('cd').innerHTML = screen.colorDepth + ' bit';
    document.getElementById('mts').innerHTML = String(document.createElement('canvas').getContext('webgl').getParameter(document.createElement('canvas').getContext('webgl').MAX_TEXTURE_SIZE)) + 'x' + String(document.createElement('canvas').getContext('webgl').getParameter(document.createElement('canvas').getContext('webgl').MAX_TEXTURE_SIZE)) + 'px';
    getFPS(function(fps) {
        const fpsInfoElement = document.getElementById('fps');
        fpsInfoElement.innerHTML = fps;
    });
});
