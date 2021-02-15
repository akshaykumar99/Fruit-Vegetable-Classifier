// A class that wraps webcam video elements to capture Tensor4Ds.

class Webcam {
    constructor(webcamElement) {
        this.webcamElement = webcamElement;
    }

    capture() {
        return tf.tidy(() => {
            const webcamImage = tf.browser.fromPixels(this.webcamElement);
            const reversedImage = webcamImage.reverse(1);
            var resized = tf.image.resizeBilinear(reversedImage, [100,100]);
            // Expand the outer most dimension so we have a batch size of 1.
            const batchedImage = resized.expandDims(0);
            return batchedImage.toFloat().div(tf.scalar(255));
        });
    }
  
    async setup() {
        return new Promise((resolve, reject) => {
            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;
            if (navigator.getUserMedia) {
                navigator.getUserMedia(
                    {video: {width: 250, height: 250}},
                    stream => {
                        this.webcamElement.srcObject = stream;
                        this.webcamElement.addEventListener('loadeddata', async () => {
                        resolve();
                        }, false);
                    },
                    error => {
                        reject(error);
                    });
            } 
            else {
                reject();
            }
        });
    }
    async stopit(){
        var stream = this.webcamElement.srcObject;
        // now get all tracks
        var tracks = stream.getTracks();
        // now close each track by having forEach loop
        tracks.forEach(function(track) {
            // stopping every track
            track.stop();
        });
        // assign null to srcObject of video
        this.webcamElement.srcObject = null;
    };
  }
  