//script.js
var crsr = document.querySelector('.crsr');
var crsrblur = document.querySelector('.crsr-blur');

document.addEventListener('mousemove',(dets)=>{
    crsr.style.left = dets.x+"px";
    crsr.style.top = dets.y+"px";
    crsrblur.style.left = dets.x-150+"px";
    crsrblur.style.top = dets.y-150+"px";
})


gsap.to('.nav',{
    backgroundColor:"black",
    duration: 1.2,
    delay:0.5,
    height:"90px",
    scrollTrigger:{
        trigger:".nav",
        scroller:"body",
        // markers: true,
        start:"top -10%",
        end:"top -20%",
        scrub:1      
    }
})

gsap.to('.main',{
    backgroundColor:"black",
    scrollTrigger:{
        trigger:".main",
        scroller:"body",
        start:"top -75%",
        end:"top -150%",
        scrub:1
    }
})