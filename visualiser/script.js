//Canvas
const canv = document.getElementById("abc")
console.log(canv)
const BACKGROUND = "#101010"
const FOREGROUND = "#66cc00"
canv.height = 800
canv.width = 1920
const ctx = canv.getContext("2d")
console.log(ctx)
function clear(){
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0,0,canv.width,canv.height)
}
function project(p){
    return{
        x: p.x*canv.width+canv.width/2,
        y: -p.y*canv.height+canv.height/2
    }
}
function fill(p,s,height){
    ctx.fillStyle = FOREGROUND
    ctx.fillRect(p.x-s/2,p.y-s/2,s,height)
}
//Audio
const player = document.getElementById("playback")
player.addEventListener("timeupdate",visualise)
/*function foo(){
    const localmul = 0.1
    if(player.currentTime==0){
        mul=0
    }
    console.log(player.currentTime)
    mul += player.currentTime*localmul
    clear()
    const divi = 0.01
    for(let i = -1; i<=1 ; i+=divi){

        fill(project({x: i,y: 0}))
    }
}*/
const context = new AudioContext()
const source  = context.createMediaElementSource(player)
const analyzer = context.createAnalyser()
source.connect(analyzer)
analyzer.connect(context.destination)
analyzer.fftSize = 2048
const data = new Uint8Array(analyzer.frequencyBinCount)
function visualise(){
    analyzer.getByteFrequencyData(data)
    console.log(data)
    clear()
    for(let i=0;i<data.length;i++){
        fill(project({x: i/1024,y: 0}),0.5,data[i])
        fill(project({x: -i/1024,y: 0}),0.5,data[i])
        fill(project({x: i/1024,y: 0}),0.5,-data[i])
        fill(project({x: -i/1024,y: 0}),0.5,-data[i])
    }
}