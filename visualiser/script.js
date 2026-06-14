//Canvas
const canv = document.getElementById("VisualiserOverlay")
canv.width = window.innerWidth
canv.height = window.innerHeight
console.log(canv)
const BACKGROUND = "black"
const FOREGROUND = "#66cc00"
const ctx = canv.getContext("2d")
console.log(ctx)


//Projection Functions
function clear(){
    ctx.fillStyle = "#000000"
    ctx.fillRect(0,0,canv.width,canv.height)
}
function project(p){
    return{
        x: p.x*canv.width+canv.width/2,
        y: -p.y*canv.height+canv.height/2
    }
}
function fill(p,s,height){
    //ctx.fillStyle = FOREGROUND
    ctx.fillRect(p.x-s/2,p.y-s/2,s,height)
}



//Audio
const player = document.getElementById("playback")
player.style.width = canv.width + "px"
const context = new AudioContext()
const source  = context.createMediaElementSource(player)
const analyzer = context.createAnalyser()
source.connect(analyzer)
analyzer.connect(context.destination)
analyzer.fftSize = 2048
const data = new Uint8Array(analyzer.frequencyBinCount)


//Visualiser
function visualise(){
    analyzer.getByteFrequencyData(data)
    //console.log(data)
    let avg = average(data)
    //console.log(avg)
    clear()
    for(let i=0;i<data.length;i+=2){
        const multiplier = 1.5
        let color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
        ctx.fillStyle = color
        let magnitude = data[i]*multiplier
        if(magnitude <= avg*multiplier){
            fill(project({x: 2*i/canv.width,y: 0}),1,0)
            fill(project({x:2*-i/canv.width,y: 0}),1,0)
            fill(project({x:2*i/canv.width,y: 0}),1,0)
            fill(project({x:2*-i/canv.width,y: 0}),1,0)
        }
        else{
            fill(project({x: 2*i/canv.width,y: 0}),1,magnitude-(avg*multiplier))
            fill(project({x:2*-i/canv.width,y: 0}),1,magnitude-(avg*multiplier))
            fill(project({x:2*i/canv.width,y: 0}),1,-magnitude+(avg*multiplier))
            fill(project({x:2*-i/canv.width,y: 0}),1,-magnitude+(avg*multiplier))
        }
        
        
    }
}
function average(arr){
    const redu = arr.reduce((acc,val) => acc+val,0)
    return redu/arr.length
}


//File Management
const filepicker = document.getElementById("fileselector")
filepicker.addEventListener("change",()=>{player.src =URL.createObjectURL(filepicker.files[0])})


//Runtime
player.addEventListener("play", async () => {
    if (context.state === "suspended") {
        await context.resume();
    }
});

setInterval(visualise,16)