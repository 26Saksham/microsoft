const video = document.getElementById("video");
var camera=true;
  function turnONcamera(){
      var text=document.getElementById("camera");
      if(text==="camera")
      {
camera = true;
document.getElementById("camera").innerHTML="video"
      }
if (text === "video") {
  camera = false;
  document.getElementById("camera").innerHTML = "camera";
}
  }
Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('./models') 
    //heavier/accurate version of tiny face detector
    
]).then(start)

function start() {
//   document.body.append("Models Loaded");

document.getElementById("file").setAttribute("value", "20");
document.getElementById("processText").innerHTML = "Models Loaded";

 if (camera) {
   navigator.getUserMedia(
     { video: {} },
     (stream) => (video.srcObject = stream),
     (err) => console.error(err)
   );
 } else {
   video.src = "./videos/speech.mp4";
 }

  console.log("video added");
  recognizeFaces();

}

async function recognizeFaces() {
document.getElementById("file").setAttribute("value", "60");

    const labeledDescriptors = await loadLabeledImages()
    console.log(labeledDescriptors)
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7)

console.log(faceMatcher);
    video.addEventListener('play', async () => {
        console.log('Playing')
        //   document.body.append("play");
        const canvas = faceapi.createCanvasFromMedia(video)


        document.body.append(canvas)

document.getElementById("file").setAttribute("value", "90");
        const displaySize = { width: video.width, height: video.height }
        faceapi.matchDimensions(canvas, displaySize)

        
document.getElementById("processText").innerHTML = "Start Processing";

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()

            const resizedDetections = faceapi.resizeResults(detections, displaySize)

            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

            const results = resizedDetections.map((d) => {
                return faceMatcher.findBestMatch(d.descriptor)
            })
            results.forEach( (result, i) => {
                const box = resizedDetections[i].detection.box
                const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
                drawBox.draw(canvas)
            })
        }, 100)


        
    })
    document.getElementById("file").setAttribute("value", "100");
}


function loadLabeledImages() {
document.getElementById("processText").innerHTML = "Label Image";

    const labels = ['Saksham'];
    // const labels = ['Prashant Kumar'] // for WebCam
document.getElementById("file").setAttribute("value", "25");
document.getElementById("processText").innerHTML ="Scanning Image";

    return Promise.all(
        labels.map(async (label)=>{
            const descriptions = []
            for(let i=1; i<=1; i++) {
                const img = await faceapi.fetchImage(`./labeled_images/${label}/${i}.jpg`);
    // document.body.append(img);
              
const detections = await faceapi
  .detectSingleFace(img)
  .withFaceLandmarks()
  .withFaceDescriptor();
console.log(label + i + JSON.stringify(detections));
// document.body.append("here"+detections);
if (!detections) {
  throw new Error(`no faces detected for ${label}`);
}
descriptions.push(detections.descriptor);
               
                

               
            }
document.getElementById("processText").innerHTML = "Faces Loaded";

            // document.body.append(label+' Faces Loaded | ')
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
    
}
