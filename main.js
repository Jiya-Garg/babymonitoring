object_status = "";
objects = [];
function preload() {
    song = loadSound("alarm_clock_old.mp3");
}
function setup() {
    canvas = createCanvas(380, 380);
    canvas.center();
    video = createCapture(VIDEO);
    video.size(380,380);
    video.hide();
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById('status').innerHTML = 'Status - Detecting Objects';
}
function modelLoaded() {
    console.log('Model is loaded!');
    object_status = true;
}
function gotResult(error, result) {
    if (error) {
        console.error(error);
    }
    console.log(result);
    objects = result
}
function draw() {
    image(video, 0, 0, 380, 380)
    if (object_status != "") {
        objectDetector.detect(video, gotResult);
        document.getElementById("status").innerHTML = "Status - Objects Detected";
        document.getElementById("baby_presence").innerHTML = "Number of Objects - " + objects.length;
        r = random(255);
        g = random(255);
        b = random(255);
        for (i = 0; i < objects.length; i++) {
            fill(r, g, b);
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 20);
            textSize(20)
            noFill();
            stroke(r, g, b);
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
            if (objects[i].label == "person") {
                song.stop()
                document.getElementById("baby_presence").innerHTML = "Baby Found";
            }
            else {
                song.play();
                document.getElementById("baby_presence").innerHTML = "Baby not Found";
            }
        }
        if (objects.length == 0) {
            song.play();
            document.getElementById("baby_presence").innerHTML = "Baby not Found";
        }
    }
}