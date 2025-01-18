import { camera, moveCameraTo, animate, changeObjectTexturemain, ceiling } from './main.js';
import { changeObjectTextureminimap } from './minimap.js';

let lastClickedButton = "overview";
export { lastClickedButton };
let ismoving = false;

const overview = document.querySelector(".overview");
const topview = document.querySelector(".topview");
const centerlobby = document.querySelector(".CenterLobby");
const bedroom1 = document.querySelector(".bedroom1");
const bedroom2 = document.querySelector(".bedroom2");
const kitchen = document.querySelector(".kitchen");

overview.addEventListener("click", () => {
    ceiling.visible=true;
    if (ismoving === false){
        if (lastClickedButton != null) {
            ismoving = true;
            moveCameraTo({ x: 0, y: 15, z: 30 }, { x: 0, y: 5, z: 0 }, 1, "yes");
            setTimeout(() => {
                lastClickedButton = null;
                ismoving = false;
            }, 1000);
        }
    }
});

centerlobby.addEventListener("click", () => {
    if (ismoving === false){
        if (lastClickedButton==null) {
            ismoving = true;
            moveCameraTo({ x: -0.121, y: 1.5, z: 3.22 }, { x: -0.126, y: 1.5, z: 3.215 }, 0.5, "yes");
            setTimeout(() => {
                    lastClickedButton = "centerlobby";
                    ismoving = false;
            }, 550);
        }else if (lastClickedButton=="topview") {
            ismoving = true;
            moveCameraTo({ x: -0.121, y: 1.5, z: 3.22 }, { x: -0.126, y: 1.5, z: 3.215 }, 1, "no");
            setTimeout(() => {
                ceiling.visible=true;
                lastClickedButton = "centerlobby";
                ismoving = false;
            }, 1000);
        }
    }
});

topview.addEventListener("click",()=>{
    ceiling.visible=false;
    ismoving=true;
    moveCameraTo({ x: 0.6, y: 16, z: 1.52}, { x:0.6, y: 5, z: 1.52 }, 1, "no");
    setTimeout(()=>{
        ismoving=false;
    },1000);
    lastClickedButton="topview";
})


animate();