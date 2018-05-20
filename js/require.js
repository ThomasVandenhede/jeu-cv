function require(filenames, cb) {
    var filesLoaded = 0;

    for (var i = 0; i < filenames.length; i++) {
        var filename = filenames[i];
        var script = document.createElement("script");
        script.setAttribute("src", filename + ".js");
        script.setAttribute("async", true);
        document.body.appendChild(script);
        script.onload = (function (filename) {
            return function () {
                console.log(filename + " loaded!");
                filesLoaded++;
                if (filesLoaded === filenames.length) {
                    cb();
                }
            }
        })(filename);
    }
}