//Thank you TSoding for making me learn javascript.
const game = document.getElementById("video_game")
console.log(game)
const BACKGROUND = "#101010"
const FOREGROUND = "#FF50FF"
game.width = 800
game.height = 800
const ctx = game.getContext("2d")
console.log(ctx)
function clear(){

    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0,0,game.width,game.height)
}
function fill({x,y}){
    const s  = 20
    ctx.fillStyle = FOREGROUND
    ctx.fillRect(x-s/2,y-s/2,s,s)
}
function screen(p){
    return {
        x: (p.x + 1)/2*game.width,
        y: (1- (p.y + 1)/2)*game.height,
    }
}
function project({x,y,z}){
    return {
        x: x/z,
        y: y/z
    }
}

const vs = [
    {x: -0.5, y: 0.5, z: 0.5},
    {x: 0.5, y: 0.5, z: 0.5},
    { x: 0.5, y: -0.5, z: 0.5},
    { x: -0.5, y: -0.5, z: 0.5},

    {x: -0.5, y: 0.5, z: -0.5},
    {x: 0.5, y: 0.5, z: -0.5},
    { x: 0.5, y: -0.5, z: -0.5},
    { x: -0.5, y: -0.5, z: -0.5},
]

const fs = [
    [0,1,2,3],
    [4,5,6,7],
    [0,4],
    [1,5],
    [2,6],
    [3,7]
]

const FPS = 60
let dz = 1
let angle =0

function rotate({x,y,z}, angle){
    return {
        x: x*Math.cos(angle)-z*Math.sin(angle),
        y,
        z: x*Math.sin(angle)+z*Math.cos(angle),
    }
}
function translate_z({x,y,z},dz){
    return {x: x, y: y, z: z + dz}
}

function line(p1,p2){
    ctx.lineWidth = 3
    ctx.strokeStyle = FOREGROUND
    ctx.beginPath()
    ctx.moveTo(p1.x,p1.y)
    ctx.lineTo(p2.x,p2.y)
    ctx.stroke()
}


function frame(){
    const dt = 1/FPS
    dz += 1*dt
    angle += Math.PI*dt
    clear()
    for(const v of vs){
        //fill(screen(project(translate_z(rotate(v,angle),dz))))
        //fill(screen(project(rotate(v,angle))))
    }
    for(const f of fs){
        for(let i =0 ; i<f.length;i++){
            const a = vs[f[i]]
            const b = vs[f[(i+1)%f.length]]
            line(screen(project(translate_z(rotate(a,angle),dz))),screen(project(translate_z(rotate(b,angle),dz))))
        }
    }
    setTimeout(frame,1000/FPS)
}
setTimeout(frame,1000/FPS)