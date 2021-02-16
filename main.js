var model;
var output = document.getElementById('result');
var imag = document.getElementById('im');
const webcam = new Webcam(document.getElementById('wc'));
var permission = false;
var data_list = ['Apple', 'Broccoli', 'Grape', 'Lemon', 'Mango', 'Orange', 'Strawberry'];

async function run(){
	const model_url = 'model.json';
	model = await tf.loadLayersModel(model_url);
	// console.log(model.summary());
	// console.log('model loaded');
	output.innerHTML = "Result :";
}

async function find(){
	const webcamElement = tf.browser.fromPixels(imag);

	const fimg = webcamElement.toFloat().div(tf.scalar(255));
	var resized = tf.image.resizeBilinear(fimg, [100,100]);
    var tensor = resized.expandDims(0);

	const result = model.predict(tensor);
	var outp = result.dataSync();
	
	var ind = outp.indexOf(Math.max(...outp));
	var final_output = data_list[ind];

	output.innerText = `Result : ${final_output}`;
}

async function doclass1(){
	output.innerHTML = 'Result : Classifying . . .';
    await new Promise(res=>setTimeout(()=>res(true),1));
	find();
}
async function doclass2(){
	var sour = 'https://cors-anywhere.herokuapp.com/' + document.getElementById("myurl").value;
	output.innerHTML = 'Result : Classifying . . .';
	await new Promise(res=>setTimeout(()=>res(true),100));
	imag.src = sour;
	find();
}
var loadFile = function(event) {
	imag.src = URL.createObjectURL(event.target.files[0]);
};

async function predict() {
	while (isPredicting) {
	  const predictedClass = tf.tidy(() => {
		const img = webcam.capture();
		const result = model.predict(img);
		var outp = result.dataSync();
		console.log(outp.length);
	
		return outp.indexOf(Math.max(...outp))
	  });
	  const classId = await predictedClass;
	  var predictionText = data_list[classId];
	  output.innerHTML = `Result : ${predictionText}`;
	  await tf.nextFrame();
	}
  }

async function startPredicting(){
	await webcam.setup();
	isPredicting = true;
	predict();
}

async function stopPredicting(){
	await webcam.stopit();
	isPredicting = false;
	predict();
}
document.addEventListener('DOMContentLoaded', run);
// run();
