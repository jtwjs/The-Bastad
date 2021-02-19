'use strict';

(() => {

    const header = document.querySelector('#header');
    const navbar = document.querySelector('.navbar');
    const main = document.querySelector('#main');
    const footer = document.querySelector('#footer');
    const categories = {
        selectCategory(elm) {
            selectedCategory = elm;
        },
        select(elm) {
            elm.classList.add('active');
            this.selectCategory(elm);
        },
        unselect(elm) {
            elm.classList.remove('active');
        },
    };
     const section = [ 
    {
        scrollHeight: 0,
        objs: {
            navbarBtn: document.querySelector('.nav-item[data-category="home"]'),
            container: document.querySelector('#home'),
            content: document.querySelector('#home .content'),
            image: document.querySelector('.face'),
        },
     },
     {
        scrollHeight: 0,
        objs: {
            navbarBtn: document.querySelector('.nav-item[data-category="trailer"]'),
            container: document.querySelector('#trailer'),
            content: document.querySelector('#trailer .content'),
            canvas: document.querySelector('#trailer .image-blend-canvas'),
            context: document.querySelector('#trailer .image-blend-canvas').getContext('2d'),
            imagesPath: '../assets/2/trailer/trailer1.jpg',
            images: '',
        },
        values: {
            blendHeight: [0, 0, {start: 0, end: 0}],
            blendStart: '',
        },
     },
     {
        scrollHeight: 0,
        objs: {
            navbarBtn: document.querySelector('.nav-item[data-category="bekijk-film"]'),
            container: document.querySelector('#bekijk-film'),
            content: document.querySelector('#bekijk-film .content'),
            canvas: document.querySelector('#bekijk-film .image-blend-canvas'),
            context: document.querySelector('#bekijk-film .image-blend-canvas').getContext('2d'),
            imagesPath: '../assets/2/film/film1.jpg',
            images: '',
        },
        values: {
            blendHeight: [0, 0, {start: 0, end: 0}],
            blendStart: '',
        },
     },
     {
        scrollHeight: 0,
        objs: {
            navbarBtn: document.querySelector('.nav-item[data-category="over"]'),
            container: document.querySelector('#over'),
            content: document.querySelector('#over .content'),
            canvas: document.querySelector('#over .image-blend-canvas'),
            context: document.querySelector('#over .image-blend-canvas').getContext('2d'),
            imagesPath: '../assets/2/over/over1.jpg',
            images: '',
        },
        values: {
            blendHeight: [0, 0, {start: 0, end: 0}],
            blendStart: '',
        },
     },
     {
        scrollHeight: 0,
        objs: {
            navbarBtn: document.querySelector('.nav-item[data-category="de-makers"]'),
            container: document.querySelector('#de-makers'),
            content: document.querySelector('#de-makers .content'),
            canvas: document.querySelector('#de-makers .image-blend-canvas'),
            context: document.querySelector('#de-makers .image-blend-canvas').getContext('2d'),
            imagesPath: '../assets/2/makers/makers3.jpg',
            images: '',
        },
        values: {
            blendHeight: [0, 0, {start: 0, end: 0}],
            blendStart: '',
        },
     },
     {
        scrollHeight: 0,
        objs: {
            navbarBtn: document.querySelector('.nav-item[data-category="pers"]'),
            container: document.querySelector('#pers'),
            content: document.querySelector('#pers .content'),
            canvas: document.querySelector('#pers .image-blend-canvas'),
            context: document.querySelector('#pers .image-blend-canvas').getContext('2d'),
            imagesPath: '../assets/2/pers/pers1.jpg',
            images: '',
        },
        values: {
            blendHeight: [0, 0, {start: 0, end: 0}],
            blendStart: '',
        },
     },
     {
        scrollHeight: 0,
        objs: {
            navbarBtn: document.querySelector('.nav-item[data-category="contact"]'),
            container: document.querySelector('#contact'),
        },
     },
    ];

    let selectedCategory = document.querySelector('.nav-item');
    let yOffset = 0;
    let prevScrollHeight = 0;
    let currentScene = 0;
    let enterNewScene = false;
    let canvasScaleRatio;
    let acc = 0.1;
    let delayedYOffset = 0;
    let rafId;
    let rafState;
    let isMobile =  matchMedia("screen and (max-width:1024px)").matches;

    function oneOfThem(elem) {
        if(selectedCategory) {
            categories.unselect(selectedCategory);
        }
        categories.select(elem);
    }

    function setLayOut() {
        const sectionList = main.children;
        
        for(let i=0; i<sectionList.length; i++) {
            section[i].scrollHeight = sectionList[i].clientHeight;
            if(section[i].objs.canvas){
                section[i].values.blendStart = section[i].objs.canvas.offsetTop / sectionList[i].clientHeight;
            }
        }
        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for (let i = 0; i< section.length; i++) {
            totalScrollHeight += section[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
    }

    function setCanvasImages() {
        for(const x in section) {
            if(section[x].objs.imagesPath) {
                saveImage(x);
            }
        }

        function saveImage(index) {
            let imgElem = new Image();
            imgElem.src = section[index].objs.imagesPath;
            section[index].objs.images = imgElem;
        }
    }



    function calcValues(values, currentYOffset) {
        let result;
        const objs = section[currentScene].objs;
        const scrollHeight = section[currentScene].scrollHeight;
        // const scrollRatio = currentYOffset / scrollHeight;
        const partScrollStart = values[2].start * scrollHeight;
        const partScrollEnd =  values[2].end * scrollHeight;
        
        const partScrollHeight = partScrollEnd - partScrollStart;
        
        if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
            result = ((currentYOffset - partScrollStart) / partScrollHeight) * (values[1] - values[0]) + values[0]; 
        } else if (currentYOffset < partScrollStart) {
            result = values[0];
        } else if (currentYOffset > partScrollEnd) {
            result = values[1];
        }

        return result;
    }

    function scrollLoop() {
        const objs = section[currentScene].objs;
        enterNewScene = false;
        prevScrollHeight = 0;
        for (let i=0; i<currentScene; i++) {
            prevScrollHeight += section[i].scrollHeight;
        }


        if(yOffset + window.innerHeight > prevScrollHeight + section[currentScene].scrollHeight) {
            if(currentScene < section.length - 1) {
                objs.container.classList.remove('sticky');
                objs.content.style.marginBottom = `0`;
                currentScene++;
                enterNewScene = true;
                console.log(currentScene);
            }
        }

        if(yOffset + window.innerHeight < prevScrollHeight) {
            if(currentScene === 0) return;
            currentScene--;
            enterNewScene = true;
        }
        if(matchMedia("screen and (max-width: 768px)").matches && currentScene !== 0 ){   
            cancelAnimationFrame(rafId);
            rafState = false;
        }
        if(enterNewScene) return;
        playAnimation();
    }

    function playAnimation() {
        const objs = section[currentScene].objs;
        oneOfThem(objs.navbarBtn);

        switch(currentScene) {
            case 0: 
                if(matchMedia("screen and (max-width: 768px)").matches && !rafState){   
                    scrollImage();
                    rafId = requestAnimationFrame(scrollImage);
                    rafState = true;
                }
            break;
            case 1: 
            blendAnimation();
                break;
            case 2: 
            blendAnimation();
                break;
            case 3: 
            blendAnimation();
                break;
            case 4: 
            blendAnimation();
                break;
            case 5: 
            blendAnimation();
                break;
            case 6: break;
        };
    }

    function scrollImage() {
        const objs = section[currentScene].objs;
        const scrollHeight = section[currentScene].scrollHeight;
        const scrollRatio = yOffset / scrollHeight;
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;
        
        if(objs.image) {
            objs.image.style.top = `${delayedYOffset}px`;
        }

        rafId = requestAnimationFrame(scrollImage);

        if (Math.abs(yOffset - delayedYOffset) < 1) {
            cancelAnimationFrame(rafId);
            rafState = false;
        }
    }

    function blendAnimation() {
        const objs = section[currentScene].objs;
        const scrollHeight = section[currentScene].scrollHeight;
        const currentYOffset = yOffset - prevScrollHeight + window.innerHeight;
        const scrollRatio = currentYOffset / scrollHeight;
        const widthRatio = window.innerWidth / objs.canvas.width;
        const heightRatio = window.innerHeight / objs.canvas.height;
        const values = section[currentScene].values;

                if(widthRatio <= heightRatio) {
                    canvasScaleRatio = heightRatio;
                } else {
                    canvasScaleRatio = widthRatio;
                }
                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;

                values.blendHeight[0] = 0;
                values.blendHeight[1] = objs.canvas.height;
                values.blendHeight[2].start = values.blendStart;
                values.blendHeight[2].end = 1 - ((objs.canvas.height - objs.canvas.height * canvasScaleRatio) / scrollHeight);
                const blendHeight = calcValues(values.blendHeight, currentYOffset);

                objs.context.clearRect(0, 0, objs.canvas.width, objs.canvas.height);
                objs.context.drawImage(objs.images,
                    0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                    0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight);
                objs.container.classList.add('sticky')    
                    if(isMobile){
                        objs.content.style.marginBottom = `${objs.canvas.height * canvasScaleRatio + header.clientHeight - footer.clientHeight}px`;
                    }else {
                        objs.content.style.marginBottom = `${objs.canvas.height * canvasScaleRatio}px`;
                    }


                    if(!isMobile){
                        objs.canvas.style.marginTop = '-72px';
                    }
                
                if(scrollRatio > values.blendHeight[2].end || scrollRatio < values.blendHeight[2].start) {
                    objs.container.classList.remove('sticky');
                    objs.content.style.marginBottom = `0`;
                    objs.canvas.style.marginTop = '0';
                    
                }
    }    
    
    function headerClickHandler(e) {
        let target = e.target;
        if(target.nodeName === 'A') {
            const id = target.parentNode.dataset.category;
            scrollIntoView(id);
            navbar.classList.remove('open');

        }
        if(target.classList.contains('toggle-btn')) {
            target.parentNode.classList.toggle('open');
        }
    }

    function scrollIntoView(selector) {
        const scrollTo = document.getElementById(selector);
        const topValue = scrollTo.offsetTop;
        window.scrollTo({top: topValue === 0 ? topValue : topValue /*- header.clientHeight*/, behavior: 'smooth'});
    }

     
    window.addEventListener('load', () => {
        setLayOut();
        document.body.classList.remove('before-load');
        setLayOut();

        let tempYOffset = window.pageYOffset;
        let tempScrollCount = 0;
        if( tempYOffset > 0) {
            let siId = setInterval(() => {
                window.scrollTo(0, tempYOffset);
                tempYOffset -= 5;
                if(tempScrollCount > 20) {
                    clearInterval(siId);
                }

                tempScrollCount++;
            }, 20);
        }
        init();
    });

    
    
    
    function init(){
        window.addEventListener('scroll',function () {
            yOffset = window.pageYOffset;
            scrollLoop();
        })

        window.addEventListener('resize', () => {
            if(window.innerWidth > 900) {
                document.location.reload();
            }
            isMobile =  matchMedia("screen and (max-width:1024px)").matches;
        });

        window.addEventListener('orientationchange', () => {
            scrollTo(0,0);
            setTimeout(() => {
                document.location.reload();
            }, 500);
            
        });
        header.addEventListener('click', headerClickHandler);

        document.querySelector('.loading').addEventListener('transitionend', (e) => {
            document.body.removeChild(e.currentTarget);
        })
    };
    

    
    
    setCanvasImages();
})();